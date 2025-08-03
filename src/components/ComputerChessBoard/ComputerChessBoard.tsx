import { useEffect, useState, useRef, useCallback } from "react";
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
import { ThreatInfo } from "src/types/types";

interface ComputerChessBoardProps {
  settings: GameEngineSettings;
  uiSettings: GameUISettings;
  onGameEnd?: (result: string) => void;
  onThreatsChange?: (threats: ThreatInfo) => void;
  showHints?: boolean;
}

export function ComputerChessBoard({
  settings,
  uiSettings,
  onGameEnd,
  onThreatsChange,
  showHints: parentShowHints,
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
  const showHints =
    parentShowHints ?? (settings.kidsMode && uiSettings.showMoveHints);
  const [threatSquares, setThreatSquares] = useState<Square[]>([]);

  useEffect(() => {
    const engine = engineRef.current;
    engine.init();

    return () => {
      engine.quit();
      // Clear any pending timeouts and reset state on unmount
      setThreatSquares([]);
      setSelectedSquare(null);
      setHighlightSquares([]);
      setLastMoveArrow(null);
      setPromotionData(null);
    };
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
    const newShowHints = showHints;

    if (settings.kidsMode && uiSettings.showThreatHighlight) {
      updateThreatAnalysis();
    } else {
      // Clear threats and notify parent when not in kids mode or threat highlighting is disabled
      setThreatSquares([]);
      onThreatsChange?.({
        threatSquares: [],
        showHints: newShowHints,
        kidsMode: settings.kidsMode,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, uiSettings]);

  // Cleanup effect for threat analysis
  useEffect(() => {
    return () => {
      // Clear threat information when component unmounts or game changes
      onThreatsChange?.({
        threatSquares: [],
        showHints: false,
        kidsMode: false,
      });
    };
  }, [onThreatsChange]);

  // Анализ угроз для детского режима
  const updateThreatAnalysis = useCallback(() => {
    try {
      if (!settings.kidsMode || !uiSettings.showThreatHighlight) {
        // Clear threats when not in kids mode or threat highlighting is disabled
        setThreatSquares([]);
        onThreatsChange?.({
          threatSquares: [],
          showHints: showHints,
          kidsMode: settings.kidsMode,
        });
        return;
      }

      const threats: Square[] = [];
      const squares = ["a", "b", "c", "d", "e", "f", "g", "h"];
      const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];

      // Проверяем каждую клетку на угрозы
      for (const file of squares) {
        for (const rank of ranks) {
          const square = (file + rank) as Square;

          try {
            const piece = game.get(square);

            // Если на клетке наша фигура (белая)
            if (piece && piece.color === "w") {
              // Проверяем, атакована ли эта фигура
              if (game.isAttacked(square, "b")) {
                threats.push(square);
              }
            }
          } catch (squareError) {
            // Log error but continue processing other squares
            console.warn(`Error analyzing square ${square}:`, squareError);
          }
        }
      }

      setThreatSquares(threats);

      // Call the callback to notify parent component about threat changes
      onThreatsChange?.({
        threatSquares: threats,
        showHints: showHints,
        kidsMode: settings.kidsMode,
      });
    } catch (error) {
      console.error("Error in threat analysis:", error);
      // Fallback: clear threats on error
      setThreatSquares([]);
      onThreatsChange?.({
        threatSquares: [],
        showHints: showHints,
        kidsMode: settings.kidsMode,
      });
    }
  }, [
    game,
    settings.kidsMode,
    uiSettings.showThreatHighlight,
    showHints,
    onThreatsChange,
  ]);

  const getGameOverMessage = useCallback((): string => {
    try {
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
    } catch (error) {
      console.error("Error determining game over message:", error);
      return "Game over!";
    }
  }, [game]);

  // Функция для проверки promotion
  const isPromotionMove = useCallback(
    (sourceSquare: Square, targetSquare: Square): boolean => {
      try {
        const piece = game.get(sourceSquare);
        if (!piece || piece.type !== "p") return false;
        const [, toRank] = targetSquare.split("");
        return toRank === "8";
      } catch (error) {
        console.warn("Error checking promotion move:", error);
        return false;
      }
    },
    [game]
  );

  const makeComputerMove = useCallback(async () => {
    if (isThinking) return; // Prevent multiple simultaneous moves

    setIsThinking(true);
    setMoveMessage(
      settings.kidsMode ? "Компьютер думает... 🤔" : "Computer is thinking..."
    );

    try {
      // Получаем все легальные ходы для передачи в упрощенные режимы
      const legalMoves = game.moves({ verbose: true });

      if (legalMoves.length === 0) {
        // Game is over, no legal moves
        setIsThinking(false);
        const gameResult = getGameOverMessage();
        setMoveMessage(gameResult);
        onGameEnd?.(gameResult);
        return;
      }

      const move = await engineRef.current.getBestMove(
        game.fen(),
        settings.kidsMode || settings.skill <= 5 ? legalMoves : undefined
      );

      if (!move) {
        console.warn("No move received from engine, making random move");
        // Fallback to random move
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
      } else {
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
          console.warn(
            "Engine move not found in legal moves, making random move"
          );
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
    } catch (error) {
      console.error("Error making computer move:", error);

      try {
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
      } catch (fallbackError) {
        console.error("Critical error: Cannot make any move:", fallbackError);
        setMoveMessage("Game error occurred");
        onGameEnd?.("Game error");
        return;
      }
    }

    setIsThinking(false);

    // Обновляем анализ угроз после хода компьютера
    if (settings.kidsMode) {
      // Use a small delay to ensure game state is updated
      const timeoutId = setTimeout(() => {
        updateThreatAnalysis();
      }, 100);

      // Store timeout ID for cleanup if needed
      return () => clearTimeout(timeoutId);
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
  }, [
    game,
    settings,
    uiSettings,
    isThinking,
    onGameEnd,
    updateThreatAnalysis,
    getGameOverMessage,
  ]);

  const onDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square): boolean => {
      if (isThinking) return false;

      try {
        // Проверяем, является ли ход promotion
        if (isPromotionMove(sourceSquare, targetSquare)) {
          setPromotionData({ sourceSquare, targetSquare });
          return true;
        }

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
        console.warn("Invalid move attempted:", {
          sourceSquare,
          targetSquare,
          error,
        });
        return false;
      }
    },
    [
      game,
      isThinking,
      uiSettings.showLastMoveArrow,
      makeComputerMove,
      onGameEnd,
      getGameOverMessage,
      isPromotionMove,
    ]
  );

  const onSquareClick = useCallback(
    (square: Square) => {
      if (isThinking) return;

      try {
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
      } catch (error) {
        console.warn("Error in square click handler:", error);
        setSelectedSquare(null);
        setHighlightSquares([]);
      }
    },
    [
      isThinking,
      selectedSquare,
      highlightSquares,
      onDrop,
      settings.kidsMode,
      updateThreatAnalysis,
      game,
    ]
  );

  // Функция для обработки выбора фигуры promotion
  const handlePromotionSelection = useCallback(
    (promotionPiece: PromotionPiece) => {
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
        } else {
          console.warn("Promotion move was invalid");
          setPromotionData(null);
        }
      } catch (error) {
        console.error("Promotion move failed:", error);
        setPromotionData(null);
      }
    },
    [
      promotionData,
      game,
      uiSettings.showLastMoveArrow,
      makeComputerMove,
      onGameEnd,
      getGameOverMessage,
    ]
  );

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
