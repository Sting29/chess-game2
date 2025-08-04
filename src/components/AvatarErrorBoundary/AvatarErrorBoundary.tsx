import React, { Component, ErrorInfo, ReactNode } from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

const ErrorFallback = styled.div<{ size?: number }>`
  width: ${(props) => props.size || 80}px;
  height: ${(props) => props.size || 80}px;
  border-radius: 50%;
  background: #f0f0f0;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.size || 80) * 0.4}px;
  color: #666;
`;

class AvatarErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Avatar component error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback>👤</ErrorFallback>;
    }

    return this.props.children;
  }
}

export default AvatarErrorBoundary;
