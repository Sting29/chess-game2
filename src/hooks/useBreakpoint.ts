import { useEffect, useState } from "react";

export type Breakpoint = "fullHD" | "desktop" | "laptop" | "tablet" | "mobile";

function getBreakpoint(width: number): Breakpoint {
  if (width >= 1600) return "fullHD";
  if (width >= 1440) return "desktop";
  if (width >= 1240) return "laptop";
  if (width >= 768) return "tablet";
  return "mobile"; // Added default return to handle all cases
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() =>
    getBreakpoint(window.innerWidth)
  );

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    breakpoint,
  };
}
