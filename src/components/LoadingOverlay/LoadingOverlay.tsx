import React, { useEffect, useRef } from "react";
import {
  OverlayContainer,
  OverlayBackdrop,
  LoaderWrapper,
  Message,
  ScreenReaderOnly,
} from "./styles";
import Loader from "../Loader/Loader";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}

export function LoadingOverlay({
  isVisible,
  message,
  children,
  ariaLabel = "Loading",
}: LoadingOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Handle focus management
  useEffect(() => {
    if (isVisible) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus the overlay for screen readers
      if (overlayRef.current) {
        overlayRef.current.focus();
      }
    } else {
      // Restore focus when loading is complete
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isVisible]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      // Allow escape key to be handled by parent components
      return;
    }

    // Prevent other keyboard interactions while loading
    if (isVisible) {
      event.preventDefault();
    }
  };

  return (
    <OverlayContainer>
      {children}
      {isVisible && (
        <OverlayBackdrop
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-busy="true"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          <LoaderWrapper>
            <Loader />
            {message && (
              <>
                <Message aria-live="polite" aria-atomic="true">
                  {message}
                </Message>
                <ScreenReaderOnly aria-live="assertive">
                  {message}
                </ScreenReaderOnly>
              </>
            )}
          </LoaderWrapper>
        </OverlayBackdrop>
      )}
    </OverlayContainer>
  );
}

export default LoadingOverlay;
