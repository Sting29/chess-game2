# Шахматные задачи (Puzzles) - Архитектурное описание

## Общее описание

Модуль шахматных задач представляет собой систему для решения шахматных задач разной сложности. Каждая задача имеет строго определенную последовательность ходов, которые должен выполнить игрок для достижения победы.

## Структура данных

### Типы данных

```typescript
// Базовые типы
interface Position {
  x: number; // 0-7 для a-h
  y: number; // 0-7 для 1-8
}

type Piece = string; // например: 'wK' - белый король, 'bP' - черная пешка

// Описание шахматной задачи
interface ChessPuzzle {
  id: string; // Уникальный идентификатор задачи
  title: string; // Название задачи
  description: string; // Описание задачи
  initialPosition: { [key: string]: Piece }; // Начальная позиция фигур
  correctMoves: Array<{
    from: string; // Начальная позиция (например: 'e2')
    to: string; // Конечная позиция (например: 'e4')
    piece: string; // Фигура, которая делает ход (например: 'wP')
    isComputerMove?: boolean; // true для ходов компьютера
  }>;
  hint: string; // Подсказка для решения
  playerColor: "w" | "b"; // Цвет фигур игрока
}

// Категория задач
interface PuzzleCategory {
  id: string; // Идентификатор категории
  title: string; // Название категории
  description: string; // Описание категории
  puzzles: ChessPuzzle[]; // Массив задач в категории
}
```

## Основные компоненты

### 1. PuzzleEngine (Движок задач)

Отвечает за валидацию ходов и управление состоянием задачи.

```typescript
class PuzzleEngine {
  private puzzle: ChessPuzzle;
  private currentMoveIndex: number;
  private currentPosition: { [key: string]: Piece };

  constructor(puzzle: ChessPuzzle) {
    this.puzzle = puzzle;
    this.currentMoveIndex = 0;
    this.currentPosition = { ...puzzle.initialPosition };
  }

  // Проверяет ход игрока
  validatePlayerMove(from: string, to: string, piece: string): boolean {
    // Проверяем соответствие хода с текущим ожидаемым ходом
    const expectedMove = this.puzzle.correctMoves[this.currentMoveIndex];
    return (
      from === expectedMove.from &&
      to === expectedMove.to &&
      piece === expectedMove.piece
    );
  }

  // Применяет ход
  makeMove(from: string, to: string, piece: string): void {
    const newPosition = { ...this.currentPosition };
    delete newPosition[from];
    newPosition[to] = piece;
    this.currentPosition = newPosition;
    this.currentMoveIndex++;
  }

  // Возвращает следующий ход компьютера
  getNextComputerMove(): { from: string; to: string; piece: string } | null {
    const nextMove = this.puzzle.correctMoves[this.currentMoveIndex];
    return nextMove?.isComputerMove ? nextMove : null;
  }

  // Проверяет завершение задачи
  isPuzzleComplete(): boolean {
    return this.currentMoveIndex === this.puzzle.correctMoves.length;
  }

  // Сброс состояния
  reset(): void {
    this.currentMoveIndex = 0;
    this.currentPosition = { ...this.puzzle.initialPosition };
  }

  getCurrentPosition(): { [key: string]: string } {
    return this.currentPosition;
  }
}
```

### 2. Компоненты интерфейса

#### PuzzleList (Список задач)

```typescript
interface PuzzleListProps {
  category: PuzzleCategory;
  onPuzzleSelect: (puzzleId: string) => void;
}

function PuzzleList({ category, onPuzzleSelect }: PuzzleListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {category.puzzles.map((puzzle) => (
            <div
              key={puzzle.id}
              onClick={() => onPuzzleSelect(puzzle.id)}
              className="p-4 cursor-pointer hover:bg-accent/5 rounded-lg"
            >
              {puzzle.title}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

#### PuzzleSolver (Решение задачи)

```typescript
interface PuzzleSolverProps {
  puzzle: ChessPuzzle;
  onComplete: () => void;
  onReset: () => void;
}

function PuzzleSolver({ puzzle, onComplete, onReset }: PuzzleSolverProps) {
  const [message, setMessage] = useState<string | null>("Ваш ход");
  const [currentPosition, setCurrentPosition] = useState(
    puzzle.initialPosition
  );
  const [previousPosition, setPreviousPosition] = useState(
    puzzle.initialPosition
  );
  const [engine] = useState(() => new PuzzleEngine(puzzle));

  const handleMove = (from: string, to: string, piece: string) => {
    setPreviousPosition(currentPosition);

    const isValid = engine.validatePlayerMove(from, to, piece);
    if (!isValid) {
      setCurrentPosition(previousPosition);
      setMessage("Неправильный ход! Попробуйте еще раз.");
      return false;
    }

    engine.makeMove(from, to, piece);
    setCurrentPosition(engine.getCurrentPosition());

    if (engine.isPuzzleComplete()) {
      setMessage("Победа игрока!");
      onComplete();
    } else if (engine.getNextComputerMove()) {
      //makeComputerMove();  //Implementation needed for this function.
    }

    return true;
  };

  return (
    <div>
      <ChessboardWrapper
        position={currentPosition}
        onMove={handleMove}
        onReset={onReset}
      />
      <div className="mt-4 text-center">{message}</div>
    </div>
  );
}
```

## Процесс решения задачи

1. Инициализация:

   - Загрузка задачи и создание PuzzleEngine
   - Отображение начальной позиции
   - Установка статуса "Ваш ход"

2. Ход игрока:

   - Сохранение текущей позиции
   - Проверка валидности хода через PuzzleEngine
   - При неверном ходе:
     - Возврат фигуры на исходную позицию
     - Отображение сообщения об ошибке
   - При правильном ходе:
     - Обновление позиции
     - Проверка завершения или хода компьютера

3. Ход компьютера:

   - Получение следующего хода из engine
   - Анимация хода (задержка 500мс)
   - Обновление позиции
   - Передача хода игроку

4. Завершение:
   - Проверка достижения мата
   - Отображение сообщения о победе
   - Возможность перехода к следующей задаче

## Рекомендации по реализации

1. Состояние:

   - Храните предыдущую позицию для отката неверных ходов
   - Используйте isMoving для блокировки действий во время анимации
   - Обновляйте сообщения о состоянии игры

2. Валидация:

   - Проверяйте ходы строго по списку correctMoves
   - Учитывайте очередность ходов (игрок/компьютер)
   - Возвращайте фигуры на место при неверных ходах

3. Интерфейс:

   - Отображайте статус в сером поле под доской
   - Показывайте подсказки по запросу
   - Добавьте кнопку сброса позиции

4. Данные:
   - Храните задачи в отдельном файле
   - Группируйте задачи по сложности
   - Используйте четкие идентификаторы

## Пример использования

```typescript
// Пример задачи
const puzzle: ChessPuzzle = {
  id: "1",
  title: "Мат в 1 ход",
  description: "Белые начинают и ставят мат",
  initialPosition: {
    a1: "wR",
    h8: "bK",
    // другие фигуры...
  },
  correctMoves: [{ from: "a1", to: "a8", piece: "wR" }],
  hint: "Используйте ладью для мата по последней горизонтали",
  playerColor: "w",
};

// Использование в компоненте
function PuzzlePage() {
  return (
    <div>
      <PuzzleSolver
        puzzle={puzzle}
        onComplete={() => console.log("Задача решена!")}
        onReset={() => console.log("Сброс позиции")}
      />
    </div>
  );
}
```
