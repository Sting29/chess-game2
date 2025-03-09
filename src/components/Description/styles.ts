import styled from "styled-components";

export const DescriptionContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
`;

export const Title = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
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
