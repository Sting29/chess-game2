import styled from "styled-components";

export const TestContainer = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

export const TestTitle = styled.h1`
  margin-bottom: 30px;
`;

export const TestSection = styled.div`
  margin-bottom: 40px;
`;

export const TestCaseTitle = styled.h2`
  margin-bottom: 20px;
`;

export const TestCaseContainer = styled.div<{
  $borderColor: string;
  $backgroundColor: string;
}>`
  border: 2px solid ${(props) => props.$borderColor};
  padding: 20px;
  border-radius: 10px;
  background-color: ${(props) => props.$backgroundColor};
`;

export const ExpectedBehaviorTitle = styled.h3`
  margin-bottom: 15px;
`;

export const BehaviorList = styled.ul`
  margin: 0;
  padding-left: 20px;
`;

export const BehaviorItem = styled.li`
  margin-bottom: 8px;
`;

export const ChessBoardContainer = styled.div`
  margin-top: 20px;
`;

export const InstructionsContainer = styled.div`
  background-color: #e8f5e8;
  padding: 20px;
  border-radius: 10px;
  margin-top: 40px;
`;

export const InstructionsTitle = styled.h2`
  margin-bottom: 20px;
`;

export const InstructionsList = styled.ol`
  margin: 0;
  padding-left: 20px;
`;

export const InstructionItem = styled.li`
  margin-bottom: 15px;
`;

export const InstructionSubList = styled.ul`
  margin-top: 10px;
  padding-left: 20px;
`;

export const InstructionSubItem = styled.li`
  margin-bottom: 8px;
`;

export const SuccessCriteriaTitle = styled.h3`
  margin-top: 30px;
  margin-bottom: 15px;
`;

export const SuccessCriteriaText = styled.p`
  margin: 8px 0;
  font-weight: 500;
`;

export const StrongText = styled.strong`
  font-weight: bold;
`;
