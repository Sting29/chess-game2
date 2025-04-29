import { ChessTutorialButtonWrap, LinkHeader } from "./styles";

export type WidgetSize = "small" | "large";

interface ChessTutorialButtonProps {
  title: string;
  image: string;
  onClick: () => void;
  widgetSize?: WidgetSize;
}

function ChessTutorialButton({
  title,
  image,
  onClick,
  widgetSize,
}: ChessTutorialButtonProps) {
  return (
    <ChessTutorialButtonWrap
      onClick={onClick}
      $image={image}
      $widgetSize={widgetSize || "small"}
    >
      <LinkHeader $widgetSize={widgetSize || "small"}>{title}</LinkHeader>
    </ChessTutorialButtonWrap>
  );
}

export default ChessTutorialButton;
