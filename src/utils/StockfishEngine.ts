export class StockfishEngine {
  private worker: Worker | null = null;
  private currentResolve: ((value: string) => void) | null = null;
  private isReady: boolean = false;

  init() {
    this.worker = new Worker("/stockfish.js");

    this.worker.onmessage = (e) => {
      const message = e.data;
      console.log("Engine message:", message); // Подробное логирование

      if (typeof message === "string") {
        if (message.startsWith("bestmove")) {
          const move = message.split(" ")[1];
          console.log("Best move found:", move);
          if (this.currentResolve) {
            this.currentResolve(move);
            this.currentResolve = null;
          }
        } else if (message.includes("readyok")) {
          this.isReady = true;
          console.log("Engine is ready");
        } else if (message.includes("info")) {
          console.log("Engine info:", message);
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
    this.sendCommand("setoption name Skill Level value 10");
    this.sendCommand("setoption name MultiPV value 1");
    this.sendCommand("setoption name Threads value 1");
  }

  private sendCommand(command: string) {
    if (this.worker) {
      console.log("Sending command:", command);
      this.worker.postMessage(command);
    }
  }

  setOptions(options: { [key: string]: number }) {
    if (!this.worker) return;

    Object.entries(options).forEach(([key, value]) => {
      this.sendCommand(`setoption name ${key} value ${value}`);
    });
  }

  async getBestMove(fen: string): Promise<string> {
    if (!this.worker) throw new Error("Engine not initialized");
    if (!this.isReady) throw new Error("Engine not ready");

    return new Promise((resolve) => {
      this.currentResolve = resolve;

      // Устанавливаем таймаут для случая, если движок не ответит
      const timeout = setTimeout(() => {
        console.log("Engine timeout, using default move");
        if (this.currentResolve) {
          this.currentResolve("e2e4");
          this.currentResolve = null;
        }
      }, 3000);

      this.sendCommand(`position fen ${fen}`);
      this.sendCommand("go depth 10 movetime 1000");

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
