import styled from "styled-components";

export const ProgressButton = styled.button`
  padding: 15px 30px;
  border-radius: 25px;
  border: 3px solid #f0d070;
  background: linear-gradient(135deg, #f0d070 0%, #e6c04a 100%);
  color: #3e302a;
  font-family: "RubikOne", sans-serif;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 20px auto;
  min-width: 200px;
  display: block;

  &:hover {
    background: linear-gradient(135deg, #e6c04a 0%, #d4af37 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  border: 3px solid #f0d070;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 2px solid #f0d070;
  padding-bottom: 15px;
`;

export const ModalTitle = styled.h2`
  font-family: "RubikOne", sans-serif;
  font-size: 28px;
  color: #3e302a;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  color: #3e302a;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(240, 208, 112, 0.3);
  }
`;

export const ProgressSection = styled.div`
  margin-bottom: 25px;
  padding: 20px;
  background: rgba(240, 208, 112, 0.1);
  border-radius: 15px;
  border: 2px solid rgba(240, 208, 112, 0.3);
`;

export const CategoryTitle = styled.h3`
  font-family: "RubikOne", sans-serif;
  font-size: 22px;
  color: #3e302a;
  margin: 0 0 15px 0;
  text-align: center;
`;

export const ProgressItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
`;

export const ProgressBar = styled.div`
  flex: 1;
  height: 20px;
  background: rgba(200, 200, 200, 0.5);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(240, 208, 112, 0.5);
`;

export const ProgressText = styled.span`
  font-family: "WendyOne", sans-serif;
  font-size: 16px;
  color: #3e302a;
  min-width: 120px;
  text-align: center;
`;

export const NoProgressText = styled.div`
  text-align: center;
  font-family: "WendyOne", sans-serif;
  font-size: 18px;
  color: #666;
  padding: 40px 20px;
`;

export const LoadingText = styled.div`
  text-align: center;
  font-family: "WendyOne", sans-serif;
  font-size: 18px;
  color: #3e302a;
  padding: 40px 20px;
`;

export const ErrorText = styled.div`
  text-align: center;
  font-family: "WendyOne", sans-serif;
  font-size: 16px;
  color: #d32f2f;
  padding: 20px;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 0, 0, 0.3);
`;
