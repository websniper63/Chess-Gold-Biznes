'use client';

import { memo } from 'react';
import { Piece, PIECE_SYMBOLS, PieceSetId, BoardSkin, BOARD_SKINS } from '@/lib/chess';
import { ChessPiece3D } from './ChessPiece';

interface CapturedPiecesProps {
  capturedPieces: Piece[];
  color: 'w' | 'b';
  boardSkinId?: BoardSkinId;
  pieceSetId?: PieceSetId;
}

// Значения фигур для сортировки
const PIECE_VALUES: Record<string, number> = {
  'q': 9,
  'r': 5,
  'b': 3,
  'n': 3,
  'p': 1
};

function CapturedPiecesComponent({ 
  capturedPieces, 
  color,
  boardSkinId = 'classic',
  pieceSetId = 'fantasy'
}: CapturedPiecesProps) {
  const skin = BOARD_SKINS[boardSkinId];
  
  // Сортируем фигуры по значению
  const sortedPieces = [...capturedPieces].sort((a, b) => {
    return PIECE_VALUES[b.type] - PIECE_VALUES[a.type];
  });
  
  // Группируем одинаковые фигуры
  const groupedPieces: { type: string; count: number; piece: Piece }[] = [];
  sortedPieces.forEach(piece => {
    const existing = groupedPieces.find(g => g.type === piece.type);
    if (existing) {
      existing.count++;
    } else {
      groupedPieces.push({ type: piece.type, count: 1, piece });
    }
  });
  
  // Вычисляем общую ценность
  const totalValue = capturedPieces.reduce((sum, p) => sum + PIECE_VALUES[p.type], 0);
  
  return (
    <div 
      className="flex flex-col gap-2 p-3 rounded-xl"
      style={{
        background: `
          linear-gradient(145deg, 
            ${skin.tableColor}dd 0%, 
            ${skin.tableAccent}ee 50%,
            ${skin.tableColor}cc 100%
          )
        `,
        boxShadow: `
          inset 0 2px 8px rgba(255,255,255,0.1),
          inset 0 -2px 8px rgba(0,0,0,0.2),
          0 8px 24px rgba(0,0,0,0.3)
        `,
        border: `1px solid ${skin.border}40`,
        minWidth: 60,
        maxWidth: 120,
      }}
    >
      {/* Заголовок */}
      <div 
        className="text-center text-sm font-bold tracking-wide"
        style={{ color: color === 'w' ? '#f0e6d2' : '#2d2418' }}
      >
        {color === 'w' ? '♔' : '♚'} {totalValue > 0 ? `+${totalValue}` : ''}
      </div>
      
      {/* Фигуры */}
      <div className="flex flex-wrap gap-1 justify-center">
        {groupedPieces.map((group, index) => (
          <div 
            key={`${group.type}-${index}`}
            className="relative flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
            }}
          >
            <ChessPiece3D 
              piece={group.piece} 
              size={24}
              pieceSetId={pieceSetId}
            />
            {group.count > 1 && (
              <span 
                className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center"
                style={{
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}
              >
                {group.count}
              </span>
            )}
          </div>
        ))}
      </div>
      
      {/* Пустое состояние */}
      {capturedPieces.length === 0 && (
        <div className="text-center text-xs opacity-50 py-2" style={{ color: skin.border }}>
          —
        </div>
      )}
    </div>
  );
}

export const CapturedPieces = memo(CapturedPiecesComponent);
export default CapturedPieces;
