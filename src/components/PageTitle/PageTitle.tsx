import styled from "styled-components";

const StyledTitle = styled.h1`
  color: #333;
  margin: 40px 0 20px;
  text-align: center;
  font-family: "RubikOne", sans-serif;
  font-size: 70px;
  line-height: 74px;
  color: #fff7db;
  -webkit-text-stroke: 1px black;
`;

interface PageTitleProps {
  title: string | undefined;
}

export function PageTitle({ title }: PageTitleProps) {
  return <StyledTitle>{title}</StyledTitle>;
}
