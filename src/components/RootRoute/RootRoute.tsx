import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { LoginPage } from "src/pages/LoginPage/LoginPage";
import ChessTutorial from "src/pages/ChessTutorial/ChessTutorial";
import { Layout } from "src/Layout/Layout";
import Loader from "src/components/Loader/Loader";

/**
 * RootRoute component that conditionally renders LoginPage or ChessTutorial
 * based on authentication state. This component handles the root "/" route
 * and eliminates the need for a separate "/login" route.
 */
export function RootRoute(): React.ReactElement {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.settings
  );

  // Show loading state while authentication is being checked
  if (loading) {
    return <Loader />;
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
