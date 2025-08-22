/**
 * Хук для управления мета-данными страницы
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { metadataUtils } from "src/routes/metadata";

interface UsePageMetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  params?: Record<string, string>;
  customMeta?: Record<string, string>;
}

/**
 * Хук для автоматического обновления мета-данных страницы
 */
export function usePageMetadata(options: UsePageMetadataOptions = {}) {
  const location = useLocation();

  useEffect(() => {
    // Получаем мета-данные для текущего маршрута
    const routeMetaTags = metadataUtils.getMetaTags(
      location.pathname,
      options.params
    );

    // Объединяем с кастомными мета-данными
    const metaTags = {
      ...routeMetaTags,
      ...(options.title && {
        title: metadataUtils.createFullTitle(options.title),
      }),
      ...(options.description && { description: options.description }),
      ...(options.keywords && { keywords: options.keywords.join(", ") }),
      ...options.customMeta,
    };

    // Обновляем title
    if (metaTags.title) {
      document.title = metaTags.title;
    }

    // Обновляем или создаем мета-теги
    Object.entries(metaTags).forEach(([name, content]) => {
      if (name === "title") return; // Title уже обновлен

      // Определяем тип мета-тега
      let selector: string;
      let attribute: string;

      if (name.startsWith("og:") || name.startsWith("twitter:")) {
        selector = `meta[property="${name}"]`;
        attribute = "property";
      } else if (name === "canonical") {
        selector = `link[rel="canonical"]`;
        attribute = "rel";
      } else {
        selector = `meta[name="${name}"]`;
        attribute = "name";
      }

      // Найдем существующий тег или создадим новый
      let element = document.querySelector(selector) as
        | HTMLMetaElement
        | HTMLLinkElement;

      if (!element) {
        if (name === "canonical") {
          element = document.createElement("link");
          (element as HTMLLinkElement).rel = "canonical";
        } else {
          element = document.createElement("meta");
          (element as HTMLMetaElement).setAttribute(attribute, name);
        }
        document.head.appendChild(element);
      }

      // Обновляем содержимое
      if (name === "canonical") {
        (element as HTMLLinkElement).href = content;
      } else {
        (element as HTMLMetaElement).content = content;
      }
    });

    // Cleanup function для сброса title при размонтировании
    return () => {
      // Не сбрасываем title, так как пользователь может переходить между страницами
    };
  }, [
    location.pathname,
    options.title,
    options.description,
    options.keywords,
    options.params,
    options.customMeta,
  ]);

  return {
    updateMetadata: (newOptions: UsePageMetadataOptions) => {
      // Эта функция позволяет динамически обновлять мета-данные
      // Реализация будет зависеть от того, как вы хотите управлять состоянием
    },
  };
}

/**
 * Хук для динамического обновления title
 */
export function usePageTitle(title: string, params?: Record<string, string>) {
  const location = useLocation();

  useEffect(() => {
    const dynamicTitle = params
      ? metadataUtils.createDynamicTitle(title, params)
      : title;

    document.title = metadataUtils.createFullTitle(dynamicTitle);
  }, [title, params, location.pathname]);
}

/**
 * Хук для обновления конкретных мета-тегов
 */
export function useMetaTags(tags: Record<string, string>) {
  useEffect(() => {
    const elements: (HTMLMetaElement | HTMLLinkElement)[] = [];

    Object.entries(tags).forEach(([name, content]) => {
      let selector: string;
      let attribute: string;

      if (name.startsWith("og:") || name.startsWith("twitter:")) {
        selector = `meta[property="${name}"]`;
        attribute = "property";
      } else if (name === "canonical") {
        selector = `link[rel="canonical"]`;
        attribute = "rel";
      } else {
        selector = `meta[name="${name}"]`;
        attribute = "name";
      }

      let element = document.querySelector(selector) as
        | HTMLMetaElement
        | HTMLLinkElement;

      if (!element) {
        if (name === "canonical") {
          element = document.createElement("link");
          (element as HTMLLinkElement).rel = "canonical";
        } else {
          element = document.createElement("meta");
          (element as HTMLMetaElement).setAttribute(attribute, name);
        }
        document.head.appendChild(element);
        elements.push(element);
      }

      if (name === "canonical") {
        (element as HTMLLinkElement).href = content;
      } else {
        (element as HTMLMetaElement).content = content;
      }
    });

    // Cleanup - удаляем созданные элементы при размонтировании
    return () => {
      elements.forEach((element) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, [tags]);
}
