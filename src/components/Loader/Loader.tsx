import { PreloaderContainer, ChessIcon } from "./styles";

interface LoaderProps {
  className?: string;
  ariaLabel?: string;
  size?: "small" | "medium" | "large";
}

export function Loader({
  className,
  ariaLabel = "Loading",
  size = "medium",
}: LoaderProps) {
  return (
    <PreloaderContainer
      className={className}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <ChessIcon $size={size} />
      <span
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {ariaLabel}
      </span>
    </PreloaderContainer>
  );
}

export default Loader;
