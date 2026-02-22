interface CorpoFalaLogoProps {
  size?: number;
  className?: string;
  color?: string;
}

/** Pulse icon — three concentric circles */
export const CorpoFalaIcon = ({ size = 18, className, color = "currentColor" }: CorpoFalaLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <circle cx="16" cy="16" r="3.2" fill={color} />
    <circle cx="16" cy="16" r="7.5" stroke={color} strokeWidth="1.2" opacity="0.30" />
    <circle cx="16" cy="16" r="12" stroke={color} strokeWidth="1" opacity="0.12" />
  </svg>
);

interface CorpoFalaLogoMarkProps {
  iconSize?: number;
  textClass?: string;
  accentColor?: string;
  className?: string;
  onClick?: () => void;
}

/** Logo mark: Pulse icon + "CorpoFala" (serif, accent on "Fala") */
export const CorpoFalaLogoMark = ({
  iconSize = 18,
  textClass = "text-corpo-dark",
  accentColor = "#C4622D",
  className,
  onClick,
}: CorpoFalaLogoMarkProps) => (
  <div
    className={`flex items-center gap-2.5 ${onClick ? "cursor-pointer" : ""} ${className || ""}`}
    onClick={onClick}
  >
    <CorpoFalaIcon size={iconSize} />
    <span
      style={{
        fontFamily: "'DM Serif Display', serif",
        fontWeight: 400,
        letterSpacing: "-0.015em",
        fontSize: iconSize * 0.9,
      }}
      className={textClass}
    >
      Corpo<span style={{ color: accentColor }}>Fala</span>
    </span>
  </div>
);
