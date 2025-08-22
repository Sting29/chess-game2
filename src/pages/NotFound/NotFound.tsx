/**
 * Страница 404 - Не найдено
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled, keyframes } from "styled-components";
import { ROUTES } from "src/routes/constants";
import { usePageMetadata } from "src/hooks";

// Анимации
const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
  }
`;

// Стилизованные компоненты
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 20px,
    rgba(255, 255, 255, 0.1) 20px,
    rgba(255, 255, 255, 0.1) 40px
  );
`;

const ChessBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 30px);
  grid-template-rows: repeat(8, 30px);
  gap: 0;
  margin: 2rem 0;
  animation: ${float} 3s ease-in-out infinite;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const ChessSquare = styled.div<{ $isLight: boolean }>`
  background-color: ${(props) => (props.$isLight ? "#f0d9b5" : "#b58863")};
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    z-index: 1;
  }
`;

const ErrorCode = styled.h1`
  font-size: clamp(4rem, 15vw, 8rem);
  font-weight: 900;
  margin: 0;
  background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${fadeInUp} 0.8s ease-out, gradient-shift 3s ease infinite;

  @keyframes gradient-shift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const Title = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin: 1rem 0;
  font-weight: 600;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
`;

const Description = styled.p`
  font-size: 1.1rem;
  max-width: 500px;
  margin: 1rem 0 2rem;
  line-height: 1.6;
  opacity: 0.9;
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  animation: ${fadeInUp} 0.8s ease-out 0.6s both;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background: linear-gradient(45deg, #007bff, #0056b3);
    color: white;
    animation: ${pulse} 2s infinite;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 123, 255, 0.3);
    }
  `
      : `
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

const Countdown = styled.div`
  margin-top: 2rem;
  font-size: 0.9rem;
  opacity: 0.7;
  animation: ${fadeInUp} 0.8s ease-out 0.8s both;
`;

const chessPieces = [
  "♔",
  "♕",
  "♖",
  "♗",
  "♘",
  "♙",
  "♚",
  "♛",
  "♜",
  "♝",
  "♞",
  "♟",
];

/**
 * Страница 404 с красивым дизайном и шахматной тематикой
 */
export function NotFound(): React.ReactElement {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [board, setBoard] = useState<string[]>([]);

  // Устанавливаем мета-данные страницы
  usePageMetadata({
    title: "Page Not Found - 404",
    description:
      "The requested page could not be found. Return to the chess learning app homepage.",
  });

  // Генерируем случайную шахматную доску
  useEffect(() => {
    const newBoard = Array(64)
      .fill("")
      .map((_, index) => {
        if (Math.random() > 0.7) {
          return chessPieces[Math.floor(Math.random() * chessPieces.length)];
        }
        return "";
      });
    setBoard(newBoard);
  }, []);

  // Автоматический редирект через 10 секунд
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate(ROUTES.ROOT);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoHome = () => {
    navigate(ROUTES.ROOT);
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(ROUTES.ROOT);
    }
  };

  const handlePlayGame = () => {
    navigate(ROUTES.PLAY);
  };

  const handleLearnChess = () => {
    navigate(ROUTES.HOW_TO_MOVE);
  };

  return (
    <Container>
      <BackgroundPattern />

      <ErrorCode>404</ErrorCode>

      <Title>Oops! Page Not Found</Title>

      <Description>
        It looks like this page has moved to a different square on the board!
        Don't worry, even grandmasters sometimes make wrong moves. Let's get you
        back to the game.
      </Description>

      <ChessBoard>
        {board.map((piece, index) => (
          <ChessSquare
            key={index}
            $isLight={(Math.floor(index / 8) + index) % 2 === 0}
          >
            {piece}
          </ChessSquare>
        ))}
      </ChessBoard>

      <ButtonGroup>
        <Button $variant="primary" onClick={handleGoHome}>
          🏠 Go Home
        </Button>

        <Button onClick={handleGoBack}>← Go Back</Button>

        <Button onClick={handlePlayGame}>🎮 Play Chess</Button>

        <Button onClick={handleLearnChess}>📚 Learn Chess</Button>
      </ButtonGroup>

      <Countdown>
        Automatically redirecting to homepage in {countdown} seconds...
      </Countdown>
    </Container>
  );
}
