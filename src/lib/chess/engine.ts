import {
  Board,
  GameState,
  Position,
  Move,
  Piece,
  PieceType,
  PieceColor,
  Square,
  positionToAlgebraic,
  PIECE_VALUES
} from './types';

// Создание начальной позиции
export function createInitialBoard(): Board {
  const board: Board = [];
  
  // Чёрные фигуры (ряд 0)
  board.push([
    { type: 'r', color: 'b' },
    { type: 'n', color: 'b' },
    { type: 'b', color: 'b' },
    { type: 'q', color: 'b' },
    { type: 'k', color: 'b' },
    { type: 'b', color: 'b' },
    { type: 'n', color: 'b' },
    { type: 'r', color: 'b' }
  ]);
  
  // Чёрные пешки (ряд 1)
  board.push(Array(8).fill(null).map(() => ({ type: 'p', color: 'b' } as Piece)));
  
  // Пустые клетки (ряды 2-5)
  for (let i = 0; i < 4; i++) {
    board.push(Array(8).fill(null));
  }
  
  // Белые пешки (ряд 6)
  board.push(Array(8).fill(null).map(() => ({ type: 'p', color: 'w' } as Piece)));
  
  // Белые фигуры (ряд 7)
  board.push([
    { type: 'r', color: 'w' },
    { type: 'n', color: 'w' },
    { type: 'b', color: 'w' },
    { type: 'q', color: 'w' },
    { type: 'k', color: 'w' },
    { type: 'b', color: 'w' },
    { type: 'n', color: 'w' },
    { type: 'r', color: 'w' }
  ]);
  
  return board;
}

// Создание начального состояния игры
export function createInitialGameState(): GameState {
  return {
    board: createInitialBoard(),
    currentTurn: 'w',
    moveHistory: [],
    capturedPieces: { w: [], b: [] },
    castlingRights: {
      w: { kingside: true, queenside: true },
      b: { kingside: true, queenside: true }
    },
    enPassantTarget: null,
    halfMoveClock: 0,
    fullMoveNumber: 1,
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    isDraw: false,
    gameOver: false,
    winner: null
  };
}

// Получение фигуры на позиции
export function getPieceAt(board: Board, pos: Position): Square {
  if (pos.row < 0 || pos.row > 7 || pos.col < 0 || pos.col > 7) {
    return null;
  }
  return board[pos.row][pos.col];
}

// Проверка, находится ли позиция на доске
function isOnBoard(pos: Position): boolean {
  return pos.row >= 0 && pos.row <= 7 && pos.col >= 0 && pos.col <= 7;
}

// Поиск позиции короля
function findKing(board: Board, color: PieceColor): Position | null {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'k' && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
}

