// Конфигурация настроек игры с компьютером

export interface GameEngineSettings {
  skill: number; // Уровень навыка Stockfish (0-20): 0 = самый слабый, 20 = самый сильный
  depth: number; // Глубина расчета (1-20): количество полуходов для анализа
  time: number; // Время на ход в миллисекундах
  MultiPV: number; // Количество лучших вариантов для анализа
  threads: number; // Количество потоков для расчета
  kidsMode: boolean; // Детский режим с упрощенной логикой и подсказками
}

export interface GameUISettings {
  showLastMoveArrow: boolean; // Показывать стрелку последнего хода
  showThreatHighlight: boolean; // Подсвечивать атакованные фигуры (в детском режиме)
  showMoveHints: boolean; // Показывать подсказки возможных ходов
  enableSoundEffects: boolean; // Включить звуковые эффекты
}

export interface DifficultyLevel {
  id: "easy" | "medium" | "hard";
  titleKey: string;
  description: string;
  ageGroup: string;
  features: string;
  engineSettings: GameEngineSettings;
  uiSettings: GameUISettings;
}

// Настройки для разных уровней сложности
export const DIFFICULTY_LEVELS: Record<string, DifficultyLevel> = {
  easy: {
    id: "easy",
    titleKey: "easy",
    description: "Детский режим для самых маленьких",
    ageGroup: "👶 5-6 лет",
    features: "🎯 Очень легко + подсказки + веселые сообщения",
    engineSettings: {
      skill: 0, // Минимальный уровень
      depth: 1, // Минимальная глубина
      time: 300, // 0.3 секунды на ход
      MultiPV: 3, // Анализ 3 вариантов
      threads: 1, // Один поток
      kidsMode: true, // Включен детский режим
    },
    uiSettings: {
      showLastMoveArrow: true, // Показываем стрелку (помогает детям)
      showThreatHighlight: true, // Подсвечиваем угрозы
      showMoveHints: true, // Показываем подсказки
      enableSoundEffects: true, // Звуки для веселья
    },
  },

  medium: {
    id: "medium",
    titleKey: "medium",
    description: "Режим для детей постарше без подсказок",
    ageGroup: "🧒 7-10 лет",
    features: "⭐ Немного посложнее, но все еще легко",
    engineSettings: {
      skill: 1, // Очень низкий уровень
      depth: 1, // Минимальная глубина
      time: 500, // 0.5 секунды на ход
      MultiPV: 2, // Анализ 2 вариантов
      threads: 1, // Один поток
      kidsMode: false, // Без детского режима (нет подсказок)
    },
    uiSettings: {
      showLastMoveArrow: true, // Показываем стрелку
      showThreatHighlight: false, // Не подсвечиваем угрозы
      showMoveHints: false, // Без подсказок
      enableSoundEffects: true, // Звуки оставляем
    },
  },

  hard: {
    id: "hard",
    titleKey: "hard",
    description: "Сложный режим для опытных игроков",
    ageGroup: "🔥 Опытные",
    features: "💪 Умеренная сложность для изучения",
    engineSettings: {
      skill: 5, // Средне-низкий уровень
      depth: 5, // Умеренная глубина
      time: 1000, // 1 секунда на ход
      MultiPV: 1, // Анализ лучшего варианта
      threads: 1, // Один поток
      kidsMode: false, // Без детского режима
    },
    uiSettings: {
      showLastMoveArrow: true, // Показываем стрелку
      showThreatHighlight: false, // Не подсвечиваем угрозы
      showMoveHints: false, // Без подсказок
      enableSoundEffects: false, // Без звуков (серьезная игра)
    },
  },
};

// Настройки по умолчанию для неизвестного уровня
export const DEFAULT_DIFFICULTY = DIFFICULTY_LEVELS.medium;

// Функция для получения настроек по уровню
export const getDifficultySettings = (
  level: string | undefined
): DifficultyLevel => {
  if (level && level in DIFFICULTY_LEVELS) {
    return DIFFICULTY_LEVELS[level];
  }
  return DEFAULT_DIFFICULTY;
};

// Описания параметров для UI настроек (если понадобится в будущем)
export const SETTING_DESCRIPTIONS = {
  skill: {
    name: "Уровень навыка",
    description: "Сила игры движка от 0 (слабейший) до 20 (сильнейший)",
    range: "0-20",
  },
  depth: {
    name: "Глубина расчета",
    description: "Количество полуходов для анализа позиции",
    range: "1-20",
  },
  time: {
    name: "Время на ход",
    description: "Максимальное время обдумывания хода в миллисекундах",
    range: "100-5000",
  },
  MultiPV: {
    name: "Количество вариантов",
    description: "Сколько лучших ходов анализирует движок одновременно",
    range: "1-5",
  },
  threads: {
    name: "Потоки",
    description: "Количество потоков процессора для расчета",
    range: "1-4",
  },
  kidsMode: {
    name: "Детский режим",
    description: "Включает упрощенную логику и подсказки для детей",
    range: "true/false",
  },
  showLastMoveArrow: {
    name: "Стрелка последнего хода",
    description: "Показывать стрелку последнего сделанного хода",
    range: "true/false",
  },
};
