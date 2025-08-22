# 🐛 TODO: Реализация API системы отчетности об ошибках

## 📋 **Задача**

Заменить текущую систему отправки ошибок через `mailto` на автоматическую API отправку с fallback на email.

## 🎯 **Цель**

- ✅ Автоматическая отправка отчетов об ошибках
- ✅ Богатый контекст ошибки
- ✅ Fallback на email если API недоступен
- ✅ Простая реализация без избыточной сложности

---

## 🔧 **Frontend изменения**

### **1. Обновить GlobalErrorBoundary.tsx**

Заменить текущий `handleReportBug` метод:

```tsx
private handleReportBug = async () => {
  try {
    // Собираем данные об ошибке
    const errorReport = {
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      error: {
        name: this.state.error?.name,
        message: this.state.error?.message,
        stack: this.state.error?.stack,
      },
      // Дополнительный контекст
      userId: this.getCurrentUserId(), // если авторизован
      sessionId: this.getSessionId(),
      appVersion: process.env.REACT_APP_VERSION,
      buildId: process.env.REACT_APP_BUILD_ID,
      // Redux состояние (без чувствительных данных)
      appState: this.sanitizeAppState(),
    };

    // Показываем индикатор отправки
    this.setState({ isSendingReport: true });

    const response = await fetch('/api/error-reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify(errorReport),
    });

    if (response.ok) {
      // Успешная отправка
      this.showSuccessNotification('Error report sent successfully!');
    } else {
      // API недоступен - fallback на email
      this.fallbackToEmail(errorReport);
    }
  } catch (apiError) {
    console.error('Failed to send error report via API:', apiError);
    // Fallback на email
    this.fallbackToEmail();
  } finally {
    this.setState({ isSendingReport: false });
  }
};

private fallbackToEmail = (errorReport?: any) => {
  const subject = encodeURIComponent(
    `Chess App Error Report - ${this.state.errorId}`
  );

  const body = errorReport
    ? encodeURIComponent(
        `Error Report (API failed, manual submission):\n\n` +
        JSON.stringify(errorReport, null, 2)
      )
    : encodeURIComponent(
        `Error ID: ${this.state.errorId}\n` +
        `Timestamp: ${new Date().toISOString()}\n` +
        `URL: ${window.location.href}\n` +
        `User Agent: ${navigator.userAgent}\n\n` +
        `Error: ${this.state.error?.name}\n` +
        `Message: ${this.state.error?.message}\n\n` +
        `Please describe what you were doing when this error occurred:\n\n`
      );

  window.open(`mailto:support@chess-app.com?subject=${subject}&body=${body}`);
};

// Вспомогательные методы
private getCurrentUserId = (): string | null => {
  // Получить ID текущего пользователя из Redux/localStorage
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || null;
  } catch {
    return null;
  }
};

private getSessionId = (): string => {
  // Получить или создать session ID
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = Date.now().toString(36) + Math.random().toString(36);
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

private getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

private sanitizeAppState = (): any => {
  // Получить состояние Redux без чувствительных данных
  try {
    const state = store.getState();
    return {
      // Только безопасные данные
      currentPage: state.router?.location?.pathname,
      isAuthenticated: state.auth?.isAuthenticated,
      userRole: state.auth?.user?.role,
      // НЕ включаем: пароли, токены, личные данные
    };
  } catch {
    return null;
  }
};

private showSuccessNotification = (message: string) => {
  // Простое уведомление (можно использовать toast библиотеку)
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 1rem;
    border-radius: 4px;
    z-index: 10000;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
};
```

### **2. Обновить состояние компонента**

Добавить в `State` интерфейс:

```tsx
interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
  isSendingReport?: boolean; // Новое поле
}
```

### **3. Обновить UI кнопки "Report Bug"**

```tsx
<button
  onClick={this.handleReportBug}
  disabled={this.state.isSendingReport}
  style={{
    padding: "0.875rem 2rem",
    backgroundColor: this.state.isSendingReport ? "#6c757d" : "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: this.state.isSendingReport ? "not-allowed" : "pointer",
    fontSize: "1rem",
  }}
>
  {this.state.isSendingReport ? "Sending..." : "Report Bug"}
</button>
```

---

## 🖥️ **Backend изменения**

### **1. API Endpoint**

Создать `/api/error-reports` endpoint:

```javascript
// routes/errorReports.js
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// POST /api/error-reports
router.post(
  "/",
  [
    // Валидация
    body("errorId").notEmpty().withMessage("Error ID is required"),
    body("timestamp").isISO8601().withMessage("Valid timestamp required"),
    body("error.name").notEmpty().withMessage("Error name is required"),
    body("error.message").notEmpty().withMessage("Error message is required"),
  ],
  async (req, res) => {
    try {
      // Проверка валидации
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const errorReport = req.body;

      // Сохраняем в базу данных
      const savedReport = await saveErrorReport(errorReport);

      // Отправляем email уведомление (опционально)
      if (isProductionEnvironment() && isCriticalError(errorReport)) {
        await sendEmailNotification(errorReport);
      }

      res.status(201).json({
        success: true,
        reportId: savedReport.id,
      });
    } catch (error) {
      console.error("Error saving error report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to save error report",
      });
    }
  }
);

module.exports = router;
```

