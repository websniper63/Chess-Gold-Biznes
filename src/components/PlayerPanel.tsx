'use client';

import { memo } from 'react';
import { Piece, PieceColor, PIECE_SYMBOLS, PieceSetId } from '@/lib/chess';
import { ChessPiece3D } from './ChessPiece';
import { cn } from '@/lib/utils';
import { Clock, Bot, User } from 'lucide-react';

interface PlayerPanelProps {
  color: PieceColor;
  name: string;
  isAI?: boolean;
  time?: number;
  isActive?: boolean;
  capturedPieces: Piece[];
  isCheck?: boolean;
  isWinner?: boolean;
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

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function PlayerPanelComponent({
  color,
  name,
  isAI = false,
  time,
  isActive = false,
  capturedPieces,
  isCheck = false,
  isWinner = false,
  pieceSetId = 'fantasy'
}: PlayerPanelProps) {
  // Сортируем захваченные фигуры по значению
  const sortedCaptured = [...capturedPieces].sort((a, b) => 
    PIECE_VALUES[b.type] - PIECE_VALUES[a.type]
  );
  
  // Вычисляем материальный перевес
  const capturedValue = capturedPieces.reduce((sum, p) => sum + PIECE_VALUES[p.type], 0);
  
  const isLowTime = time !== undefined && time < 30;
  
  return (
    <div 
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
        isActive 
          ? "bg-slate-700 ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20" 
          : "bg-slate-800/60"
      )}
    >
      {/* Иконка игрока */}
      <div 
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold",
          color === 'w' 
            ? "bg-white text-slate-900" 
            : "bg-slate-900 text-white border-2 border-slate-600"
        )}
      >
        {PIECE_SYMBOLS[color].k}
      </div>
      
      {/* Информация об игроке */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white truncate">{name}</span>
          {isAI && <Bot className="w-4 h-4 text-slate-400" />}
          {isCheck && !isWinner && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
              ШАХ!
            </span>
          )}
          {isWinner && (
            <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">
              ПОБЕДА!
            </span>
          )}
        </div>
        
        {/* Захваченные фигуры */}
        {sortedCaptured.length > 0 && (
          <div className="flex items-center gap-0.5 mt-1">
            {sortedCaptured.map((piece, index) => (
              <div key={index} className="w-5 h-5 flex items-center justify-center">
                <ChessPiece3D piece={piece} size={18} pieceSetId={pieceSetId} />
              </div>
            ))}
            {capturedValue > 0 && (
              <span className="text-xs text-emerald-400 ml-1">+{capturedValue}</span>
            )}
          </div>
        )}
      </div>
      
      {/* Таймер */}
      {time !== undefined && (
        <div 
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xl font-bold",
            isLowTime 
              ? "bg-red-500/20 text-red-400 animate-pulse" 
              : isActive 
                ? "bg-slate-600 text-white" 
                : "bg-slate-700/50 text-slate-300"
          )}
        >
          <Clock className="w-4 h-4 opacity-70" />
          {formatTime(time)}
        </div>
      )}
      
      {/* Индикатор хода */}
      {isActive && time === undefined && (
        <div className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">
          Ваш ход
        </div>
      )}
    </div>
  );
}

export const PlayerPanel = memo(PlayerPanelComponent);
export default PlayerPanel;
