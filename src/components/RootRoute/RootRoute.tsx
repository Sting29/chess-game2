import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { LoginPage } from "src/pages/LoginPage/LoginPage";
import ChessTutorial from "src/pages/ChessTutorial/ChessTutorial";
import { Layout } from "src/Layout/Layout";
import FullScreenLoader from "src/components/FullScreenLoader/FullScreenLoader";
// Removed Loader import as per loader refactoring requirements

/**
 * RootRoute component that conditionally renders LoginPage or ChessTutorial
 * based on authentication state. This component handles the root "/" route
 * and eliminates the need for a separate "/login" route.
 */
export function RootRoute(): React.ReactElement {
  const { isAuthenticated, initialCheckComplete } = useSelector(
    (state: RootState) => state.settings
  );

  // Show loading screen while checking authentication
  if (!initialCheckComplete) {
    return <FullScreenLoader message="Loading..." />;
  }

  // Show LoginPage without Layout wrapper for unauthenticated users
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show ChessTutorial with Layout wrapper for authenticated users
  return (
    <Layout>
      <ChessTutorial />
    </Layout>
  );
}
