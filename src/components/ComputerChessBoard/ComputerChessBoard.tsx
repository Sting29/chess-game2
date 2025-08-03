import { useEffect, useState, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Square } from "src/types/playTypes";
import { StockfishEngine } from "src/utils/StockfishEngine";
import { useCustomPieces } from "src/components/CustomPieces/CustomPieces";
import { boardStyles } from "src/data/boardSettings";
import { BoardContainer, GameStatus } from "src/styles/BoardStyles";
import { PromotionDialog } from "../PromotionDialog/PromotionDialog";
import { PromotionPiece } from "src/types/types";
import { GameEngineSettings, GameUISettings } from "src/config/gameSettings";

interface ComputerChessBoardProps {
  settings: GameEngineSettings;
  uiSettings: GameUISettings;
  onGameEnd?: (result: string) => void;
}

export function ComputerChessBoard({
  settings,
  uiSettings,
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
  const [promotionData, setPromotionData] = useState<{
    sourceSquare: Square;
    targetSquare: Square;
  } | null>(null);
  // Состояния для детского режима
  const [showHints, setShowHints] = useState(
    settings.kidsMode && uiSettings.showMoveHints
  );
  const [threatSquares, setThreatSquares] = useState<Square[]>([]);

  useEffect(() => {
    const engine = engineRef.current;
    engine.init();

    return () => engine.quit();
  }, []);

  useEffect(() => {
    engineRef.current.setOptions({
      Skill: settings.skill,
      Depth: settings.depth,
      Time: settings.time,
      MultiPV: settings.MultiPV,
      Threads: settings.threads,
      KidsMode: settings.kidsMode || false,
    });

    // Настраиваем UI на основе настроек
    setShowHints(settings.kidsMode && uiSettings.showMoveHints);

    if (settings.kidsMode && uiSettings.showThreatHighlight) {
      updateThreatAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, uiSettings]);

  // Анализ угроз для детского режима
  const updateThreatAnalysis = () => {
    if (!settings.kidsMode || !uiSettings.showThreatHighlight) return;

    const threats: Square[] = [];
    const squares = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];

    // Проверяем каждую клетку на угрозы
    for (const file of squares) {
      for (const rank of ranks) {
        const square = (file + rank) as Square;
        const piece = game.get(square);

        // Если на клетке наша фигура (белая)
        if (piece && piece.color === "w") {
          // Проверяем, атакована ли эта фигура
          if (game.isAttacked(square, "b")) {
            threats.push(square);
          }
        }
      }
    }

    setThreatSquares(threats);
  };

  const makeComputerMove = async () => {
    setIsThinking(true);
    setMoveMessage(
      settings.kidsMode ? "Компьютер думает... 🤔" : "Computer is thinking..."
    );

    try {
      // Получаем все легальные ходы для передачи в упрощенные режимы
      const legalMoves = game.moves({ verbose: true });

      const move = await engineRef.current.getBestMove(
        game.fen(),
        settings.kidsMode || settings.skill <= 5 ? legalMoves : undefined
      );

      if (!move) {
        console.error("No move received");
        setIsThinking(false);
        setMoveMessage("Your turn (white)");
        return;
      }

      // Получаем все возможные ходы
      const from = move.substring(0, 2) as Square;
      const to = move.substring(2, 4) as Square;

      const matchingMove = legalMoves.find(
        (m) => m.from === from && m.to === to
      );

      if (matchingMove) {
        // Делаем ход, используя полную информацию о ходе
        game.move(matchingMove);
        setGame(new Chess(game.fen()));

        // Показываем стрелку последнего хода компьютера (если включено)
        if (uiSettings.showLastMoveArrow) {
          setLastMoveArrow({
            startSquare: from,
            endSquare: to,
            color: settings.kidsMode ? "orange" : "red",
          });
        } else {
          setLastMoveArrow(null);
        }

        // В детском режиме добавляем забавные сообщения
        if (settings.kidsMode) {
          const funMessages = [
            "Мой ход! 😊",
            "Попробуй поймать меня! 😄",
            "Интересно, что ты ответишь? 🤔",
            "Твоя очередь! 👍",
          ];
          setMoveMessage(
            funMessages[Math.floor(Math.random() * funMessages.length)]
          );
        }
      } else {
        // Если ход не найден, делаем случайный легальный ход
        if (legalMoves.length > 0) {
          const randomMove =
            legalMoves[Math.floor(Math.random() * legalMoves.length)];
          game.move(randomMove);
          setGame(new Chess(game.fen()));

          setLastMoveArrow({
            startSquare: randomMove.from,
            endSquare: randomMove.to,
            color: settings.kidsMode ? "orange" : "red",
          });
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

        if (uiSettings.showLastMoveArrow) {
          setLastMoveArrow({
            startSquare: randomMove.from,
            endSquare: randomMove.to,
            color: settings.kidsMode ? "orange" : "red",
          });
        } else {
          setLastMoveArrow(null);
        }
      }
    }

    setIsThinking(false);

    // Обновляем анализ угроз после хода компьютера
    if (settings.kidsMode) {
      setTimeout(updateThreatAnalysis, 100);
    }

    if (game.isGameOver()) {
      const gameResult = getGameOverMessage();
      setMoveMessage(gameResult);
      onGameEnd?.(gameResult);
    } else {
      setMoveMessage(
        settings.kidsMode
          ? "Твой ход! Думай хорошенько! 🧠"
          : "Your turn (white)"
      );
    }
  };

  function onDrop(sourceSquare: Square, targetSquare: Square): boolean {
    if (isThinking) return false;

    // Проверяем, является ли ход promotion
    if (isPromotionMove(sourceSquare, targetSquare)) {
      setPromotionData({ sourceSquare, targetSquare });
      return true;
    }

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // автоматически превращаем в ферзя для обычных ходов
      });

      if (move === null) return false;

      setGame(new Chess(game.fen()));
      setSelectedSquare(null);
      setHighlightSquares([]);

      // Показываем стрелку хода игрока (если включено)
      if (uiSettings.showLastMoveArrow) {
        setLastMoveArrow({
          startSquare: sourceSquare,
          endSquare: targetSquare,
          color: "green",
        });
      } else {
        setLastMoveArrow(null);
      }

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

        // Обновляем анализ угроз после хода игрока
        if (settings.kidsMode) {
          setTimeout(updateThreatAnalysis, 100);
        }
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

  // Функция для проверки promotion
  function isPromotionMove(
    sourceSquare: Square,
    targetSquare: Square
  ): boolean {
    const piece = game.get(sourceSquare);
    if (!piece || piece.type !== "p") return false;
    const [, toRank] = targetSquare.split("");
    return toRank === "8";
  }

  // Функция для обработки выбора фигуры promotion
  function handlePromotionSelection(promotionPiece: PromotionPiece) {
    if (!promotionData) return;

    const { sourceSquare, targetSquare } = promotionData;

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: promotionPiece,
      });

      if (move) {
        setGame(new Chess(game.fen()));
        setSelectedSquare(null);
        setHighlightSquares([]);
        setPromotionData(null);

        // Показываем стрелку хода игрока (если включено)
        if (uiSettings.showLastMoveArrow) {
          setLastMoveArrow({
            startSquare: sourceSquare,
            endSquare: targetSquare,
            color: "green",
          });
        } else {
          setLastMoveArrow(null);
        }

        if (!game.isGameOver()) {
          makeComputerMove();
        } else {
          const gameResult = getGameOverMessage();
          setMoveMessage(gameResult);
          onGameEnd?.(gameResult);
        }
      }
    } catch (error) {
      console.error("Promotion move failed:", error);
      setPromotionData(null);
    }
  }

  const customPieces = useCustomPieces();

  return (
    <BoardContainer>
      <GameStatus>{moveMessage}</GameStatus>

      {/* Кнопка подсказок для детского режима */}
      {settings.kidsMode && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          <button
            onClick={() => setShowHints(!showHints)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              background: showHints ? "#4CAF50" : "#FF9800",
              color: "white",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {showHints ? "🙈 Скрыть подсказки" : "👁️ Показать подсказки"}
          </button>
        </div>
      )}

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
            // Выделение выбранной клетки
            ...(selectedSquare && {
              [selectedSquare]: {
                background: settings.kidsMode
                  ? "rgba(255, 215, 0, 0.6)" // Золотой для детского режима
                  : "rgba(255, 255, 0, 0.4)",
              },
            }),
            // Подсветка возможных ходов
            ...Object.fromEntries(
              highlightSquares.map((square) => [
                square,
                {
                  background: game.get(square)
                    ? settings.kidsMode
                      ? "radial-gradient(circle, rgba(76, 175, 80, 0.8) 85%, transparent 85%)" // Ярче для детей
                      : "radial-gradient(circle, rgba(0, 255, 0, 0.4) 85%, transparent 85%)"
                    : settings.kidsMode
                    ? "radial-gradient(circle, rgba(76, 175, 80, 0.8) 25%, transparent 25%)"
                    : "radial-gradient(circle, rgba(0, 255, 0, 0.4) 25%, transparent 25%)",
                  borderRadius: "50%",
                },
              ])
            ),
            // Подсветка угроз в детском режиме
            ...(settings.kidsMode &&
              showHints &&
              Object.fromEntries(
                threatSquares.map((square) => [
                  square,
                  {
                    background: "rgba(255, 0, 0, 0.3)",
                    border: "3px solid #ff0000",
                    borderRadius: "8px",
                    animation: "pulse 2s infinite",
                  },
                ])
              )),
          },
          pieces: customPieces,
          allowDrawingArrows: true,
          arrows: lastMoveArrow ? [lastMoveArrow] : [],
        }}
      />

      {/* Панель подсказок для детского режима */}
      {settings.kidsMode && showHints && threatSquares.length > 0 && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "rgba(255, 0, 0, 0.1)",
            borderRadius: "10px",
            border: "2px solid #ff6b6b",
            textAlign: "center" as const,
          }}
        >
          <div style={{ fontSize: "18px", marginBottom: "5px" }}>
            ⚠️ ОСТОРОЖНО!
          </div>
          <div style={{ fontSize: "14px" }}>
            {threatSquares.length === 1
              ? "Твоя фигура под атакой! Защити её или убери в безопасное место."
              : `${threatSquares.length} твоих фигур под атакой! Будь осторожен!`}
          </div>
        </div>
      )}

      <PromotionDialog
        isOpen={!!promotionData}
        onSelect={handlePromotionSelection}
        onClose={() => setPromotionData(null)}
      />

      {/* CSS анимация для мигания угроз */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.7; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </BoardContainer>
  );
}
