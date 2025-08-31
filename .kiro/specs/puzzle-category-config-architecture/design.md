# Design Document

## Overview

This design establishes a comprehensive configuration-based architecture for the PuzzleCategory page, replacing hardcoded visual elements with flexible TypeScript configuration files. The system enables dynamic background selection based on user progress, category-specific compass variations, and fully configurable decorative elements with animation support. All positioning uses percentage-based coordinates for responsive design, with special handling for mobile rotation and scaling.

## Architecture

### Configuration System Structure

```
src/pages/PuzzleCategory/
├── config/
│   ├── backgrounds/
│   │   ├── background1.config.ts
│   │   ├── background2.config.ts
│   │   └── index.ts
│   ├── decorative/
│   │   ├── decorativeElements.config.ts
│   │   └── index.ts
│   └── index.ts
├── components/
│   ├── ConfigurableBackground/
│   ├── ConfigurableDecorative/
│   ├── ConfigurableTrack/
│   └── ConfigurableStone/
├── hooks/
│   ├── useBackgroundConfig.ts
│   ├── useResponsiveLayout.ts
│   └── useConfigValidation.ts
└── utils/
    ├── configLoader.ts
    ├── positionCalculator.ts
    └── animationManager.ts
```

### Core Interfaces

#### BackgroundConfig Interface

```typescript
interface BackgroundConfig {
  id: string; // Unique identifier, e.g., 'puzzle_5'
  background: string; // Path to background image without track
  track: string; // Path to track image, stored in same folder as background
  trackPosition?: { x: number; y: number }; // Optional track coordinates (percentage)
  stonePositions: { x: number; y: number }[]; // Array of 10 stone positions relative to track
  decorativeElements: DecorativeConfig[]; // Array of decorative elements for this background
}
```

#### DecorativeConfig Interface

```typescript
interface DecorativeConfig {
  name: string; // Filename, e.g., 'bone.png'
  x: number; // X position (percentage 0-100 of background width)
  y: number; // Y position (percentage 0-100 of background height)
  width: number; // Element width in pixels
  height: number; // Element height in pixels
  show: boolean; // Visibility flag
  backgroundId: string; // Associated background identifier
  animationType?: "none" | "fadeIn" | "pulse" | "float"; // Animation type, defaults to 'none'
}
```

#### CompassConfig Interface

```typescript
interface CompassConfig {
  categoryId: string; // Puzzle category identifier
  imagePath: string; // Path to category-specific compass image
  position: { x: number; y: number }; // Position as percentage coordinates
  width: number; // Compass width in pixels
  height: number; // Compass height in pixels
}
```

## Components and Interfaces

### 1. ConfigurableBackground Component

**Purpose**: Renders background with dynamic configuration loading

```typescript
interface ConfigurableBackgroundProps {
  pageNumber: number;
  categoryId: string;
  children: React.ReactNode;
}

const ConfigurableBackground: React.FC<ConfigurableBackgroundProps> = ({
  pageNumber,
  categoryId,
  children,
}) => {
  const backgroundConfig = useBackgroundConfig(pageNumber);
  const compassConfig = useCompassConfig(categoryId);

  return (
    <BackgroundContainer backgroundImage={backgroundConfig.background}>
      <ConfigurableTrack config={backgroundConfig} />
      <ConfigurableCompass config={compassConfig} />
      <DecorativeElementsLayer elements={backgroundConfig.decorativeElements} />
      {children}
    </BackgroundContainer>
  );
};
```

### 2. ConfigurableTrack Component

**Purpose**: Renders track with configurable positioning

```typescript
interface ConfigurableTrackProps {
  config: BackgroundConfig;
  isRotated: boolean;
}

const ConfigurableTrack: React.FC<ConfigurableTrackProps> = ({
  config,
  isRotated,
}) => {
  const position = config.trackPosition || { x: 50, y: 50 }; // Default to center

  return (
    <TrackContainer
      x={position.x}
      y={position.y}
      isRotated={isRotated}
      backgroundImage={config.track}
    />
  );
};
```

### 3. ConfigurableStone Component

**Purpose**: Renders stones with positions relative to track

