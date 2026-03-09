// Шахматные типы

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export type Square = Piece | null;
export type Board = Square[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  promotion?: PieceType;
  isCastling?: 'kingside' | 'queenside';
  isEnPassant?: boolean;
  isCheck?: boolean;
  isCheckmate?: boolean;
  notation?: string;
}

export interface GameState {
  board: Board;
  currentTurn: PieceColor;
  moveHistory: Move[];
  capturedPieces: { w: Piece[]; b: Piece[] };
  castlingRights: {
    w: { kingside: boolean; queenside: boolean };
    b: { kingside: boolean; queenside: boolean };
  };
  enPassantTarget: Position | null;
  halfMoveClock: number;
  fullMoveNumber: number;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  gameOver: boolean;
  winner: PieceColor | null;
  drawReason?: string;
}

export interface Player {
  id: string;
  color: PieceColor;
  name: string;
  timeRemaining: number;
  isConnected?: boolean;
}

export interface Room {
  id: string;
  players: Player[];
  gameState: GameState;
  timeControl: number;
  isGameStarted: boolean;
  createdAt: Date;
}

export type GameMode = 'ai' | 'local' | 'online';
export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface GameSettings {
  mode: GameMode;
  aiDifficulty?: AIDifficulty;
  timeControl: number; // в секундах, 0 = без лимита
  playerColor: PieceColor;
}

// Unicode символы фигур
export const PIECE_SYMBOLS: Record<PieceColor, Record<PieceType, string>> = {
  w: {
    k: '♔',
    q: '♕',
    r: '♖',
    b: '♗',
    n: '♘',
    p: '♙'
  },
  b: {
    k: '♚',
    q: '♛',
    r: '♜',
    b: '♝',
    n: '♞',
    p: '♟'
  }
};

// Названия фигур на русском
export const PIECE_NAMES: Record<PieceType, string> = {
  k: 'Король',
  q: 'Ферзь',
  r: 'Ладья',
  b: 'Слон',
  n: 'Конь',
  p: 'Пешка'
};

// ========== НАБОРЫ ФИГУР ==========

export type PieceSetId = 'fantasy' | 'geometric' | 'egyptian' | 'crystal' | 'lewis' | 'minimal' | 'samurai';

export interface PieceSet {
  id: PieceSetId;
  name: string;
  description: string;
  isPremium?: boolean;
}

export const PIECE_SETS: Record<PieceSetId, PieceSet> = {
  fantasy: {
    id: 'fantasy',
    name: 'Фэнтези',
    description: 'Эпические фигуры в стиле фэнтези с драконами и коронами',
  },
  geometric: {
    id: 'geometric',
    name: 'Геометрия',
    description: 'Современный минималистичный стиль с геометрическими формами',
  },
  egyptian: {
    id: 'egyptian',
    name: 'Египет',
    description: 'Древнеегипетский стиль с фараонами и пирамидами',
  },
  crystal: {
    id: 'crystal',
    name: 'Кристалл',
    description: 'Роскошные кристаллические фигуры с драгоценными камнями',
    isPremium: true,
  },
  lewis: {
    id: 'lewis',
    name: 'Викинги',
    description: 'Исторический стиль острова Льюис - скандинавские воины',
  },
  minimal: {
    id: 'minimal',
    name: 'Минимал',
    description: 'Ультра-современный стиль для ценителей чистоты форм',
  },
  samurai: {
    id: 'samurai',
    name: 'Самураи',
    description: 'Японские воины в детальных доспехах с катанами',
    isPremium: true,
  },
};

// ========== СКИНЫ ДОСКИ ==========

export type BoardSkinId = 'classic' | 'wood' | 'marble' | 'neon' | 'dark' | 'ocean' | 'glass' | 'leather' | 'emerald';

export interface BoardSkin {
  id: BoardSkinId;
  name: string;
  lightSquare: string;
  darkSquare: string;
  selectedLight: string;
  selectedDark: string;
  legalMoveLight: string;
  legalMoveDark: string;
  lastMoveLight: string;
  lastMoveDark: string;
  checkLight: string;
  checkDark: string;
  border: string;
  tableColor: string;
  tableAccent: string;
  preview?: string;
}

