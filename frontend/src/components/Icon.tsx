interface IconProps {
  src: string;
  className?: string;
  colorClass?: string;
}

export default function Icon({ src, className = "w-6 h-6", colorClass = "bg-slate-600" }: IconProps) {
  return (
    <div
      className={`${className} ${colorClass}`}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        display: "inline-block",
      }}
    />
  );
}