// Проверка, атакована ли клетка
function isSquareAttacked(board: Board, pos: Position, byColor: PieceColor): boolean {
  // Проверка атаки пешками
  const pawnDirection = byColor === 'w' ? 1 : -1;
  const pawnPositions = [
    { row: pos.row + pawnDirection, col: pos.col - 1 },
    { row: pos.row + pawnDirection, col: pos.col + 1 }
  ];
  for (const pPos of pawnPositions) {
    const piece = getPieceAt(board, pPos);
    if (piece && piece.type === 'p' && piece.color === byColor) {
      return true;
    }
  }

  // Проверка атаки конями
  const knightMoves = [
    { row: -2, col: -1 }, { row: -2, col: 1 },
    { row: -1, col: -2 }, { row: -1, col: 2 },
    { row: 1, col: -2 }, { row: 1, col: 2 },
    { row: 2, col: -1 }, { row: 2, col: 1 }
  ];
  for (const move of knightMoves) {
    const nPos = { row: pos.row + move.row, col: pos.col + move.col };
    const piece = getPieceAt(board, nPos);
    if (piece && piece.type === 'n' && piece.color === byColor) {
      return true;
    }
  }

  // Проверка атаки слонами и ферзями (диагонали)
  const diagonals = [
    { row: -1, col: -1 }, { row: -1, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 1 }
  ];
  for (const dir of diagonals) {
    for (let i = 1; i < 8; i++) {
      const bPos = { row: pos.row + dir.row * i, col: pos.col + dir.col * i };
      if (!isOnBoard(bPos)) break;
      const piece = getPieceAt(board, bPos);
      if (piece) {
        if (piece.color === byColor && (piece.type === 'b' || piece.type === 'q')) {
          return true;
        }
        break;
      }
    }
  }

  // Проверка атаки ладьями и ферзями (прямые)
  const straights = [
    { row: -1, col: 0 }, { row: 1, col: 0 },
    { row: 0, col: -1 }, { row: 0, col: 1 }
  ];
  for (const dir of straights) {
    for (let i = 1; i < 8; i++) {
      const rPos = { row: pos.row + dir.row * i, col: pos.col + dir.col * i };
      if (!isOnBoard(rPos)) break;
      const piece = getPieceAt(board, rPos);
      if (piece) {
        if (piece.color === byColor && (piece.type === 'r' || piece.type === 'q')) {
          return true;
        }
        break;
      }
    }
  }

  // Проверка атаки королём
  const kingMoves = [
    { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
    { row: 0, col: -1 }, { row: 0, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
  ];
  for (const move of kingMoves) {
    const kPos = { row: pos.row + move.row, col: pos.col + move.col };
    const piece = getPieceAt(board, kPos);
    if (piece && piece.type === 'k' && piece.color === byColor) {
      return true;
    }
  }

  return false;
}

// Проверка шаха
export function isInCheck(board: Board, color: PieceColor): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  const enemyColor = color === 'w' ? 'b' : 'w';
  return isSquareAttacked(board, kingPos, enemyColor);
}

// Получение возможных ходов фигуры (без учёта шаха)
function getRawMoves(board: Board, pos: Position, castlingRights: GameState['castlingRights'], enPassantTarget: Position | null): Position[] {
  const piece = getPieceAt(board, pos);
  if (!piece) return [];

  const moves: Position[] = [];
  const { row, col } = pos;

  switch (piece.type) {
    case 'p': {
      const direction = piece.color === 'w' ? -1 : 1;
      const startRow = piece.color === 'w' ? 6 : 1;

      // Ход вперёд
      const oneStep = { row: row + direction, col };
      if (isOnBoard(oneStep) && !getPieceAt(board, oneStep)) {
        moves.push(oneStep);

        // Двойной ход с начальной позиции
        if (row === startRow) {
          const twoStep = { row: row + direction * 2, col };
          if (!getPieceAt(board, twoStep)) {
            moves.push(twoStep);
          }
        }
      }

      // Взятие по диагонали
      for (const dc of [-1, 1]) {
        const capturePos = { row: row + direction, col: col + dc };
        if (isOnBoard(capturePos)) {
          const target = getPieceAt(board, capturePos);
          if (target && target.color !== piece.color) {
            moves.push(capturePos);
          }
          // Взятие на проходе
          if (enPassantTarget && capturePos.row === enPassantTarget.row && capturePos.col === enPassantTarget.col) {
            moves.push(capturePos);
          }
        }
      }
      break;
    }

    case 'n': {
      const knightMoves = [
        { row: -2, col: -1 }, { row: -2, col: 1 },
        { row: -1, col: -2 }, { row: -1, col: 2 },
        { row: 1, col: -2 }, { row: 1, col: 2 },
        { row: 2, col: -1 }, { row: 2, col: 1 }
      ];
      for (const move of knightMoves) {
        const newPos = { row: row + move.row, col: col + move.col };
        if (isOnBoard(newPos)) {
          const target = getPieceAt(board, newPos);
          if (!target || target.color !== piece.color) {
            moves.push(newPos);
          }
        }
      }
      break;
    }

    case 'b': {
      const diagonals = [
        { row: -1, col: -1 }, { row: -1, col: 1 },
        { row: 1, col: -1 }, { row: 1, col: 1 }
      ];
      for (const dir of diagonals) {
        for (let i = 1; i < 8; i++) {
          const newPos = { row: row + dir.row * i, col: col + dir.col * i };
          if (!isOnBoard(newPos)) break;
          const target = getPieceAt(board, newPos);
          if (!target) {
            moves.push(newPos);
          } else {
            if (target.color !== piece.color) {
              moves.push(newPos);
            }
            break;
          }
        }
      }
      break;
    }

    case 'r': {
      const straights = [
        { row: -1, col: 0 }, { row: 1, col: 0 },
        { row: 0, col: -1 }, { row: 0, col: 1 }
      ];
      for (const dir of straights) {
        for (let i = 1; i < 8; i++) {
          const newPos = { row: row + dir.row * i, col: col + dir.col * i };
          if (!isOnBoard(newPos)) break;
          const target = getPieceAt(board, newPos);
          if (!target) {
            moves.push(newPos);
          } else {
            if (target.color !== piece.color) {
              moves.push(newPos);
            }
            break;
          }
        }
      }
      break;
    }

    case 'q': {
      // Ферзь = слон + ладья
      const allDirections = [
        { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
        { row: 0, col: -1 }, { row: 0, col: 1 },
        { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
      ];
      for (const dir of allDirections) {
        for (let i = 1; i < 8; i++) {
          const newPos = { row: row + dir.row * i, col: col + dir.col * i };
          if (!isOnBoard(newPos)) break;
          const target = getPieceAt(board, newPos);
          if (!target) {
            moves.push(newPos);
          } else {
            if (target.color !== piece.color) {
              moves.push(newPos);
            }
            break;
          }
        }
      }
      break;
    }

    case 'k': {
      const kingMoves = [
        { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
        { row: 0, col: -1 }, { row: 0, col: 1 },
        { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
      ];
      for (const move of kingMoves) {
        const newPos = { row: row + move.row, col: col + move.col };
        if (isOnBoard(newPos)) {
          const target = getPieceAt(board, newPos);
          if (!target || target.color !== piece.color) {
            moves.push(newPos);
          }
        }
      }

      // Рокировка
      const rights = castlingRights[piece.color];
      const kingRow = piece.color === 'w' ? 7 : 0;
      const enemyColor = piece.color === 'w' ? 'b' : 'w';

      if (row === kingRow && col === 4 && !isInCheck(board, piece.color)) {
        // Короткая рокировка
        if (rights.kingside) {
          const f1 = { row: kingRow, col: 5 };
          const g1 = { row: kingRow, col: 6 };
          if (!getPieceAt(board, f1) && !getPieceAt(board, g1)) {
            if (!isSquareAttacked(board, f1, enemyColor) && !isSquareAttacked(board, g1, enemyColor)) {
              moves.push(g1);
            }
          }
        }

        // Длинная рокировка
        if (rights.queenside) {
          const d1 = { row: kingRow, col: 3 };
          const c1 = { row: kingRow, col: 2 };
          const b1 = { row: kingRow, col: 1 };
          if (!getPieceAt(board, d1) && !getPieceAt(board, c1) && !getPieceAt(board, b1)) {
            if (!isSquareAttacked(board, d1, enemyColor) && !isSquareAttacked(board, c1, enemyColor)) {
              moves.push(c1);
            }
          }
        }
      }
      break;
    }
  }

  return moves;
}

// Копирование доски
function copyBoard(board: Board): Board {
  return board.map(row => row.map(cell => cell ? { ...cell } : null));
}

// Проверка легальности хода (не оставляет ли король под шахом)
function isMoveLegal(board: Board, from: Position, to: Position, color: PieceColor, enPassantTarget: Position | null): boolean {
  const newBoard = copyBoard(board);
  const piece = getPieceAt(newBoard, from);
  
  if (!piece) return false;

  // Обработка взятия на проходе
  if (piece.type === 'p' && enPassantTarget && to.row === enPassantTarget.row && to.col === enPassantTarget.col) {
    const capturedPawnRow = piece.color === 'w' ? to.row + 1 : to.row - 1;
    newBoard[capturedPawnRow][to.col] = null;
  }

  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;

  return !isInCheck(newBoard, color);
}

// Получение легальных ходов
export function getLegalMoves(gameState: GameState, pos: Position): Position[] {
  const piece = getPieceAt(gameState.board, pos);
  if (!piece || piece.color !== gameState.currentTurn) return [];

  const rawMoves = getRawMoves(gameState.board, pos, gameState.castlingRights, gameState.enPassantTarget);
  
  return rawMoves.filter(to => 
    isMoveLegal(gameState.board, pos, to, piece.color, gameState.enPassantTarget)
  );
}

// Проверка, есть ли у игрока легальные ходы
function hasLegalMoves(gameState: GameState, color: PieceColor): boolean {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = gameState.board[row][col];
      if (piece && piece.color === color) {
        const moves = getLegalMoves(
          { ...gameState, currentTurn: color },
          { row, col }
        );
        if (moves.length > 0) return true;
      }
    }
  }
  return false;
}

// Выполнение хода
export function makeMove(gameState: GameState, from: Position, to: Position, promotion?: PieceType): GameState | null {
  const piece = getPieceAt(gameState.board, from);
  if (!piece || piece.color !== gameState.currentTurn) return null;

  const legalMoves = getLegalMoves(gameState, from);
  const isLegal = legalMoves.some(m => m.row === to.row && m.col === to.col);
  if (!isLegal) return null;

  const newBoard = copyBoard(gameState.board);
  const captured = getPieceAt(newBoard, to);
  let enPassantCapture: Piece | null = null;
  
  // Взятие на проходе
  if (piece.type === 'p' && gameState.enPassantTarget && 
      to.row === gameState.enPassantTarget.row && to.col === gameState.enPassantTarget.col) {
    const capturedRow = piece.color === 'w' ? to.row + 1 : to.row - 1;
    enPassantCapture = newBoard[capturedRow][to.col];
    newBoard[capturedRow][to.col] = null;
  }

  // Перемещение фигуры
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;

  // Превращение пешки
  if (piece.type === 'p' && (to.row === 0 || to.row === 7)) {
    newBoard[to.row][to.col] = { type: promotion || 'q', color: piece.color };
  }

  // Рокировка
  let castlingType: 'kingside' | 'queenside' | undefined;
  if (piece.type === 'k') {
    if (from.col === 4 && to.col === 6) {
      // Короткая рокировка
      castlingType = 'kingside';
      newBoard[from.row][5] = newBoard[from.row][7];
      newBoard[from.row][7] = null;
    } else if (from.col === 4 && to.col === 2) {
      // Длинная рокировка
      castlingType = 'queenside';
      newBoard[from.row][3] = newBoard[from.row][0];
      newBoard[from.row][0] = null;
    }
  }

  // Обновление прав на рокировку
  const newCastlingRights = { ...gameState.castlingRights };
  if (piece.type === 'k') {
    newCastlingRights[piece.color] = { kingside: false, queenside: false };
  }
  if (piece.type === 'r') {
    if (from.col === 0) newCastlingRights[piece.color].queenside = false;
    if (from.col === 7) newCastlingRights[piece.color].kingside = false;
  }
  // Если ладья была взята
  if (captured?.type === 'r') {
    const enemyColor = piece.color === 'w' ? 'b' : 'w';
    if (to.col === 0) newCastlingRights[enemyColor].queenside = false;
    if (to.col === 7) newCastlingRights[enemyColor].kingside = false;
  }

  // Новая цель для взятия на проходе
  let newEnPassantTarget: Position | null = null;
  if (piece.type === 'p' && Math.abs(from.row - to.row) === 2) {
    newEnPassantTarget = { row: (from.row + to.row) / 2, col: from.col };
  }

  // Создание записи хода
  const move: Move = {
    from,
    to,
    piece,
    captured: captured || enPassantCapture || undefined,
    promotion: promotion || undefined,
    isCastling: castlingType,
    isEnPassant: !!enPassantCapture
  };

  // Генерация нотации
  move.notation = generateNotation(newBoard, move, gameState.currentTurn);

  // Обновление захваченных фигур
  const newCapturedPieces = { ...gameState.capturedPieces };
  if (captured) {
    newCapturedPieces[captured.color] = [...newCapturedPieces[captured.color], captured];
  }
  if (enPassantCapture) {
    newCapturedPieces[enPassantCapture.color] = [...newCapturedPieces[enPassantCapture.color], enPassantCapture];
  }

  // Определение следующего хода
  const nextTurn: PieceColor = gameState.currentTurn === 'w' ? 'b' : 'w';
  
  // Проверка шаха, мата, пата
  const isCheck = isInCheck(newBoard, nextTurn);
  const hasLegalMovesLeft = hasLegalMoves({ ...gameState, board: newBoard, currentTurn: nextTurn }, nextTurn);
  const isCheckmate = isCheck && !hasLegalMovesLeft;
  const isStalemate = !isCheck && !hasLegalMovesLeft;

  // Проверка правила 50 ходов
  const isFiftyMoves = (piece.type === 'p' || captured || enPassantCapture) 
    ? 0 
    : gameState.halfMoveClock + 1 >= 100;

  // Обновление нотации для шаха и мата
  if (isCheckmate) {
    move.notation += '#';
    move.isCheckmate = true;
  } else if (isCheck) {
    move.notation += '+';
    move.isCheck = true;
  }

  return {
    board: newBoard,
    currentTurn: nextTurn,
    moveHistory: [...gameState.moveHistory, move],
    capturedPieces: newCapturedPieces,
    castlingRights: newCastlingRights,
    enPassantTarget: newEnPassantTarget,
    halfMoveClock: (piece.type === 'p' || captured || enPassantCapture) ? 0 : gameState.halfMoveClock + 1,
    fullMoveNumber: gameState.currentTurn === 'b' ? gameState.fullMoveNumber + 1 : gameState.fullMoveNumber,
    isCheck,
    isCheckmate,
    isStalemate,
    isDraw: isStalemate || isFiftyMoves,
    gameOver: isCheckmate || isStalemate || isFiftyMoves,
    winner: isCheckmate ? gameState.currentTurn : null,
    drawReason: isStalemate ? 'Stalemate' : isFiftyMoves ? 'Fifty-move rule' : undefined
  };
}

// Генерация алгебраической нотации
function generateNotation(board: Board, move: Move, color: PieceColor): string {
  const { from, to, piece, captured, promotion, isCastling, isEnPassant } = move;

  // Рокировка
  if (isCastling) {
    return isCastling === 'kingside' ? 'O-O' : 'O-O-O';
  }

  let notation = '';

  // Тип фигуры (кроме пешки)
  if (piece.type !== 'p') {
    notation += piece.type.toUpperCase();
  }

  // Для неоднозначных ходов
  if (piece.type !== 'p') {
    // Проверяем, есть ли другие фигуры того же типа, которые могут пойти на ту же клетку
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (r === from.row && c === from.col) continue;
        const otherPiece = board[r][c];
        if (otherPiece && otherPiece.type === piece.type && otherPiece.color === color) {
          // Нужно добавить уточнение
          if (from.col !== c) {
            notation += String.fromCharCode(97 + from.col);
          } else if (from.row !== r) {
            notation += (8 - from.row).toString();
          }
          break;
        }
      }
    }
  }

  // Взятие
  if (captured || isEnPassant) {
    if (piece.type === 'p') {
      notation += String.fromCharCode(97 + from.col);
    }
    notation += 'x';
  }

  // Целевая клетка
  notation += positionToAlgebraic(to);

  // Превращение
  if (promotion) {
    notation += '=' + promotion.toUpperCase();
  }

  return notation;
}

// Оценка позиции для ИИ
export function evaluateBoard(board: Board, color: PieceColor): number {
  let score = 0;

  // Позиционные таблицы для оценки позиции фигур
  const pawnTable = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
  ];

  const knightTable = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ];

  const bishopTable = [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ];

  const rookTable = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
  ];

  const queenTable = [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ];

  const kingMiddleTable = [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
  ];

  const positionTables: Record<PieceType, number[][]> = {
    p: pawnTable,
    n: knightTable,
    b: bishopTable,
    r: rookTable,
    q: queenTable,
    k: kingMiddleTable
  };

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const value = PIECE_VALUES[piece.type];
        const posTable = positionTables[piece.type];
        const posValue = piece.color === 'w' ? posTable[row][col] : posTable[7 - row][col];
        
        if (piece.color === color) {
          score += value + posValue;
        } else {
          score -= value + posValue;
        }
      }
    }
  }

  return score;
}

// Получение всех легальных ходов для цвета
export function getAllLegalMoves(gameState: GameState, color: PieceColor): Array<{ from: Position; to: Position }> {
  const moves: Array<{ from: Position; to: Position }> = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = gameState.board[row][col];
      if (piece && piece.color === color) {
        const from = { row, col };
        const legalMoves = getLegalMoves(gameState, from);
        for (const to of legalMoves) {
          moves.push({ from, to });
        }
      }
    }
  }
  
  return moves;
}
