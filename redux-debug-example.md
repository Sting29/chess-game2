# Redux Debug - Примеры использования

## 1. Кнопка Redux в правом верхнем углу

После добавления компонента в App.tsx, в правом верхнем углу приложения появится зеленая кнопка "Redux". При клике на неё в консоль браузера будет выведено все состояние Redux Store.

## 2. Использование в любом компоненте

```typescript
import { logReduxState, logReduxSlice } from "../utils/reduxDebug";

function MyComponent() {
  const handleDebugClick = () => {
    // Вывести все состояние Redux
    logReduxState();
  };

  const handleDebugSettings = () => {
    // Вывести только настройки
    logReduxSlice("settings");
  };

  return (
    <div>
      <button onClick={handleDebugClick}>Debug All Redux</button>
      <button onClick={handleDebugSettings}>Debug Settings</button>
    </div>
  );
}
```

## 3. Использование из консоли браузера

После загрузки приложения в консоли браузера доступны следующие функции:

```javascript
// Вывести все состояние Redux
logReduxState();

// Вывести только определенный слайс
logReduxSlice("settings");
logReduxSlice("progress");
logReduxSlice("mazeProgress");

// Прямой доступ к store
reduxStore.getState();
```

## 4. Что выводится в консоль

- **Полное состояние Redux Store** - весь объект состояния
- **Settings State** - данные пользователя, язык, шахматный набор, аутентификация
- **Progress State** - прогресс в задачах и головоломках
- **Maze Progress State** - прогресс в лабиринтных головоломках
- **Statistics** - краткая статистика по данным
- **JSON для копирования** - состояние в формате JSON для копирования

## 5. Структура вывода

```
🔍 Redux State Debug
├── 📊 Полное состояние Redux Store
├── ⚙️ Settings State
│   ├── User
│   ├── Language
│   ├── Chess Set
│   ├── Is Authenticated
│   ├── Loading
│   ├── Error
│   └── Initial Check Complete
├── 📈 Progress State
│   ├── All Progress Items
│   ├── Current Progress
│   ├── Loading
│   ├── Error
│   └── Last Fetch
├── 🧩 Maze Progress State
│   ├── Completed Puzzles
│   ├── Current Puzzle ID
│   ├── Total Puzzles
│   └── Completion Percentage
├── 📊 Statistics
│   ├── Total Progress Items
│   ├── Completed Maze Puzzles
│   ├── User Name
│   └── Authentication Status
└── 📋 JSON для копирования
```

## 6. Удаление компонента

Если нужно убрать кнопку из интерфейса, просто удалите блок с ReduxDebugButton из App.tsx:

```typescript
// Удалить этот блок:
<div style={{...}}>
  <ReduxDebugButton ... />
</div>
```

Функции в консоли браузера останутся доступными.
