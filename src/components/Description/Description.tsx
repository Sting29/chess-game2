import { DescriptionContainer, Title, HintsList, HintItem } from "./styles";

export const Description = ({
  title,
  hints,
}: {
  title: string;
  hints: string[];
}) => {
  return (
    <DescriptionContainer>
      <Title>{title}</Title>
      <HintsList>
        {hints.map((hint, index) => (
          <HintItem key={index}>{hint}</HintItem>
        ))}
      </HintsList>
    </DescriptionContainer>
  );
};
