/**
 * Компонент для автоматического управления мета-данными страниц
 */

import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { metadataUtils } from "../metadata";

interface MetadataProviderProps {
  children: React.ReactNode;
}

/**
 * Провайдер для автоматического обновления мета-данных
 * на основе текущего маршрута
 */
export function MetadataProvider({
  children,
}: MetadataProviderProps): React.ReactElement {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    // Получаем мета-данные для текущего маршрута с параметрами
    const cleanParams = params
      ? (Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== undefined)
        ) as Record<string, string>)
      : undefined;

    const metaTags = metadataUtils.getMetaTags(location.pathname, cleanParams);

    // Обновляем title
    if (metaTags.title) {
      document.title = metaTags.title;
    }

    // Обновляем description
    if (metaTags.description) {
      let descElement = document.querySelector(
        'meta[name="description"]'
      ) as HTMLMetaElement;
      if (!descElement) {
        descElement = document.createElement("meta");
        descElement.name = "description";
        document.head.appendChild(descElement);
      }
      descElement.content = metaTags.description;
    }
  }, [location.pathname, params]);

  return <>{children}</>;
}
