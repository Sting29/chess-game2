import styled from "styled-components";
import hint from "src/assets/images/hint.png";

export const DescriptionContainer = styled.div`
  padding: 24px 44px 60px 34px;
  border-radius: 8px;
  margin: 1rem 0;
  background-image: url(${hint});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 314px;
  height: 386px;
`;

export const Title = styled.h3`
  color: #333;
  margin-bottom: 4px;
  margin-left: 10px;
`;

export const HintsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const HintItem = styled.li`
  color: #555;
  padding: 0.5rem 0;
  display: flex;
  align-items: flex-start;

  &:before {
    content: "•";
    margin-right: 0.5rem;
  }
`;