```typescript
interface ConfigurableStoneProps {
  puzzle: Puzzle;
  stoneIndex: number;
  trackPosition: { x: number; y: number };
  stonePosition: { x: number; y: number };
  isRotated: boolean;
  scaleFactor: number;
  onClick: () => void;
}

const ConfigurableStone: React.FC<ConfigurableStoneProps> = ({
  puzzle,
  stoneIndex,
  trackPosition,
  stonePosition,
  isRotated,
  scaleFactor,
  onClick,
}) => {
  const absolutePosition = calculateAbsolutePosition(
    trackPosition,
    stonePosition,
    isRotated
  );

  return (
    <StoneContainer
      position={absolutePosition}
      isRotated={isRotated}
      scaleFactor={scaleFactor}
      onClick={onClick}
    >
      <StoneImage src={getStoneImage(puzzle.state)} />
      <StoneNumber>{stoneIndex + 1}</StoneNumber>
      {puzzle.state === "completed" && <CompletionCheckmark />}
      {puzzle.state === "locked" && <LockOverlay />}
    </StoneContainer>
  );
};
```

### 4. ConfigurableDecorative Component

**Purpose**: Renders decorative elements with animations

```typescript
interface ConfigurableDecorativeProps {
  element: DecorativeConfig;
  containerDimensions: { width: number; height: number };
}

const ConfigurableDecorative: React.FC<ConfigurableDecorativeProps> = ({
  element,
  containerDimensions,
}) => {
  if (!element.show) return null;

  const pixelPosition = {
    x: (element.x / 100) * containerDimensions.width,
    y: (element.y / 100) * containerDimensions.height,
  };

  return (
    <DecorativeContainer
      position={pixelPosition}
      width={element.width}
      height={element.height}
      animationType={element.animationType || "none"}
    >
      <DecorativeImage src={getDecorativeImagePath(element)} />
    </DecorativeContainer>
  );
};
```

## Data Models

### Configuration Loading System

```typescript
// Background configuration loader
export const loadBackgroundConfig = (pageNumber: number): BackgroundConfig => {
  const configId = `background${pageNumber + 1}`;

  try {
    const config = backgroundConfigs[configId];
    if (!config) {
      console.warn(
        `Background config not found for page ${pageNumber}, using default`
      );
      return backgroundConfigs.default;
    }
    return validateBackgroundConfig(config);
  } catch (error) {
    console.error("Error loading background config:", error);
    return backgroundConfigs.default;
  }
};

// Compass configuration loader
export const loadCompassConfig = (categoryId: string): CompassConfig => {
  const config = compassConfigs[categoryId];
  if (!config) {
    return compassConfigs.default;
  }
  return validateCompassConfig(config);
};
```

### Position Calculation System

```typescript
// Calculate absolute stone position relative to track
export const calculateAbsolutePosition = (
  trackPosition: { x: number; y: number },
  stonePosition: { x: number; y: number },
  isRotated: boolean
): { x: number; y: number } => {
  if (isRotated) {
    // Rotate coordinates for portrait orientation
    return {
      x: trackPosition.x + stonePosition.y, // Swap and adjust for rotation
      y: trackPosition.y - stonePosition.x,
    };
  }

  return {
    x: trackPosition.x + stonePosition.x,
    y: trackPosition.y + stonePosition.y,
  };
};

// Calculate responsive scale factor
export const calculateScaleFactor = (screenWidth: number): number => {
  if (screenWidth < 480) return 0.7; // Mobile phones
  if (screenWidth < 768) return 0.8; // Small tablets
  if (screenWidth < 1024) return 0.9; // Large tablets
  return 1.0; // Desktop
};
```

## Configuration Examples

### Background Configuration Example

