'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { PieceColor, PIECE_SYMBOLS } from '@/lib/chess';
import { cn } from '@/lib/utils';

interface GameTimerProps {
  whiteTime: number;
  blackTime: number;
  currentTurn: PieceColor;
  isActive: boolean;
  playerName?: string;
  isCurrentPlayer?: boolean;
  isOnline?: boolean;
  isConnected?: boolean;
}

function formatTime(seconds: number): string {
  if (seconds <= 0) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function GameTimer({
  whiteTime,
  blackTime,
  currentTurn,
  isActive,
  playerName,
  isCurrentPlayer,
  isOnline,
  isConnected
}: GameTimerProps) {
  const isWhite = currentTurn === 'w';
  const isLowTime = (isWhite ? whiteTime : blackTime) < 30;
  const isCriticalTime = (isWhite ? whiteTime : blackTime) < 10;
  
  return (
    <Card 
      className={cn(
        'p-3 transition-all duration-300',
        isCurrentPlayer && 'ring-2 ring-primary',
        isLowTime && !isCriticalTime && 'bg-yellow-50',
        isCriticalTime && 'bg-red-50 animate-pulse'
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Информация об игроке */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">
            {currentTurn === 'w' ? '♔' : '♚'}
          </span>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">
              {playerName || (currentTurn === 'w' ? 'White' : 'Black')}
            </span>
            {isOnline && (
              <span className={cn(
                'text-xs',
                isConnected ? 'text-green-600' : 'text-red-600'
              )}>
                {isConnected ? '● Connected' : '○ Disconnected'}
              </span>
            )}
          </div>
        </div>
        
        {/* Таймер */}
        <div 
          className={cn(
            'font-mono text-2xl font-bold tabular-nums',
            isLowTime && !isCriticalTime && 'text-yellow-600',
            isCriticalTime && 'text-red-600'
          )}
        >
          {formatTime(currentTurn === 'w' ? whiteTime : blackTime)}
        </div>
      </div>
    </Card>
  );
}

// Компонент для отображения обоих таймеров
interface DualTimerProps {
  whiteTime: number;
  blackTime: number;
  currentTurn: PieceColor;
  isActive: boolean;
  playerColor?: PieceColor;
  whitePlayerName?: string;
  blackPlayerName?: string;
  isOnline?: boolean;
  whiteConnected?: boolean;
  blackConnected?: boolean;
}

export function DualTimer({
  whiteTime,
  blackTime,
  currentTurn,
  isActive,
  playerColor,
  whitePlayerName,
  blackPlayerName,
  isOnline,
  whiteConnected,
  blackConnected
}: DualTimerProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Чёрные (сверху) */}
      <GameTimer
        whiteTime={whiteTime}
        blackTime={blackTime}
        currentTurn="b"
        isActive={isActive && currentTurn === 'b'}
        playerName={blackPlayerName}
        isCurrentPlayer={currentTurn === 'b'}
        isOnline={isOnline}
        isConnected={blackConnected}
      />
      
      {/* Белые (снизу) */}
      <GameTimer
        whiteTime={whiteTime}
        blackTime={blackTime}
        currentTurn="w"
        isActive={isActive && currentTurn === 'w'}
        playerName={whitePlayerName}
        isCurrentPlayer={currentTurn === 'w'}
        isOnline={isOnline}
        isConnected={whiteConnected}
      />
    </div>
  );
}

// Хук для управления таймером
export function useGameTimer(
  initialTime: number,
  isActive: boolean,
  onTimeout?: () => void
) {
  const [time, setTime] = useState(initialTime);
  
  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);
  
  useEffect(() => {
    if (!isActive || time <= 0) return;
    
    const interval = setInterval(() => {
      setTime(prev => {
        if (prev <= 1) {
          onTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isActive, time, onTimeout]);
  
  return { time, setTime };
}

export default GameTimer;
