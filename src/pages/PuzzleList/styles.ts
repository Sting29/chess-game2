import styled from "styled-components";
import backgroundPuzzlesSelect from "src/assets/background/background_puzzles_select.png";

export const TutorialPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 96px);
  padding: 0 40px;
  background-image: url(${backgroundPuzzlesSelect});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
`;

export const PuzzleCategories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 24px;
`;

export const PuzzleCategory = styled.div`
  background: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 24px 20px 16px 20px;
  cursor: pointer;
  flex: 1 1 220px;
  min-width: 220px;
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.13);
    transform: translateY(-2px) scale(1.03);
  }
  h2 {
    margin: 0 0 8px 0;
    font-size: 1.2rem;
  }
  p {
    margin: 0 0 12px 0;
    color: #666;
    font-size: 1rem;
  }
`;

export const PuzzleCount = styled.span`
  display: inline-block;
  margin-top: 8px;
  font-size: 0.95rem;
  color: #888;
`;

export const PuzzleListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 24px;
`;

export const PuzzleItem = styled.div`
  background: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  padding: 18px 16px 12px 16px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.13);
    transform: translateY(-1px) scale(1.02);
  }
  h3 {
    margin: 0 0 6px 0;
    font-size: 1.1rem;
  }
  p {
    margin: 0;
    color: #666;
    font-size: 0.98rem;
  }
`;
