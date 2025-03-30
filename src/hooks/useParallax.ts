import { useState, useEffect, useRef } from "react";

interface ParallaxPosition {
  x: number;
  y: number;
}

export const useParallax = (factor: number = 20) => {
  const [position, setPosition] = useState<ParallaxPosition>({ x: 0, y: 0 });
  const lastUpdate = useRef(0);
  const currentPosition = useRef<ParallaxPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      // Throttle updates to 60fps
      if (now - lastUpdate.current < 16) return;
      lastUpdate.current = now;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate position from center (values between -1 and 1)
      const xPos = (e.clientX - windowWidth / 2) / (windowWidth / 2);
      const yPos = (e.clientY - windowHeight / 2) / (windowHeight / 2);

      // Apply easing
      const targetX = xPos * factor;
      const targetY = yPos * factor;

      // Smooth interpolation
      currentPosition.current = {
        x:
          currentPosition.current.x +
          (targetX - currentPosition.current.x) * 0.1,
        y:
          currentPosition.current.y +
          (targetY - currentPosition.current.y) * 0.1,
      };

      setPosition(currentPosition.current);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [factor]);

  return position;
};
