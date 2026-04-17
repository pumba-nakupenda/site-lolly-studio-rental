interface LogoProps {
  className?: string;
  color?: "black" | "white";
  height?: number;
}

export default function Logo({ className = "", color = "black", height = 28 }: LogoProps) {
  const textColor = color === "white" ? "#ffffff" : "#2d2f2f";
  const dotColor = "#fed000";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 138 44"
      height={height}
      className={className}
      aria-label="LOLLY"
      role="img"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=MuseoModerno:ital,wght@1,900&display=swap');`}</style>
      <text
        x="0"
        y="37"
        fontFamily="'MuseoModerno', sans-serif"
        fontWeight="900"
        fontStyle="italic"
        fontSize="42"
        fill={textColor}
        letterSpacing="-1"
      >
        LOLLY
      </text>
      <circle cx="126" cy="35" r="4.5" fill={dotColor} />
    </svg>
  );
}
