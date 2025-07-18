import { PreloaderContainer, ChessIcon } from "./styles";

interface LoaderProps {
  className?: string;
}

export function Loader({ className }: LoaderProps) {
  return (
    <PreloaderContainer className={className}>
      <ChessIcon />
    </PreloaderContainer>
  );
}

export default Loader;
