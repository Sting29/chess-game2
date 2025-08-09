import styled from "styled-components";

interface NotificationContainerProps {
  color: "error" | "warning" | "info";
}

export const NotificationContainer = styled.div<NotificationContainerProps>`
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 400px;
  min-width: 300px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  background-color: ${(props) => {
    switch (props.color) {
      case "error":
        return "#fee";
      case "warning":
        return "#fff3cd";
      case "info":
        return "#e3f2fd";
      default:
        return "#f5f5f5";
    }
  }};

  border-left: 4px solid
    ${(props) => {
      switch (props.color) {
        case "error":
          return "#dc3545";
        case "warning":
          return "#ffc107";
        case "info":
          return "#2196f3";
        default:
          return "#6c757d";
      }
    }};

  color: ${(props) => {
    switch (props.color) {
      case "error":
        return "#721c24";
      case "warning":
        return "#856404";
      case "info":
        return "#0d47a1";
      default:
        return "#495057";
    }
  }};

  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 10px;
    left: 10px;
    right: 10px;
    max-width: none;
    min-width: auto;
  }
`;

export const NotificationContent = styled.div`
  flex: 1;
  line-height: 1.4;

  > div:first-child {
    margin-bottom: 4px;
    font-weight: 600;
  }

  > div:last-child {
    font-size: 14px;
  }
`;

export const NotificationActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
`;

export const RefreshButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
`;

export const DismissButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #6c757d;
  border-radius: 4px;
  background-color: transparent;
  color: #6c757d;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #6c757d;
    color: white;
  }

  &:focus {
    outline: 2px solid #6c757d;
    outline-offset: 2px;
  }
`;
