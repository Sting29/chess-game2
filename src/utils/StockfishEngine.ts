export class StockfishEngine {
  private worker: Worker | null = null;
  private currentResolve: ((value: string) => void) | null = null;
  private isReady: boolean = false;
  private settings: {
    skill: number;
    depth: number;
    time: number;
    MultiPV: number;
    threads: number;
    kidsMode?: boolean; // Специальный детский режим
  } = {
    skill: 0,
    depth: 1,
    time: 300,
    MultiPV: 3,
    threads: 1,
    kidsMode: false,
  };
  private multiPVMoves: { move: string; score: number }[] = [];

  init() {
    this.worker = new Worker("/stockfish.js");

    this.worker.onmessage = (e) => {
      const message = e.data;

      if (typeof message === "string") {
        if (message.startsWith("bestmove")) {
          const move = message.split(" ")[1];
          if (this.currentResolve) {
            this.currentResolve(move);
            this.currentResolve = null;
          }
        } else if (message.includes("readyok")) {
          this.isReady = true;
        } else if (message.includes("info") && message.includes("multipv")) {
          this.parseMultiPVInfo(message);
        }
      }
    };

    this.worker.onerror = (e) => {
      console.error("Engine error:", e);
      if (this.currentResolve) {
        this.currentResolve("e2e4"); // Возвращаем дефолтный ход в случае ошибки
        this.currentResolve = null;
      }
    };

    // Последовательная инициализация
    this.sendCommand("uci");
    this.sendCommand("isready");
    this.sendCommand("ucinewgame");
    this.sendCommand(`setoption name MultiPV value ${this.settings.MultiPV}`);
    this.sendCommand(`setoption name Threads value ${this.settings.threads}`);
  }

  private parseMultiPVInfo(message: string) {
    // Парсим информацию о множественных вариантах
    const multiPVMatch = message.match(/multipv (\d+)/);
    const scoreMatch = message.match(/score cp (-?\d+)/);
    const pvMatch = message.match(/pv (.+)/);

    if (multiPVMatch && scoreMatch && pvMatch) {
      const multiPV = parseInt(multiPVMatch[1]);
      const score = parseInt(scoreMatch[1]);
      const moves = pvMatch[1].split(" ");
      const firstMove = moves[0];

      if (multiPV <= this.settings.MultiPV) {
        this.multiPVMoves[multiPV - 1] = { move: firstMove, score };
      }
    }
  }

  private sendCommand(command: string) {
    if (this.worker) {
      console.log("Sending command:", command);
      this.worker.postMessage(command);
    }
  }

  setOptions(options: { [key: string]: number | boolean }) {
    if (!this.worker) return;

    Object.entries(options).forEach(([key, value]) => {
      // Сохраняем настройки для использования в getBestMove
      if (key === "Skill") {
        this.settings.skill = value as number;
        // Stockfish использует "Skill Level" вместо "Skill"
        this.sendCommand(`setoption name Skill Level value ${value}`);
      } else if (key === "Depth") {
        this.settings.depth = value as number;
        // Depth будет использоваться в команде go
      } else if (key === "Time") {
        this.settings.time = value as number;
      } else if (key === "KidsMode") {
        this.settings.kidsMode = value as boolean;
      } else {
        this.sendCommand(`setoption name ${key} value ${value}`);
      }
    });
  }

  // Специальная логика для детского режима
  private makeKidsMove(legalMoves: any[]): string {
    // В детском режиме делаем случайные простые ходы
    const randomFactor = Math.random();

    // 70% времени - совершенно случайный ход
    if (randomFactor < 0.7) {
      const randomMove =
        legalMoves[Math.floor(Math.random() * legalMoves.length)];
      return randomMove.from + randomMove.to + (randomMove.promotion || "");
    }

    // 20% времени - немного лучший ход (но все еще простой)
    if (randomFactor < 0.9) {
      // Предпочитаем ходы центральными пешками или развитие фигур
      const developmentMoves = legalMoves.filter(
        (move) => move.piece === "p" || move.piece === "n" || move.piece === "b"
      );

      if (developmentMoves.length > 0) {
        const randomDevMove =
          developmentMoves[Math.floor(Math.random() * developmentMoves.length)];
        return (
          randomDevMove.from +
          randomDevMove.to +
          (randomDevMove.promotion || "")
        );
      }
    }

    // 10% времени - случайный ход из всех возможных
    const randomMove =
      legalMoves[Math.floor(Math.random() * legalMoves.length)];
    return randomMove.from + randomMove.to + (randomMove.promotion || "");
  }

  // Логика для среднего уровня (7-10 лет) - чуть лучше детского
  private makeMediumKidsMove(legalMoves: any[]): string {
    const randomFactor = Math.random();

    // 40% времени - случайный ход (меньше чем в easy)
    if (randomFactor < 0.4) {
      const randomMove =
        legalMoves[Math.floor(Math.random() * legalMoves.length)];
      return randomMove.from + randomMove.to + (randomMove.promotion || "");
    }

    // 40% времени - предпочитаем развитие фигур
    if (randomFactor < 0.8) {
      const developmentMoves = legalMoves.filter(
        (move) =>
          move.piece === "p" ||
          move.piece === "n" ||
          move.piece === "b" ||
          move.piece === "r"
      );

      if (developmentMoves.length > 0) {
        const randomDevMove =
          developmentMoves[Math.floor(Math.random() * developmentMoves.length)];
        return (
          randomDevMove.from +
          randomDevMove.to +
          (randomDevMove.promotion || "")
        );
      }
    }

    // 20% времени - пытаемся найти взятие (простая тактика)
    const captureMoves = legalMoves.filter((move) => move.captured);
    if (captureMoves.length > 0) {
      const randomCapture =
        captureMoves[Math.floor(Math.random() * captureMoves.length)];
      return (
        randomCapture.from + randomCapture.to + (randomCapture.promotion || "")
      );
    }

    // Если нет взятий - случайный ход
    const randomMove =
      legalMoves[Math.floor(Math.random() * legalMoves.length)];
    return randomMove.from + randomMove.to + (randomMove.promotion || "");
  }

  async getBestMove(fen: string, legalMoves?: any[]): Promise<string> {
    if (!this.worker) throw new Error("Engine not initialized");
    if (!this.isReady) throw new Error("Engine not ready");

    // Если включен детский режим и переданы легальные ходы
    if (this.settings.kidsMode && legalMoves && legalMoves.length > 0) {
      // Добавляем небольшую задержку для имитации "размышления"
      await new Promise((resolve) =>
        setTimeout(resolve, 200 + Math.random() * 400)
      );
      return this.makeKidsMove(legalMoves);
    }

    // Если это средний уровень сложности (skill 1-5) и переданы легальные ходы
    if (this.settings.skill <= 5 && legalMoves && legalMoves.length > 0) {
      // Задержка чуть больше для имитации размышления
      await new Promise((resolve) =>
        setTimeout(resolve, 400 + Math.random() * 600)
      );
      return this.makeMediumKidsMove(legalMoves);
    }

    return new Promise((resolve) => {
      this.currentResolve = resolve;
      this.multiPVMoves = [];

      // Устанавливаем таймаут для случая, если движок не ответит
      const timeout = setTimeout(() => {
        console.log("Engine timeout, using default move");
        if (this.currentResolve) {
          this.currentResolve("e2e4");
          this.currentResolve = null;
        }
      }, 3000);

      this.sendCommand(`position fen ${fen}`);
      // Используем настройки depth и time из переданных параметров
      this.sendCommand(
        `go depth ${this.settings.depth} movetime ${this.settings.time}`
      );

      // Очищаем таймаут при успешном получении хода
      const originalResolve = this.currentResolve;
      this.currentResolve = (move: string) => {
        clearTimeout(timeout);
        if (originalResolve) {
          originalResolve(move);
        }
      };
    });
  }

  quit() {
    if (this.worker) {
      this.sendCommand("quit");
      this.worker.terminate();
      this.worker = null;
      this.isReady = false;
    }
  }
}
