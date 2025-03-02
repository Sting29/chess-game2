import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Square } from "../types/playTypes";
import { StockfishEngine } from "../utils/StockfishEngine";

interface ComputerChessBoardProps {
  settings: {
    depth: number;
    skill: number;
  };
}

export function ComputerChessBoard({ settings }: ComputerChessBoardProps) {
  const [game, setGame] = useState(new Chess());
  const [engine] = useState(() => new StockfishEngine());
  const [isThinking, setIsThinking] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [moveMessage, setMoveMessage] = useState("Ваш ход (белые)");

  useEffect(() => {
    engine.init();
    return () => engine.quit();
  }, []);

  useEffect(() => {
    engine.setOptions({
      Skill: settings.skill,
      Depth: settings.depth,
    });
  }, [settings]);

  const makeComputerMove = async () => {
    setIsThinking(true);
    setMoveMessage("Компьютер думает...");

    try {
      console.log("Current position:", game.fen());
      const move = await engine.getBestMove(game.fen());
      console.log("Received move:", move);

      if (!move) {
        console.error("No move received");
        setIsThinking(false);
        setMoveMessage("Ваш ход (белые)");
        return;
      }

      // Получаем все возможные ходы
      const legalMoves = game.moves({ verbose: true });
      console.log("Legal moves:", legalMoves);

      // Пытаемся найти соответствующий легальный ход
      const from = move.substring(0, 2) as Square;
      const to = move.substring(2, 4) as Square;

      const matchingMove = legalMoves.find(
        (m) => m.from === from && m.to === to
      );

      if (matchingMove) {
        // Делаем ход, используя полную информацию о ходе
        const moveResult = game.move(matchingMove);
        console.log("Computer move made:", moveResult);
        setGame(new Chess(game.fen()));
      } else {
        // Если ход не найден, делаем случайный легальный ход
        if (legalMoves.length > 0) {
          const randomMove =
            legalMoves[Math.floor(Math.random() * legalMoves.length)];
          const moveResult = game.move(randomMove);
          console.log("Made random move:", moveResult);
          setGame(new Chess(game.fen()));
        } else {
          console.error("No legal moves available");
        }
      }
    } catch (error) {
      console.error("Error making computer move:", error);

      // В случае ошибки пытаемся сделать случайный ход
      const legalMoves = game.moves({ verbose: true });
      if (legalMoves.length > 0) {
        const randomMove =
          legalMoves[Math.floor(Math.random() * legalMoves.length)];
        game.move(randomMove);
        console.log("Made random move after error:", randomMove);
        setGame(new Chess(game.fen()));
      }
    }

    setIsThinking(false);
    setMoveMessage(
      game.isGameOver() ? getGameOverMessage() : "Ваш ход (белые)"
    );
  };

  function onDrop(sourceSquare: Square, targetSquare: Square): boolean {
    if (isThinking) return false;

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // всегда превращаем в ферзя для простоты
      });

      if (move === null) return false;

      setGame(new Chess(game.fen()));

      if (!game.isGameOver()) {
        makeComputerMove();
      } else {
        setMoveMessage(getGameOverMessage());
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  function onSquareClick(square: Square) {
    if (isThinking) return;

    const moves = game.moves({
      square,
      verbose: true,
    });

    if (moves.length > 0) {
      setSelectedSquare(square);
    } else {
      setSelectedSquare(null);
    }
  }

  function getGameOverMessage(): string {
    if (game.isCheckmate()) {
      return game.turn() === "w"
        ? "Мат! Чёрные победили!"
        : "Мат! Белые победили!";
    } else if (game.isDraw()) {
      return "Ничья!";
    } else if (game.isStalemate()) {
      return "Пат!";
    }
    return "Игра окончена!";
  }

  return (
    <div style={{ width: "400px", margin: "0 auto" }}>
      <div
        className="move-message"
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        {moveMessage}
      </div>

      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        onSquareClick={onSquareClick}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
        }}
        customSquareStyles={{
          ...(selectedSquare && {
            [selectedSquare]: { background: "rgba(255, 255, 0, 0.4)" },
          }),
        }}
      />
    </div>
  );
}
