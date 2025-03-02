puzzle-data.ts

import { Piece } from "@shared/chess-types";

export interface ChessPuzzle {
id: string;
title: string;
description: string;
initialPosition: { [key: string]: Piece };
correctMoves: Array<{
from: string;
to: string;
piece?: string;
isComputerMove?: boolean;
}>;
hint: string;
playerColor: 'w' | 'b';
}

// Группируем пазлы по количеству ходов
export interface PuzzleCategory {
id: string;
title: string;
description: string;
puzzles: ChessPuzzle[];
}

export const CHESS_PUZZLES: PuzzleCategory[] = [
{
id: 'mate-in-one',
title: 'Мат в 1 ход',
description: 'Найдите ход, ведущий к мату',
puzzles: [
{
id: '1',
title: 'Мат в 1 ход - Задача 1',
description: 'Белые начинают и ставят мат в 1 ход',
initialPosition: {
'f1': 'wK',
'a1': 'wR',
'e1': 'wR',
'e2': 'wP',
'f2': 'wP',
'g2': 'wP',
'h2': 'wP',
'g8': 'bK',
'f7': 'bP',
'g7': 'bP',
'h7': 'bP'
},
correctMoves: [
{ from: 'a1', to: 'a8', piece: 'wR' }
],
hint: 'Ладья может поставить мат по открытой вертикали',
playerColor: 'w'
},
{
id: '2',
title: 'Мат в 1 ход - Задача 2',
description: 'Белые начинают и ставят мат в 1 ход',
initialPosition: {
'g2': 'wK',
'c1': 'wQ',
'h8': 'bK',
'g7': 'bP',
'g8': 'bR'
},
correctMoves: [
{ from: 'c1', to: 'h1', piece: 'wQ' }
],
hint: 'Ферзь может поставить мат по первой горизонтали',
playerColor: 'w'
}
]
},
{
id: 'mate-in-two',
title: 'Мат в 2 хода',
description: 'Найдите комбинацию из двух ходов, ведущую к мату',
puzzles: [
{
id: '1',
title: 'Мат в 2 хода - Задача 1',
description: 'Белые начинают и ставят мат в 2 хода',
initialPosition: {
'g1': 'wK',
'e1': 'wR',
'f2': 'wP',
'g2': 'wP',
'e7': 'wB',
'h8': 'bK',
'h7': 'bP',
'f7': 'bP',
'c7': 'bP',
'g4': 'bQ',
'h3': 'bB'
},
correctMoves: [
{ from: 'e7', to: 'f6', piece: 'wB' },
{ from: 'h8', to: 'g8', piece: 'bK', isComputerMove: true },
{ from: 'e1', to: 'e8', piece: 'wR' }
],
hint: 'Слон должен контролировать важное поле, вынуждая короля двигаться',
playerColor: 'w'
}
]
}
];
