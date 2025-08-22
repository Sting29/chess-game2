/**
 * Глобальный Error Boundary для всего приложения
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { ROUTES } from "../constants";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

/**
 * Глобальный Error Boundary для критических ошибок приложения
 */
export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = Date.now().toString(36);
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Global Error Boundary caught a critical error:", error);
    console.error("Error Info:", errorInfo);
    console.error("Component Stack:", errorInfo.componentStack);

    // В production отправляем ошибку в систему мониторинга
    if (process.env.NODE_ENV === "production") {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // TODO: Implement API error reporting
    // See ToDo-API-report-bug.md for implementation details
    console.log("Error reporting not yet implemented");
  };

  private handleRestart = () => {
    // Очищаем состояние ошибки
    this.setState({ hasError: false, error: undefined, errorId: undefined });

    // Перенаправляем на главную страницу
    window.location.href = ROUTES.ROOT;
  };

  private handleReportBug = () => {
    const subject = encodeURIComponent(
      `Chess App Error Report - ${this.state.errorId}`
    );
    const body = encodeURIComponent(
      `Error ID: ${this.state.errorId}\n` +
        `Timestamp: ${new Date().toISOString()}\n` +
        `URL: ${window.location.href}\n` +
        `User Agent: ${navigator.userAgent}\n\n` +
        `Error: ${this.state.error?.name}\n` +
        `Message: ${this.state.error?.message}\n\n` +
        `Please describe what you were doing when this error occurred:\n\n`
    );

    // Открываем почтовый клиент для отправки отчета
    window.open(`mailto:support@chess-app.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "500px" }}>
            <h1 style={{ color: "#dc3545", marginBottom: "1rem" }}>
              Application Error
            </h1>

            <p style={{ marginBottom: "2rem", color: "#6c757d" }}>
              The chess application encountered an unexpected error. Please
              restart the application or report the issue.
            </p>

            <div
              style={{
                marginBottom: "2rem",
                fontSize: "0.9rem",
                color: "#666",
              }}
            >
              <strong>Error ID:</strong> {this.state.errorId}
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={this.handleRestart}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Restart Application
              </button>

              <button
                onClick={this.handleReportBug}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Report Bug
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