export const BOARD_SKINS: Record<BoardSkinId, BoardSkin> = {
  classic: {
    id: 'classic',
    name: 'Классика',
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
    selectedLight: '#f7ec5e',
    selectedDark: '#daca34',
    legalMoveLight: '#f0d9b5',
    legalMoveDark: '#b58863',
    lastMoveLight: '#cdd26a',
    lastMoveDark: '#aaa23a',
    checkLight: '#ff6b6b',
    checkDark: '#ff4757',
    border: '#8b4513',
    tableColor: '#5d4037',
    tableAccent: '#3e2723'
  },
  wood: {
    id: 'wood',
    name: 'Дерево',
    lightSquare: '#deb887',
    darkSquare: '#8b4513',
    selectedLight: '#ffd700',
    selectedDark: '#daa520',
    legalMoveLight: '#deb887',
    legalMoveDark: '#8b4513',
    lastMoveLight: '#f4a460',
    lastMoveDark: '#a0522d',
    checkLight: '#ff6347',
    checkDark: '#dc143c',
    border: '#5d3a1a',
    tableColor: '#4a3728',
    tableAccent: '#2d1f16'
  },
  marble: {
    id: 'marble',
    name: 'Мрамор',
    lightSquare: '#e8e8e8',
    darkSquare: '#769656',
    selectedLight: '#baca44',
    selectedDark: '#8db24c',
    legalMoveLight: '#e8e8e8',
    legalMoveDark: '#769656',
    lastMoveLight: '#cdd26a',
    lastMoveDark: '#6b8e4e',
    checkLight: '#ff7f7f',
    checkDark: '#ff4444',
    border: '#4a4a4a',
    tableColor: '#2c2c2c',
    tableAccent: '#1a1a1a'
  },
  neon: {
    id: 'neon',
    name: 'Неон',
    lightSquare: '#1a1a2e',
    darkSquare: '#16213e',
    selectedLight: '#0f3460',
    selectedDark: '#e94560',
    legalMoveLight: '#1a1a2e',
    legalMoveDark: '#16213e',
    lastMoveLight: '#533483',
    lastMoveDark: '#e94560',
    checkLight: '#ff0080',
    checkDark: '#ff0055',
    border: '#e94560',
    tableColor: '#0a0a15',
    tableAccent: '#050508'
  },
  dark: {
    id: 'dark',
    name: 'Тёмная',
    lightSquare: '#3d3d3d',
    darkSquare: '#1a1a1a',
    selectedLight: '#4a4a4a',
    selectedDark: '#5a3d3d',
    legalMoveLight: '#3d3d3d',
    legalMoveDark: '#1a1a1a',
    lastMoveLight: '#4d4d2a',
    lastMoveDark: '#3d3d1a',
    checkLight: '#8b0000',
    checkDark: '#660000',
    border: '#0d0d0d',
    tableColor: '#0a0a0a',
    tableAccent: '#000000'
  },
  ocean: {
    id: 'ocean',
    name: 'Океан',
    lightSquare: '#e0f7fa',
    darkSquare: '#006064',
    selectedLight: '#4dd0e1',
    selectedDark: '#00acc1',
    legalMoveLight: '#e0f7fa',
    legalMoveDark: '#006064',
    lastMoveLight: '#80deea',
    lastMoveDark: '#00838f',
    checkLight: '#ff8a80',
    checkDark: '#ff5252',
    border: '#004d40',
    tableColor: '#1a237e',
    tableAccent: '#0d1342'
  },
  glass: {
    id: 'glass',
    name: 'Стекло',
    lightSquare: 'rgba(255,255,255,0.85)',
    darkSquare: 'rgba(100,150,200,0.75)',
    selectedLight: 'rgba(255,255,150,0.9)',
    selectedDark: 'rgba(200,220,100,0.8)',
    legalMoveLight: 'rgba(255,255,255,0.85)',
    legalMoveDark: 'rgba(100,150,200,0.75)',
    lastMoveLight: 'rgba(200,255,200,0.8)',
    lastMoveDark: 'rgba(150,200,150,0.7)',
    checkLight: 'rgba(255,100,100,0.9)',
    checkDark: 'rgba(200,50,50,0.8)',
    border: '#c0c0c0',
    tableColor: '#1e3a5f',
    tableAccent: '#0d1f33'
  },
  leather: {
    id: 'leather',
    name: 'Кожа',
    lightSquare: '#d4a574',
    darkSquare: '#8b5a2b',
    selectedLight: '#e8c078',
    selectedDark: '#c49a4b',
    legalMoveLight: '#d4a574',
    legalMoveDark: '#8b5a2b',
    lastMoveLight: '#c9b896',
    lastMoveDark: '#a08050',
    checkLight: '#e07070',
    checkDark: '#c04040',
    border: '#5c3317',
    tableColor: '#3d2817',
    tableAccent: '#2a1a0f'
  },
  emerald: {
    id: 'emerald',
    name: 'Изумруд',
    lightSquare: '#98fb98',
    darkSquare: '#2e8b57',
    selectedLight: '#7cfc00',
    selectedDark: '#3cb371',
    legalMoveLight: '#98fb98',
    legalMoveDark: '#2e8b57',
    lastMoveLight: '#90ee90',
    lastMoveDark: '#228b22',
    checkLight: '#ff6b6b',
    checkDark: '#ff4444',
    border: '#1a5a3a',
    tableColor: '#1a3a2a',
    tableAccent: '#0f2518'
  }
};

// Значения фигур для оценки позиции
export const PIECE_VALUES: Record<PieceType, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Конвертация позиции в алгебраическую нотацию
export function positionToAlgebraic(pos: Position): string {
  const files = 'abcdefgh';
  return `${files[pos.col]}${8 - pos.row}`;
}

// Конвертация алгебраической нотации в позицию
export function algebraicToPosition(notation: string): Position | null {
  if (notation.length !== 2) return null;
  const files = 'abcdefgh';
  const col = files.indexOf(notation[0].toLowerCase());
  const row = 8 - parseInt(notation[1]);
  if (col < 0 || col > 7 || row < 0 || row > 7) return null;
  return { row, col };
}
