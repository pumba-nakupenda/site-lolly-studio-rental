'use client';

import { useEffect } from 'react';

export default function AcademyBodyClass() {
  useEffect(() => {
    document.body.classList.add('academy-light');
    return () => {
      document.body.classList.remove('academy-light');
    };
  }, []);
  return null;
}
