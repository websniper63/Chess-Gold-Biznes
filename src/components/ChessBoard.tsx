'use client';

import { memo, useState, useEffect } from 'react';
import { 
  Board, 
  Position, 
  Piece,
  Move,
  BoardSkin,
  BoardSkinId,
  PieceSetId,
  BOARD_SKINS
} from '@/lib/chess';
import { ChessPiece3D } from './ChessPiece';
import { cn } from '@/lib/utils';

interface ChessBoardProps {
  board: Board;
  currentTurn: 'w' | 'b';
  selectedSquare: Position | null;
  legalMoves: Position[];
  lastMove?: Move | null;
  playerColor?: 'w' | 'b';
  isCheck?: boolean;
  onSquareClick: (pos: Position) => void;
  isFlipped?: boolean;
  skinId?: BoardSkinId;
  pieceSetId?: PieceSetId;
}

function BoardSquare({ 
  piece, 
  position, 
  isSelected, 
  isLegalMove,
  isLastMove,
  isCheckSquare,
  onClick,
  squareSize,
  skin,
  pieceSetId,
}: { 
  piece: Piece | null;
  position: Position;
  isSelected: boolean;
  isLegalMove: boolean;
  isLastMove: boolean;
  isCheckSquare: boolean;
  onClick: () => void;
  squareSize: number;
  skin: BoardSkin;
  pieceSetId: PieceSetId;
}) {
  const isLight = (position.row + position.col) % 2 === 0;
  
  // Определяем цвет клетки
  let bgColor: string;
  if (isCheckSquare) {
    bgColor = isLight ? '#ef4444' : '#dc2626';
  } else if (isSelected) {
    bgColor = isLight ? '#10b981' : '#059669';
  } else if (isLastMove) {
    bgColor = isLight ? '#fcd34d' : '#f59e0b';
  } else {
    bgColor = isLight ? skin.lightSquare : skin.darkSquare;
  }

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center transition-all duration-100 hover:brightness-110 active:scale-[0.98]"
      style={{ 
        width: squareSize, 
        height: squareSize,
        background: bgColor,
      }}
    >
      {/* Индикатор возможного хода */}
      {isLegalMove && !piece && (
        <div 
          className="absolute rounded-full bg-slate-900/30"
          style={{ 
            width: squareSize * 0.3, 
            height: squareSize * 0.3,
          }}
        />
      )}
      
      {/* Индикатор взятия */}
      {isLegalMove && piece && (
        <div 
          className="absolute inset-1 rounded-full border-4 border-red-500/60"
        />
      )}

      {/* Фигура */}
      {piece && (
        <div 
          className="relative z-10 transition-transform duration-100"
          style={{
            transform: isSelected ? 'scale(1.08)' : 'scale(1)',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
        >
          <ChessPiece3D piece={piece} size={squareSize * 0.85} pieceSetId={pieceSetId} />
        </div>
      )}
      
      {/* Шах - пульсация */}
      {isCheckSquare && (
        <div 
          className="absolute inset-0 animate-pulse bg-red-500/40"
        />
      )}
    </button>
  );
}

function ChessBoardComponent({
  board,
  currentTurn,
  selectedSquare,
  legalMoves,
  lastMove,
  playerColor = 'w',
  isCheck = false,
  onSquareClick,
  isFlipped = false,
  skinId = 'classic',
  pieceSetId = 'fantasy'
}: ChessBoardProps) {
  const [squareSize, setSquareSize] = useState(60);
  const skin = BOARD_SKINS[skinId];
  
  // Адаптивный размер доски
  useEffect(() => {
    const calculateSize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Для мобильных - доска во весь экран
      const maxWidth = Math.min(windowWidth - 32, 520);
      const maxHeight = windowHeight - 280;
      
      const maxSquareByWidth = Math.floor(maxWidth / 8);
      const maxSquareByHeight = Math.floor(maxHeight / 8);
      
      let size = Math.min(maxSquareByWidth, maxSquareByHeight);
      size = Math.max(45, Math.min(65, size));
      
      setSquareSize(size);
    };
    
    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, []);
  
  // Определяем, нужно ли перевернуть доску
  const flipBoard = isFlipped || playerColor === 'b';
  
  // Генерация строк и колонок
  const rows = flipBoard ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
  const cols = flipBoard ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  
  // Найдем позицию короля для подсветки шаха
  let checkKingPos: Position | null = null;
  if (isCheck) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === currentTurn) {
          checkKingPos = { row: r, col: c };
          break;
        }
      }
      if (checkKingPos) break;
    }
  }
  
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  const displayFiles = flipBoard ? [...files].reverse() : files;
  const displayRanks = flipBoard ? [...ranks].reverse() : ranks;

  const boardWidth = squareSize * 8;

  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Координаты колонок (сверху) */}
      <div 
        className="flex mb-1"
        style={{ width: boardWidth }}
      >
        {displayFiles.map((file) => (
          <span 
            key={file} 
            className="flex items-center justify-center text-xs font-medium text-slate-400"
            style={{ width: squareSize, height: 18 }}
          >
            {file}
          </span>
        ))}
      </div>
      
      <div className="flex items-center">
        {/* Координаты рядов (слева) */}
        <div 
          className="flex flex-col mr-1"
          style={{ height: boardWidth }}
        >
          {displayRanks.map((rank) => (
            <span 
              key={rank} 
              className="flex items-center justify-center text-xs font-medium text-slate-400"
              style={{ height: squareSize, width: 18 }}
            >
              {rank}
            </span>
          ))}
        </div>
        
        {/* Доска */}
        <div 
          className="relative rounded-lg overflow-hidden shadow-2xl"
          style={{
            width: boardWidth,
            height: boardWidth,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 4px rgba(255,255,255,0.1)',
          }}
        >
          {/* Сетка доски */}
          <div 
            className="grid grid-cols-8"
            style={{ width: boardWidth, height: boardWidth }}
          >
            {rows.map(row => 
              cols.map(col => {
                const piece = board[row][col];
                const position: Position = { row, col };
                const isSelected = selectedSquare?.row === row && selectedSquare?.col === col;
                const isLegalMove = legalMoves.some(m => m.row === row && m.col === col);
                const isLastMove = lastMove && (
                  (lastMove.from.row === row && lastMove.from.col === col) ||
                  (lastMove.to.row === row && lastMove.to.col === col)
                );
                const isCheckSquare = checkKingPos?.row === row && checkKingPos?.col === col;
                
                return (
                  <BoardSquare
                    key={`${row}-${col}`}
                    piece={piece}
                    position={position}
                    isSelected={isSelected}
                    isLegalMove={isLegalMove}
                    isLastMove={isLastMove}
                    isCheckSquare={isCheckSquare}
                    onClick={() => onSquareClick(position)}
                    squareSize={squareSize}
                    skin={skin}
                    pieceSetId={pieceSetId}
                  />
                );
              })
            )}
          </div>
        </div>
        
        {/* Координаты рядов (справа) */}
        <div 
          className="flex flex-col ml-1"
          style={{ height: boardWidth }}
        >
          {displayRanks.map((rank) => (
            <span 
              key={rank} 
              className="flex items-center justify-center text-xs font-medium text-slate-400"
              style={{ height: squareSize, width: 18 }}
            >
              {rank}
            </span>
          ))}
        </div>
      </div>
      
      {/* Координаты колонок (снизу) */}
      <div 
        className="flex mt-1"
        style={{ width: boardWidth }}
      >
        {displayFiles.map((file) => (
          <span 
            key={file} 
            className="flex items-center justify-center text-xs font-medium text-slate-400"
            style={{ width: squareSize, height: 18 }}
          >
            {file}
          </span>
        ))}
      </div>
    </div>
  );
}

export const ChessBoard = memo(ChessBoardComponent);
export default ChessBoard;
