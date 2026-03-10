export const BlinkingDot = ({ colorClassName }: { colorClassName: string }) => (
  <span className="relative flex h-2 w-2">
    <span
      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorClassName} opacity-75`}
    ></span>
    <span className={`relative inline-flex rounded-full h-2 w-2 ${colorClassName}`}></span>
  </span>
);
