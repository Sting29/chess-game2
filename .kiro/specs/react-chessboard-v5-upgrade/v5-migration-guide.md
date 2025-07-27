# React Chessboard v5 Migration Guide

## Major Breaking Changes

### 1. Component Structure Change

**v4**: Direct props on `<Chessboard>` component

```tsx
<Chessboard
  position={game.fen()}
  onPieceDrop={onDrop}
  onSquareClick={onSquareClick}
  // ... other props
/>
```

**v5**: All props moved to `options` object

```tsx
<Chessboard
  options={{
    position: game.fen(),
    onPieceDrop: onDrop,
    onSquareClick: onSquareClick,
    // ... other props
  }}
/>
```

### 2. Callback Signature Changes

#### onPieceDrop

**v4**: `(sourceSquare: string, targetSquare: string) => boolean`
**v5**: `({ piece, sourceSquare, targetSquare }: PieceDropHandlerArgs) => boolean`

#### onSquareClick

**v4**: `(square: string) => void`
**v5**: `({ piece, square }: SquareHandlerArgs) => void`

#### onPieceClick (new in v5)

**v5**: `({ isSparePiece, piece, square }: PieceHandlerArgs) => void`

### 3. Promotion Handling Changes

The promotion-related props appear to have been removed or significantly changed:

- `onPromotionCheck` - No longer exists
- `onPromotionPieceSelect` - No longer exists
- `promotionToSquare` - No longer exists
- `showPromotionDialog` - No longer exists

### 4. Dragging Control Changes

**v4**: `isDraggablePiece: (args: { piece: Piece }) => boolean`
**v5**: `canDragPiece: ({ isSparePiece, piece, square }: PieceHandlerArgs) => boolean`

### 5. Styling Changes

**v4**: Individual style props

```tsx
customBoardStyle={...}
customDarkSquareStyle={...}
customLightSquareStyle={...}
customSquareStyles={...}
```

**v5**: All in options object

```tsx
options={{
  boardStyle: {...},
  darkSquareStyle: {...},
  lightSquareStyle: {...},
  squareStyles: {...},
}}
```

### 6. Custom Pieces

**v4**: `customPieces` prop
**v5**: `pieces` in options object

## Migration Steps

### Step 1: Wrap all props in options object

Move all existing props into the `options` object.

### Step 2: Update callback signatures

Update all callback functions to use the new signature with destructured parameters.

### Step 3: Handle promotion logic manually

Since promotion dialogs are no longer built-in, we'll need to implement custom promotion handling.

### Step 4: Update styling props

Rename and move all styling props to the options object.

### Step 5: Update dragging control

Replace `isDraggablePiece` with `canDragPiece` and update the signature.

## New Features in v5

- Arrow drawing support
- Enhanced piece rendering system
- Better TypeScript support
- Improved performance with @dnd-kit
