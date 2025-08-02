import { ChessTutorialButtonWrap, LinkHeader } from "./styles";

export type WidgetSize = "small" | "large";

interface ChessTutorialButtonProps {
  title: string;
  image: string;
  onClick?: () => void;
  widgetSize?: WidgetSize;
  to?: string;
}

function ChessTutorialButton({
  title,
  image,
  onClick,
  widgetSize,
  to,
}: ChessTutorialButtonProps) {
  return (
    <ChessTutorialButtonWrap
      onClick={onClick}
      $image={image}
      $widgetSize={widgetSize || "small"}
      to={to || "#"}
    >
      <LinkHeader $widgetSize={widgetSize || "small"}>{title}</LinkHeader>
    </ChessTutorialButtonWrap>
  );
}

export default ChessTutorialButton;
