/**
 * Error Boundary специально для lazy-загружаемых компонентов
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Loader } from "src/components/Loader/Loader";

interface Props {
  children: ReactNode;
  retryKey?: string | number; // Ключ для принудительного перерендера
}

interface State {
  hasError: boolean;
  isRetrying: boolean;
  retryCount: number;
}

/**
 * Error Boundary для lazy-компонентов с автоматическими повторными попытками
 */
export class LazyErrorBoundary extends Component<Props, State> {
  private retryTimeoutId?: NodeJS.Timeout;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 секунда

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      isRetrying: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
      isRetrying: false,
      retryCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Lazy loading error:", error);
    console.error("Error Info:", errorInfo);

    // Автоматически пробуем перезагрузить, если это ошибка загрузки чанка
    if (
      this.isChunkLoadError(error) &&
      this.state.retryCount < this.maxRetries
    ) {
      this.autoRetry();
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Сброс состояния ошибки при изменении retryKey
    if (prevProps.retryKey !== this.props.retryKey && this.state.hasError) {
      this.setState({
        hasError: false,
        isRetrying: false,
        retryCount: 0,
      });
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private isChunkLoadError = (error: Error): boolean => {
    return (
      error.name === "ChunkLoadError" ||
      error.message.includes("Loading chunk") ||
      error.message.includes("Loading CSS chunk") ||
      error.message.includes("Failed to import")
    );
  };

  private autoRetry = () => {
    this.setState({ isRetrying: true });

    this.retryTimeoutId = setTimeout(() => {
      this.setState((prevState) => ({
        hasError: false,
        isRetrying: false,
        retryCount: prevState.retryCount + 1,
      }));
    }, this.retryDelay);
  };

  private handleManualRetry = () => {
    this.setState({
      hasError: false,
      isRetrying: false,
      retryCount: 0,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.isRetrying) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
            padding: "2rem",
          }}
        >
          <Loader />
          <p style={{ marginTop: "1rem", color: "#6c757d" }}>
            Retrying to load page... ({this.state.retryCount + 1}/
            {this.maxRetries})
          </p>
        </div>
      );
    }

    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#fff3cd",
            borderRadius: "8px",
            margin: "1rem",
            border: "1px solid #ffeaa7",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
            }}
          >
            📦
          </div>

          <h3
            style={{
              color: "#856404",
              marginBottom: "0.5rem",
              fontSize: "1.25rem",
            }}
          >
            Failed to Load Page
          </h3>

          <p
            style={{
              color: "#856404",
              marginBottom: "1.5rem",
              maxWidth: "400px",
            }}
          >
            This page couldn't be loaded. This might be due to a network issue
            or an updated version of the app.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={this.handleManualRetry}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#ffc107",
                color: "#212529",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              Try Again
            </button>

            <button
              onClick={this.handleReload}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Reload Page
            </button>
          </div>

          {this.state.retryCount >= this.maxRetries && (
            <p
              style={{
                marginTop: "1rem",
                fontSize: "0.875rem",
                color: "#856404",
              }}
            >
              Maximum retry attempts reached. Please reload the page manually.
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