```typescript
// src/pages/PuzzleCategory/config/backgrounds/background1.config.ts
export const background1Config: BackgroundConfig = {
  id: "puzzle_5",
  background:
    "src/assets/background/puzzles/puzzle_5/background_puzzles_clear.png",
  track: "src/assets/background/puzzles/puzzle_5/track.png",
  trackPosition: { x: 50, y: 50 }, // Centered
  stonePositions: [
    { x: -20, y: -15 }, // Stone 1 relative to track center
    { x: -25, y: 0 }, // Stone 2
    { x: -20, y: 15 }, // Stone 3
    { x: -5, y: 25 }, // Stone 4
    { x: 10, y: 30 }, // Stone 5
    { x: 25, y: 25 }, // Stone 6
    { x: 35, y: 15 }, // Stone 7
    { x: 40, y: 0 }, // Stone 8
    { x: 35, y: -15 }, // Stone 9
    { x: 25, y: -25 }, // Stone 10
  ],
  decorativeElements: [
    {
      name: "anchor.png",
      x: 85,
      y: 15,
      width: 60,
      height: 80,
      show: true,
      backgroundId: "puzzle_5",
      animationType: "float",
    },
    {
      name: "bone.png",
      x: 20,
      y: 80,
      width: 40,
      height: 25,
      show: true,
      backgroundId: "puzzle_5",
      animationType: "none",
    },
    {
      name: "coins.png",
      x: 75,
      y: 85,
      width: 35,
      height: 35,
      show: true,
      backgroundId: "puzzle_5",
      animationType: "pulse",
    },
  ],
};
```

### Compass Configuration Example

```typescript
// src/pages/PuzzleCategory/config/compass.config.ts
export const compassConfigs: Record<string, CompassConfig> = {
  tactics: {
    categoryId: "tactics",
    imagePath: "src/assets/background/puzzles/common/compass_tactics.png",
    position: { x: 85, y: 85 },
    width: 50,
    height: 50,
  },
  endgame: {
    categoryId: "endgame",
    imagePath: "src/assets/background/puzzles/common/compass_endgame.png",
    position: { x: 85, y: 85 },
    width: 50,
    height: 50,
  },
  default: {
    categoryId: "default",
    imagePath: "src/assets/background/puzzles/common/compass.png",
    position: { x: 85, y: 85 },
    width: 50,
    height: 50,
  },
};
```

## Responsive Design System

### Breakpoint Configuration

```typescript
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
} as const;

export const SCALE_FACTORS = {
  mobile: 0.7,
  tablet: 0.8,
  desktop: 1.0,
} as const;
```

### Rotation Logic

```typescript
export const useResponsiveLayout = () => {
  const [isRotated, setIsRotated] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const updateLayout = () => {
      const { innerWidth, innerHeight } = window;
      const isPortrait = innerHeight > innerWidth;
      const isMobileOrTablet = innerWidth < BREAKPOINTS.desktop;

      setIsRotated(isPortrait && isMobileOrTablet);
      setScaleFactor(calculateScaleFactor(innerWidth));
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    window.addEventListener("orientationchange", updateLayout);

    return () => {
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("orientationchange", updateLayout);
    };
  }, []);

  return { isRotated, scaleFactor };
};
```

## Animation System

### Animation Definitions

```typescript
export const ANIMATIONS = {
  fadeIn: keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `,
  pulse: keyframes`
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  `,
  float: keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  `,
};

export const getAnimationStyle = (type: DecorativeConfig["animationType"]) => {
  switch (type) {
    case "fadeIn":
      return css`
        animation: ${ANIMATIONS.fadeIn} 0.5s ease-in;
      `;
    case "pulse":
      return css`
        animation: ${ANIMATIONS.pulse} 2s ease-in-out infinite;
      `;
    case "float":
      return css`
        animation: ${ANIMATIONS.float} 3s ease-in-out infinite;
      `;
    default:
      return css``;
  }
};
```

## Error Handling

### Configuration Validation

```typescript
export const validateBackgroundConfig = (config: any): BackgroundConfig => {
  const errors: string[] = [];

  if (!config.id) errors.push("Background config missing id");
  if (!config.background)
    errors.push("Background config missing background image");
  if (!config.track) errors.push("Background config missing track image");
  if (
    !Array.isArray(config.stonePositions) ||
    config.stonePositions.length !== 10
  ) {
    errors.push("Background config must have exactly 10 stone positions");
  }

  if (errors.length > 0) {
    throw new Error(`Invalid background configuration: ${errors.join(", ")}`);
  }

  return config as BackgroundConfig;
};

export const validateDecorativeConfig = (config: any): DecorativeConfig => {
  const errors: string[] = [];

  if (!config.name) errors.push("Decorative config missing name");
  if (typeof config.x !== "number" || config.x < 0 || config.x > 100) {
    errors.push("Decorative config x must be number between 0-100");
  }
  if (typeof config.y !== "number" || config.y < 0 || config.y > 100) {
    errors.push("Decorative config y must be number between 0-100");
  }

  if (errors.length > 0) {
    throw new Error(`Invalid decorative configuration: ${errors.join(", ")}`);
  }

  return config as DecorativeConfig;
};
```

