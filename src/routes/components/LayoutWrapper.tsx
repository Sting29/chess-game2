/**
 * Компонент для обертки контента в Layout
 */

import React from "react";
import { Layout } from "src/Layout/Layout";

interface LayoutWrapperProps {
  children: React.ReactElement;
  useLayout?: boolean;
}

/**
 * Компонент-обертка для Layout
 * Может условно применять Layout в зависимости от флага
 */
export function LayoutWrapper({
  children,
  useLayout = true,
}: LayoutWrapperProps): React.ReactElement {
  if (!useLayout) {
    return children;
  }

  return <Layout>{children}</Layout>;
}
