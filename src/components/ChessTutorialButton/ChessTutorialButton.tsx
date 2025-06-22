import { ChessTutorialButtonWrap, LinkHeader } from "./styles";

export type WidgetSize = "small" | "large";

interface ChessTutorialButtonProps {
  title: string;
  image: string;
  onClick?: () => void;
  widgetSize?: WidgetSize;
  href?: string;
}

function ChessTutorialButton({
  title,
  image,
  onClick,
  widgetSize,
  href,
}: ChessTutorialButtonProps) {
  return (
    <ChessTutorialButtonWrap
      onClick={onClick}
      $image={image}
      $widgetSize={widgetSize || "small"}
      href={href}
    >
      <LinkHeader $widgetSize={widgetSize || "small"}>{title}</LinkHeader>
    </ChessTutorialButtonWrap>
  );
}

export default ChessTutorialButton;
