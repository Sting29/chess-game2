import { ChessTutorialButtonWrap, LinkHeader } from "./styles";
import Image from "../Image/Image";

interface ChessTutorialButtonProps {
  title: string;
  image: string;
  onClick: () => void;
}

function ChessTutorialButton({
  title,
  image,
  onClick,
}: ChessTutorialButtonProps) {
  return (
    <ChessTutorialButtonWrap onClick={onClick}>
      <Image src={image} height={280} />
      <LinkHeader>{title}</LinkHeader>
    </ChessTutorialButtonWrap>
  );
}

export default ChessTutorialButton;
