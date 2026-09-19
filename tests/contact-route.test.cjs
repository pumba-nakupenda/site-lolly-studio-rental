const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { webcrypto } = require('node:crypto');
const vm = require('node:vm');
const ts = require('typescript');

const source = readFileSync(require.resolve('../src/app/api/contact/route.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function routeWithMocks({ dbError = null, mailError = null, emailKey = 'test-key' } = {}) {
  const calls = { inserts: [], emails: [] };
  const exports = {};
  const sandbox = {
    exports,
    Request,
    Response,
    crypto: webcrypto,
    process: { env: { RESEND_API_KEY: emailKey, RESEND_FROM_EMAIL: 'LOLLY <notifications@lolly.sn>' } },
    console: { error() {} },
    require(name) {
      if (name === '@/lib/supabase/server') return {
        createClient: async () => ({ from: () => ({ insert: async (row) => {
          calls.inserts.push(row);
          return { error: dbError };
        } }) }),
      };
      if (name === 'resend') return { Resend: class {
        emails = { send: async (email, options) => {
          calls.emails.push({ email, options });
          return { data: mailError ? null : { id: 'mail-test' }, error: mailError };
        } };
      } };
      throw new Error(`Unexpected import: ${name}`);
    },
  };
  vm.runInNewContext(compiled, sandbox, { filename: 'contact-route.ts' });
  return { POST: exports.POST, calls };
}

function request(body) {
  return new Request('http://localhost/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
}

const contact = { name: 'Awa Test', email: 'awa@example.com', message: 'Bonjour', request_type: 'general' };

test('contact: sauvegarde Supabase puis notification Kane', async () => {
  const { POST, calls } = routeWithMocks();
  const response = await POST(request(contact));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true, notificationSent: true });
  assert.equal(calls.inserts.length, 1);
  assert.equal(calls.emails[0].email.to[0], 'kane@lolly.sn');
  assert.equal(calls.emails[0].email.replyTo, 'awa@example.com');
  assert.match(calls.emails[0].options.idempotencyKey, /^contact-/);
});

test('diagnostic Academy: conserve la synthèse et l’envoie dans l’e-mail', async () => {
  const { POST, calls } = routeWithMocks();
  const response = await POST(request({ ...contact, request_type: 'academy_registration', request_data: {
    offer: 'conseil', diagnostic: 'Activité : <script>alert(1)</script>',
  } }));
  assert.equal(response.status, 200);
  assert.equal(calls.inserts[0].request_type, 'general');
  assert.equal(calls.inserts[0].request_data.diagnostic, 'Activité : <script>alert(1)</script>');
  assert.match(calls.emails[0].email.subject, /Diagnostic LOLLY Academy/);
  assert.match(calls.emails[0].email.html, /&lt;script&gt;/);
  assert.doesNotMatch(calls.emails[0].email.html, /<script>/);
});

test('erreur Resend: la demande reste enregistrée sans prétendre que l’e-mail est parti', async () => {
  const { POST, calls } = routeWithMocks({ mailError: { name: 'validation_error' } });
  const response = await POST(request(contact));
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { success: true, notificationSent: false });
  assert.equal(calls.inserts.length, 1);
});

test('erreur Supabase: aucun e-mail n’est envoyé', async () => {
  const { POST, calls } = routeWithMocks({ dbError: { message: 'insert rejected' } });
  const response = await POST(request(contact));
  assert.equal(response.status, 500);
  assert.equal(calls.emails.length, 0);
});
