export const HOW_TO_MOVE = [
  {
    id: "pawn-move",
    pageTitle: "How to move: Pawn",
    initialPosition: "8/Pp6/p7/8/8/8/1P6/8 w - - 0 1",
    descriptionTitle: "Pawn Movement Rules",
    description: [
      "Pawn moves forward one square at a time",
      "From starting position, can move two squares forward",
      "Captures diagonally one square forward",
      "When reaching the last rank, promotes to any piece (except king)",
    ],
  },
  {
    id: "rook-move",
    pageTitle: "How to move: Rook",
    initialPosition: "8/8/p2p4/8/8/3p4/8/R7 w - - 0 1",
    descriptionTitle: "Rook Movement Rules",
    description: [
      "Rook moves horizontally and vertically",
      "Can move any number of squares",
      "Cannot jump over other pieces",
      "Captures enemy pieces by moving to their square",
    ],
  },
  {
    id: "knight-move",
    pageTitle: "How to move: Knight",
    initialPosition: "8/8/1p6/3p4/8/5p2/8/3K4 w - - 0 1",
    descriptionTitle: "Knight Movement Rules",
    description: [
      "Knight moves in an 'L' shape - two squares forward and one in a side",
      "Can jump over other pieces",
      "Can only move to squares of the opposite color",
      "Captures enemy pieces, moving to their place",
    ],
  },
  {
    id: "bishop-move",
    pageTitle: "How to move: Bishop",
    initialPosition: "8/3p4/8/1p3p2/8/8/8/5B2 w - - 0 1",
    descriptionTitle: "Bishop Movement Rules",
    description: [
      "Bishop moves diagonally",
      "Can move any number of squares",
      "Cannot jump over other pieces",
      "Captures enemy pieces by moving to their square",
    ],
  },
  {
    id: "queen-move",
    pageTitle: "How to move: Queen",
    initialPosition: "8/8/1p6/3p4/8/5p2/8/3Q4 w - - 0 1",
    descriptionTitle: "Queen Movement Rules",
    description: [
      "Queen moves horizontally, vertically, and diagonally",
      "Can move any number of squares",
      "Cannot jump over other pieces",
      "Captures enemy pieces by moving to their square",
    ],
  },
  {
    id: "king-move",
    pageTitle: "How to move: King",
    initialPosition: "8/8/1p6/3p4/8/5p2/8/3K4 w - - 0 1",
    descriptionTitle: "King Movement Rules",
    description: [
      "King moves one square in any direction",
      "Cannot move to a square that puts it in check",
      "Cannot move to a square that is already occupied by a friendly piece",
      "Cannot move to a square that is already occupied by an enemy piece",
    ],
  },
];
