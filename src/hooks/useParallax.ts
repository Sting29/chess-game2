import { useState, useEffect, useRef } from "react";

interface ParallaxPosition {
  x: number;
  y: number;
}

export const useParallax = (factor: number = 20) => {
  const [position, setPosition] = useState<ParallaxPosition>({ x: 0, y: 0 });
  const targetPosition = useRef<ParallaxPosition>({ x: 0, y: 0 });
  const currentPosition = useRef<ParallaxPosition>({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate position from center (values between -1 and 1)
      const xPos = (e.clientX - windowWidth / 2) / (windowWidth / 2);
      const yPos = (e.clientY - windowHeight / 2) / (windowHeight / 2);

      // Update target position
      targetPosition.current = {
        x: xPos * factor,
        y: yPos * factor,
      };

      // Start animation if not already running
      if (!isAnimating.current) {
        isAnimating.current = true;
        animationFrame.current = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      const dx = targetPosition.current.x - currentPosition.current.x;
      const dy = targetPosition.current.y - currentPosition.current.y;

      // If changes are very small, stop animation
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        currentPosition.current = targetPosition.current;
        setPosition(currentPosition.current);
        isAnimating.current = false;
        return;
      }

      // Smooth interpolation
      currentPosition.current = {
        x: currentPosition.current.x + dx * 0.15,
        y: currentPosition.current.y + dy * 0.15,
      };

      setPosition(currentPosition.current);
      animationFrame.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [factor]);

  return position;
};
