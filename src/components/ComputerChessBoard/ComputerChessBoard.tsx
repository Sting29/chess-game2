import { useEffect, useState, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Square } from "src/types/playTypes";
import { StockfishEngine } from "src/utils/StockfishEngine";
import { useCustomPieces } from "src/components/CustomPieces/CustomPieces";
import { boardStyles } from "src/data/boardSettings";
import { BoardContainer, GameStatus } from "src/styles/BoardStyles";
interface ComputerChessBoardProps {
  settings: {
    depth: number;
    skill: number;
  };
  onGameEnd?: (result: string) => void;
}

export function ComputerChessBoard({
  settings,
  onGameEnd,
}: ComputerChessBoardProps) {
  const [game, setGame] = useState(new Chess());
  const engineRef = useRef<StockfishEngine>(new StockfishEngine());
  const [isThinking, setIsThinking] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [highlightSquares, setHighlightSquares] = useState<Square[]>([]);
  const [moveMessage, setMoveMessage] = useState("Your turn (white)");
  const [lastMoveArrow, setLastMoveArrow] = useState<{
    startSquare: string;
    endSquare: string;
    color: string;
  } | null>(null);

  useEffect(() => {
    const engine = engineRef.current;
    engine.init();

    return () => engine.quit();
  }, []);

  useEffect(() => {
    engineRef.current.setOptions({
      Skill: settings.skill,
      Depth: settings.depth,
    });
  }, [settings]);

  const makeComputerMove = async () => {
    setIsThinking(true);
    setMoveMessage("Computer is thinking...");

    try {
      const move = await engineRef.current.getBestMove(game.fen());

      if (!move) {
        console.error("No move received");
        setIsThinking(false);
        setMoveMessage("Your turn (white)");
        return;
      }

      // Получаем все возможные ходы
      const legalMoves = game.moves({ verbose: true });

      // Пытаемся найти соответствующий легальный ход
      const from = move.substring(0, 2) as Square;
      const to = move.substring(2, 4) as Square;

      const matchingMove = legalMoves.find(
        (m) => m.from === from && m.to === to
      );

      if (matchingMove) {
        // Делаем ход, используя полную информацию о ходе
        game.move(matchingMove);
        setGame(new Chess(game.fen()));

        // Показываем стрелку последнего хода компьютера
        setLastMoveArrow({
          startSquare: from,
          endSquare: to,
          color: "red",
        });
      } else {
        // Если ход не найден, делаем случайный легальный ход
        if (legalMoves.length > 0) {
          const randomMove =
            legalMoves[Math.floor(Math.random() * legalMoves.length)];
          game.move(randomMove);
          setGame(new Chess(game.fen()));

          // Показываем стрелку случайного хода
          setLastMoveArrow({
            startSquare: randomMove.from,
            endSquare: randomMove.to,
            color: "red",
          });
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
        setGame(new Chess(game.fen()));

        // Показываем стрелку хода при ошибке
        setLastMoveArrow({
          startSquare: randomMove.from,
          endSquare: randomMove.to,
          color: "red",
        });
      }
    }

    setIsThinking(false);
    if (game.isGameOver()) {
      const gameResult = getGameOverMessage();
      setMoveMessage(gameResult);
      onGameEnd?.(gameResult);
    } else {
      setMoveMessage("Your turn (white)");
    }
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
      setSelectedSquare(null);
      setHighlightSquares([]);

      // Показываем стрелку хода игрока
      setLastMoveArrow({
        startSquare: sourceSquare,
        endSquare: targetSquare,
        color: "green",
      });

      if (!game.isGameOver()) {
        makeComputerMove();
      } else {
        const gameResult = getGameOverMessage();
        setMoveMessage(gameResult);
        onGameEnd?.(gameResult);
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  function onSquareClick(square: Square) {
    if (isThinking) return;

    // If clicking the same square, deselect
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setHighlightSquares([]);
      return;
    }

    // If there's a selected square and we click a highlighted square, make the move
    if (selectedSquare && highlightSquares.includes(square)) {
      const moveResult = onDrop(selectedSquare, square);
      if (moveResult) {
        setSelectedSquare(null);
        setHighlightSquares([]);
      }
      return;
    }

    // Get legal moves for the clicked square
    const moves = game.moves({
      square,
      verbose: true,
    });

    if (moves.length > 0) {
      setSelectedSquare(square);
      setHighlightSquares(moves.map((move) => move.to as Square));
    } else {
      setSelectedSquare(null);
      setHighlightSquares([]);
    }
  }

  function getGameOverMessage(): string {
    if (game.isCheckmate()) {
      return game.turn() === "w"
        ? "Checkmate! Black wins!"
        : "Checkmate! White wins!";
    } else if (game.isDraw()) {
      return "Draw!";
    } else if (game.isStalemate()) {
      return "Stalemate!";
    }
    return "Game over!";
  }

  const customPieces = useCustomPieces();

  return (
    <BoardContainer>
      <GameStatus>{moveMessage}</GameStatus>

      <Chessboard
        options={{
          position: game.fen(),
          onPieceDrop: ({ sourceSquare, targetSquare }) =>
            targetSquare
              ? onDrop(sourceSquare as Square, targetSquare as Square)
              : false,
          onSquareClick: ({ square }) => onSquareClick(square as Square),
          ...boardStyles,
          squareStyles: {
            ...(selectedSquare && {
              [selectedSquare]: { background: "rgba(255, 255, 0, 0.4)" },
            }),
            ...Object.fromEntries(
              highlightSquares.map((square) => [
                square,
                {
                  background: game.get(square)
                    ? "radial-gradient(circle, rgba(0, 255, 0, 0.4) 85%, transparent 85%)"
                    : "radial-gradient(circle, rgba(0, 255, 0, 0.4) 25%, transparent 25%)",
                  borderRadius: "50%",
                },
              ])
            ),
          },
          pieces: customPieces,
          allowDrawingArrows: true,
          arrows: lastMoveArrow ? [lastMoveArrow] : [],
        }}
      />
    </BoardContainer>
  );
}
