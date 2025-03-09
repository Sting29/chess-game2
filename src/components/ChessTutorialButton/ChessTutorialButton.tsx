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
      <LinkHeader>{title}</LinkHeader>
      <Image src={image} height={200} />
    </ChessTutorialButtonWrap>
  );
}

export default ChessTutorialButton;
