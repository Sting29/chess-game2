# План реструктуризации API

## Анализ текущих API сервисов

### Текущая структура API:

**Основные API сервисы в `src/services/`:**

1. **Core API Infrastructure:**

   - `httpClient.ts` - основной HTTP клиент с Axios
   - `tokenManager.ts` - управление JWT токенами
   - `tokenRefreshManager.ts` - автоматическое обновление токенов
   - `errorHandler.ts` - централизованная обработка ошибок
   - `authLogger.ts` - логирование аутентификации

2. **Business Logic Services:**

   - `authService.ts` - аутентификация (логин, логаут, обновление токенов)
   - `userService.ts` - профиль пользователя, настройки, сессии
   - `progressService.ts` - отслеживание прогресса обучения
   - `sessionExperienceManager.ts` - управление пользовательским опытом

3. **Supporting Files:**
   - `types.ts` - TypeScript типы для API
   - `index.ts` - экспорты сервисов
   - `__tests__/` - тесты для всех сервисов

### API Endpoints анализ:

**Authentication API:**

- `POST /user/login` - авторизация
- `POST /user/logout` - выход
- `POST /user/refresh` - обновление токена

**User Management API:**

- `GET /user/profile` - получить профиль
- `PATCH /user/profile` - обновить профиль
- `GET /user/sessions` - список сессий
- `DELETE /user/sessions/:id` - удалить сессию
- `DELETE /user/sessions` - удалить все сессии

**Progress Tracking API:**

- `GET /progress` - получить весь прогресс
- `GET /progress/section/:id` - прогресс секции
- `POST /progress/update` - обновить прогресс
- `POST /progress/section/:id/reset` - сбросить прогресс секции
- `POST /progress/reset` - сбросить весь прогресс

## Предложение по реорганизации

### ✅ **ДА, API можно и нужно вынести в отдельную папку!**

### 1. **Новая структура папок:**

```
src/
├── api/                          # ← НОВАЯ папка для всего API
│   ├── core/                     # Основная инфраструктура
│   │   ├── httpClient.ts
│   │   ├── tokenManager.ts
│   │   ├── tokenRefreshManager.ts
│   │   ├── errorHandler.ts
│   │   └── authLogger.ts
│   │
│   ├── services/                 # Бизнес-логика API
│   │   ├── auth/
│   │   │   ├── authService.ts
│   │   │   ├── types.ts          # Auth-specific types
│   │   │   └── index.ts
│   │   │
│   │   ├── user/
│   │   │   ├── userService.ts
│   │   │   ├── types.ts          # User-specific types
│   │   │   └── index.ts
│   │   │
│   │   ├── progress/
│   │   │   ├── progressService.ts
│   │   │   ├── types.ts          # Progress-specific types
│   │   │   └── index.ts
│   │   │
│   │   └── session/
│   │       ├── sessionExperienceManager.ts
│   │       ├── types.ts
│   │       └── index.ts
│   │
│   ├── types/                    # Общие API типы
│   │   ├── common.ts
│   │   ├── responses.ts
│   │   └── index.ts
│   │
│   ├── __tests__/               # Тесты API
│   │   ├── core/
│   │   ├── services/
│   │   └── integration/
│   │
│   └── index.ts                 # Главный экспорт API
│
└── services/                    # ← Остается для НЕ-API сервисов
    ├── gameLogic/               # Игровая логика
    ├── stockfish/               # Шахматный движок
    ├── storage/                 # Локальное хранение
    └── utils/                   # Утилиты
```

### 2. **Что я бы сделал шаг за шагом:**

#### **Этап 1: Подготовка новой структуры**

1. Создать папку `src/api/`
2. Создать подпапки: `core/`, `services/`, `types/`, `__tests__/`
3. Создать подпапки для каждого сервиса: `auth/`, `user/`, `progress/`, `session/`

#### **Этап 2: Перенос core инфраструктуры**

1. Перенести `httpClient.ts` → `src/api/core/`
2. Перенести `tokenManager.ts` → `src/api/core/`
3. Перенести `tokenRefreshManager.ts` → `src/api/core/`
4. Перенести `errorHandler.ts` → `src/api/core/`
5. Перенести `authLogger.ts` → `src/api/core/`

#### **Этап 3: Реорганизация сервисов по доменам**

1. **Auth Service:**

   - `authService.ts` → `src/api/services/auth/authService.ts`
   - Выделить auth типы → `src/api/services/auth/types.ts`
   - Создать `src/api/services/auth/index.ts`

2. **User Service:**

   - `userService.ts` → `src/api/services/user/userService.ts`
   - Выделить user типы → `src/api/services/user/types.ts`
   - Создать `src/api/services/user/index.ts`

3. **Progress Service:**
   - `progressService.ts` → `src/api/services/progress/progressService.ts`
   - Выделить progress типы → `src/api/services/progress/types.ts`
   - Создать `src/api/services/progress/index.ts`

#### **Этап 4: Рефакторинг типов**

1. Разделить `types.ts` на модульные файлы
2. Общие типы → `src/api/types/common.ts`
3. API ответы → `src/api/types/responses.ts`
4. Создать центральный `src/api/types/index.ts`

#### **Этап 5: Перенос тестов**

1. Перенести все тесты в `src/api/__tests__/`
2. Организовать по структуре: `core/`, `services/`
3. Обновить пути импортов в тестах

#### **Этап 6: Обновление импортов**

1. Обновить все импорты в компонентах
2. Обновить импорты в хуках
3. Обновить импорты в Redux store
4. Создать главный `src/api/index.ts` для удобного импорта

### 3. **Преимущества новой структуры:**

✅ **Четкое разделение ответственности**

- API логика отделена от бизнес-логики приложения
- Каждый сервис имеет свой домен

✅ **Лучшая масштабируемость**

- Легко добавлять новые API сервисы
- Модульная структура типов

✅ **Упрощенное тестирование**

- Тесты сгруппированы по функциональности
- Легче мокать отдельные части API

✅ **Улучшенная читаемость**

- Понятная иерархия папок
- Легче найти нужный API метод

✅ **Переиспользование кода**

- Core компоненты используются всеми сервисами
- Типы разделены по доменам

### 4. **Пример нового импорта:**

**Было:**

```typescript
import { authService, userService } from "../services";
```

**Станет:**

```typescript
import { authService, userService } from "../api";
// или более специфично:
import { authService } from "../api/services/auth";
import { userService } from "../api/services/user";
```

### 5. **Что нужно оставить в `src/services/`:**

После переноса API, в папке `services/` должны остаться только НЕ-API сервисы:

- Игровая логика шахмат
- Локальное хранилище
- Утилиты для UI
- Сервисы для работы со Stockfish
- Другие бизнес-сервисы, не связанные с API

**Вывод:** Реструктуризация API в отдельную папку `src/api/` значительно улучшит архитектуру проекта, сделает код более организованным и упростит дальнейшую разработку. Это стандартная практика для больших React приложений с активным использованием API.