### **2. Database Schema**

```sql
CREATE TABLE error_reports (
  id SERIAL PRIMARY KEY,
  error_id VARCHAR(50) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id),
  session_id VARCHAR(100),

  -- Error details
  error_name VARCHAR(255),
  error_message TEXT,
  error_stack TEXT,

  -- Context
  url VARCHAR(1000),
  user_agent TEXT,
  app_version VARCHAR(50),
  build_id VARCHAR(50),
  app_state JSONB,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP NULL,
  status VARCHAR(20) DEFAULT 'open', -- open, investigating, resolved
  notes TEXT
);

-- Индексы для быстрого поиска
CREATE INDEX idx_error_reports_user_id ON error_reports(user_id);
CREATE INDEX idx_error_reports_created_at ON error_reports(created_at);
CREATE INDEX idx_error_reports_error_name ON error_reports(error_name);
CREATE INDEX idx_error_reports_status ON error_reports(status);
```

### **3. Вспомогательные функции**

```javascript
// utils/errorReporting.js

const saveErrorReport = async (errorData) => {
  const query = `
    INSERT INTO error_reports (
      error_id, user_id, session_id, error_name, error_message, 
      error_stack, url, user_agent, app_version, build_id, app_state
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id
  `;

  const values = [
    errorData.errorId,
    errorData.userId,
    errorData.sessionId,
    errorData.error.name,
    errorData.error.message,
    errorData.error.stack,
    errorData.url,
    errorData.userAgent,
    errorData.appVersion,
    errorData.buildId,
    JSON.stringify(errorData.appState),
  ];

  const result = await db.query(query, values);
  return { id: result.rows[0].id };
};

const isCriticalError = (errorData) => {
  const criticalErrors = [
    "ChunkLoadError",
    "TypeError: Cannot read property",
    "ReferenceError",
    "Network Error",
  ];

  return criticalErrors.some((critical) =>
    errorData.error.message.includes(critical)
  );
};

const sendEmailNotification = async (errorData) => {
  const subject = `🚨 Critical Error in Chess App - ${errorData.errorId}`;
  const body = `
    Critical error occurred in Chess App:
    
    Error: ${errorData.error.name}
    Message: ${errorData.error.message}
    User: ${errorData.userId || "Anonymous"}
    URL: ${errorData.url}
    Time: ${errorData.timestamp}
    
    Please investigate immediately.
  `;

  // Используем вашу систему отправки email
  await sendEmail("dev-team@chess-app.com", subject, body);
};
```

---

## 📊 **Админ интерфейс (опционально)**

### **Простая страница для просмотра ошибок:**

```javascript
// routes/admin/errorReports.js
router.get("/admin/error-reports", requireAdmin, async (req, res) => {
  const { page = 1, status = "all", search = "" } = req.query;

  let whereClause = "WHERE 1=1";
  const params = [];

  if (status !== "all") {
    whereClause += " AND status = $" + (params.length + 1);
    params.push(status);
  }

  if (search) {
    whereClause +=
      " AND (error_message ILIKE $" +
      (params.length + 1) +
      " OR error_name ILIKE $" +
      (params.length + 2) +
      ")";
    params.push(`%${search}%`, `%${search}%`);
  }

  const query = `
    SELECT id, error_id, error_name, error_message, url, 
           user_id, created_at, status
    FROM error_reports 
    ${whereClause}
    ORDER BY created_at DESC 
    LIMIT 50 OFFSET $${params.length + 1}
  `;

  params.push((page - 1) * 50);

  const errors = await db.query(query, params);

  res.render("admin/error-reports", {
    errors: errors.rows,
    currentPage: page,
    status,
    search,
  });
});
```

---

## ✅ **Чек-лист реализации**

### **Frontend:**

- [ ] Обновить `GlobalErrorBoundary.tsx`
- [ ] Добавить состояние `isSendingReport`
- [ ] Реализовать `handleReportBug` с API вызовом
- [ ] Добавить fallback на email
- [ ] Добавить вспомогательные методы
- [ ] Обновить UI кнопки с loading состоянием

### **Backend:**

- [ ] Создать API endpoint `/api/error-reports`
- [ ] Создать таблицу `error_reports`
- [ ] Реализовать валидацию данных
- [ ] Добавить email уведомления для критических ошибок
- [ ] Создать простой админ интерфейс (опционально)

### **Testing:**

- [ ] Протестировать успешную отправку
- [ ] Протестировать fallback на email
- [ ] Протестировать валидацию данных
- [ ] Протестировать обработку ошибок API

---

## 🚀 **Приоритет реализации**

1. **High Priority** - Frontend изменения (улучшит UX немедленно)
2. **Medium Priority** - Backend API (для автоматизации)
3. **Low Priority** - Админ интерфейс (для удобства разработчиков)

---

## 💡 **Дополнительные улучшения (будущее)**

- [ ] Группировка похожих ошибок
- [ ] Автоматическое закрытие исправленных ошибок
- [ ] Интеграция с системой задач (Jira, GitHub Issues)
- [ ] Анализ трендов ошибок
- [ ] User feedback форма с дополнительным контекстом

**Статус:** Готово к реализации
**Время на реализацию:** 4-6 часов разработки
**Сложность:** Средняя
