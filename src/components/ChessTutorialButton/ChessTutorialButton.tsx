import { ChessTutorialButtonWrap, LinkHeader } from "./styles";
import CompletionIndicator from "../CompletionIndicator";

export type WidgetSize = "small" | "large";

interface ChessTutorialButtonProps {
  title: string;
  image: string;
  onClick?: () => void;
  widgetSize?: WidgetSize;
  to?: string;
  isCompleted?: boolean;
}

function ChessTutorialButton({
  title,
  image,
  onClick,
  widgetSize,
  to,
  isCompleted = false,
}: ChessTutorialButtonProps) {
  return (
    <ChessTutorialButtonWrap
      onClick={onClick}
      $image={image}
      $widgetSize={widgetSize || "small"}
      to={to || "#"}
    >
      <LinkHeader $widgetSize={widgetSize || "small"}>{title}</LinkHeader>
      <CompletionIndicator isCompleted={isCompleted} />
    </ChessTutorialButtonWrap>
  );
}

export default ChessTutorialButton;
