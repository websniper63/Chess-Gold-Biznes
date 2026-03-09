'use client';

import { memo, useRef, useEffect } from 'react';
import { Move, PieceColor } from '@/lib/chess';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { History } from 'lucide-react';

interface MoveHistoryProps {
  moves: Move[];
  currentTurn: PieceColor;
  fullMoveNumber: number;
}

function MoveHistoryComponent({ moves, currentTurn, fullMoveNumber }: MoveHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Автоматическая прокрутка к последнему ходу
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves]);
  
  // Группируем ходы по парам (белые + чёрные)
  const movePairs: Array<{ moveNumber: number; white?: Move; black?: Move }> = [];
  
  moves.forEach((move, index) => {
    if (index % 2 === 0) {
      movePairs.push({ moveNumber: Math.floor(index / 2) + 1, white: move });
    } else {
      movePairs[movePairs.length - 1].black = move;
    }
  });
  
  return (
    <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Заголовок */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50 bg-slate-800/80">
        <History className="w-4 h-4 text-slate-400" />
        <span className="font-semibold text-white">История ходов</span>
        <span className="ml-auto text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full">
          Ход {fullMoveNumber}
        </span>
      </div>
      
      {/* Список ходов */}
      <ScrollArea className="h-[200px]" ref={scrollRef}>
        <div className="p-2">
          {movePairs.length === 0 ? (
            <div className="text-center text-slate-500 text-sm py-8">
              Ходов пока нет
            </div>
          ) : (
            <div className="space-y-1">
              {movePairs.map((pair, index) => (
                <div 
                  key={pair.moveNumber}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 rounded-lg transition-colors",
                    index === movePairs.length - 1 && "bg-slate-700/50"
                  )}
                >
                  {/* Номер хода */}
                  <span className="w-8 text-xs text-slate-500 font-mono">
                    {pair.moveNumber}.
                  </span>
                  
                  {/* Ход белых */}
                  <span 
                    className={cn(
                      "flex-1 px-2 py-0.5 rounded text-sm font-mono",
                      pair.white && index === movePairs.length - 1 && currentTurn === 'b'
                        ? "bg-slate-600 text-white"
                        : "text-slate-300"
                    )}
                  >
                    {pair.white?.notation || ''}
                    {pair.white?.isCheck && !pair.white?.isCheckmate && (
                      <span className="text-yellow-400">+</span>
                    )}
                    {pair.white?.isCheckmate && (
                      <span className="text-red-400">#</span>
                    )}
                  </span>
                  
                  {/* Ход чёрных */}
                  <span 
                    className={cn(
                      "flex-1 px-2 py-0.5 rounded text-sm font-mono",
                      pair.black && index === movePairs.length - 1 && currentTurn === 'w'
                        ? "bg-slate-600 text-white"
                        : "text-slate-300"
                    )}
                  >
                    {pair.black?.notation || ''}
                    {pair.black?.isCheck && !pair.black?.isCheckmate && (
                      <span className="text-yellow-400">+</span>
                    )}
                    {pair.black?.isCheckmate && (
                      <span className="text-red-400">#</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export const MoveHistory = memo(MoveHistoryComponent);
export default MoveHistory;