### Fallback Strategies

```typescript
export const createFallbackConfig = (): BackgroundConfig => ({
  id: "fallback",
  background:
    "src/assets/background/puzzles/puzzle_5/background_puzzles_clear.png",
  track: "src/assets/background/puzzles/puzzle_5/track.png",
  stonePositions: generateDefaultStonePositions(),
  decorativeElements: [],
});

const generateDefaultStonePositions = (): { x: number; y: number }[] => {
  // Generate simple circular arrangement as fallback
  return Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * 2 * Math.PI;
    return {
      x: Math.cos(angle) * 30,
      y: Math.sin(angle) * 30,
    };
  });
};
```

## Testing Strategy

### Configuration Testing

```typescript
describe("Configuration System", () => {
  test("loads background config correctly", () => {
    const config = loadBackgroundConfig(0);
    expect(config).toHaveProperty("id");
    expect(config.stonePositions).toHaveLength(10);
  });

  test("validates configuration structure", () => {
    expect(() => validateBackgroundConfig({})).toThrow();
    expect(() => validateBackgroundConfig(validConfig)).not.toThrow();
  });

  test("handles missing configurations gracefully", () => {
    const config = loadBackgroundConfig(999);
    expect(config.id).toBe("fallback");
  });
});
```

### Component Integration Testing

```typescript
describe("ConfigurableBackground", () => {
  test("renders with valid configuration", () => {
    render(
      <ConfigurableBackground pageNumber={0} categoryId="tactics">
        <div>Test content</div>
      </ConfigurableBackground>
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  test("applies correct positioning", () => {
    const { container } = render(<ConfigurableStone {...mockProps} />);
    const stone = container.firstChild;

    expect(stone).toHaveStyle({
      left: "50%",
      top: "50%",
    });
  });
});
```

## Performance Considerations

### Configuration Caching

```typescript
const configCache = new Map<string, BackgroundConfig>();

export const getCachedBackgroundConfig = (
  pageNumber: number
): BackgroundConfig => {
  const cacheKey = `background_${pageNumber}`;

  if (configCache.has(cacheKey)) {
    return configCache.get(cacheKey)!;
  }

  const config = loadBackgroundConfig(pageNumber);
  configCache.set(cacheKey, config);
  return config;
};
```

### Image Preloading

```typescript
export const preloadConfigurationImages = (configs: BackgroundConfig[]) => {
  configs.forEach((config) => {
    // Preload background and track images
    const bgImage = new Image();
    bgImage.src = config.background;

    const trackImage = new Image();
    trackImage.src = config.track;

    // Preload decorative element images
    config.decorativeElements.forEach((element) => {
      const decorativeImage = new Image();
      decorativeImage.src = getDecorativeImagePath(element);
    });
  });
};
```

## Migration Strategy

### Backward Compatibility

The new configuration system will be implemented alongside the existing hardcoded system, allowing for gradual migration:

1. **Phase 1**: Implement configuration interfaces and loading system
2. **Phase 2**: Create default configurations matching current hardcoded values
3. **Phase 3**: Update components to use configurations with fallbacks to hardcoded values
4. **Phase 4**: Remove hardcoded values once all configurations are in place

### Configuration Migration Tool

```typescript
export const migrateHardcodedToConfig = (
  existingLayout: any
): BackgroundConfig => {
  return {
    id: "migrated",
    background: existingLayout.backgroundImage,
    track: existingLayout.trackImage,
    trackPosition: existingLayout.trackPosition || { x: 50, y: 50 },
    stonePositions:
      existingLayout.stonePositions || generateDefaultStonePositions(),
    decorativeElements:
      existingLayout.decorativeElements?.map(migrateDecorativeElement) || [],
  };
};
```
