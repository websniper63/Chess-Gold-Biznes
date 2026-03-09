'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, createInitialGameState, makeMove as engineMakeMove, Position, PieceType } from '@/lib/chess';

interface OnlinePlayer {
  id: string;
  color: 'w' | 'b';
  name: string;
  timeRemaining: number;
  isConnected: boolean;
}

interface OnlineRoom {
  id: string;
  players: OnlinePlayer[];
  gameState: GameState;
  isGameStarted: boolean;
  timeControl: number;
  playerTimes: { w: number; b: number };
}

interface UseOnlineGameResult {
  // Состояние
  room: OnlineRoom | null;
  playerId: string | null;
  playerColor: 'w' | 'b' | null;
  isConnected: boolean;
  isWaiting: boolean;
  error: string | null;
  
  // Действия
  createRoom: (playerName: string, timeControl: number) => Promise<void>;
  joinRoom: (roomId: string, playerName: string) => Promise<void>;
  makeMove: (from: Position, to: Position, promotion?: PieceType) => void;
  newGame: () => void;
  refresh: () => Promise<void>;
  
  // Утилиты
  getShareLink: () => string | null;
}

export function useOnlineGame(): UseOnlineGameResult {
  const [room, setRoom] = useState<OnlineRoom | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerColor, setPlayerColor] = useState<'w' | 'b' | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Остановка polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);
  
  // Запуск polling для синхронизации
  const startPolling = useCallback((roomId: string) => {
    stopPolling();
    
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/chess-room?action=getState&roomId=${roomId}`);
        const data = await response.json();
        
        if (data.success && data.room) {
          setRoom(data.room);
          setIsConnected(true);
          
          // Если игра началась - больше не ждём
          if (data.room.isGameStarted) {
            setIsWaiting(false);
          }
        } else if (data.error) {
          setError(data.error);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 500); // Каждые 500мс
    
    // Сразу делаем первый запрос
    fetch(`/api/chess-room?action=getState&roomId=${roomId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.room) {
          setRoom(data.room);
          setIsConnected(true);
          if (data.room.isGameStarted) {
            setIsWaiting(false);
          }
        }
      });
  }, [stopPolling]);
  
  // Создание комнаты
  const createRoom = useCallback(async (playerName: string, timeControl: number) => {
    setError(null);
    setIsWaiting(true);
    
    try {
      const response = await fetch('/api/chess-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createRoom',
          playerName,
          timeControl
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRoom(data.room);
        setPlayerId(data.playerId);
        setPlayerColor(data.playerColor);
        setIsConnected(true);
        startPolling(data.roomId);
      } else {
        setError(data.error || 'Ошибка создания комнаты');
        setIsWaiting(false);
      }
    } catch (err) {
      console.error('Create room error:', err);
      setError('Ошибка соединения');
      setIsWaiting(false);
    }
  }, [startPolling]);
  
  // Присоединение к комнате
  const joinRoom = useCallback(async (roomId: string, playerName: string) => {
    setError(null);
    
    try {
      const response = await fetch('/api/chess-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'joinRoom',
          roomId,
          playerName
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRoom(data.room);
        setPlayerId(data.playerId);
        setPlayerColor(data.playerColor);
        setIsConnected(true);
        setIsWaiting(false);
        startPolling(data.roomId);
      } else {
        setError(data.error || 'Ошибка присоединения');
      }
    } catch (err) {
      console.error('Join room error:', err);
      setError('Ошибка соединения');
    }
  }, [startPolling]);
  
  // Совершение хода
  const makeMove = useCallback((from: Position, to: Position, promotion?: PieceType) => {
    if (!room || !playerId || !playerColor) return;
    
    // Проверка хода
    if (room.gameState.currentTurn !== playerColor) return;
    
    // Выполняем ход локально
    const newGameState = engineMakeMove(room.gameState, from, to, promotion);
    if (!newGameState) return;
    
    // Отправляем на сервер
    fetch('/api/chess-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'updateState',
        roomId: room.id,
        playerId,
        gameState: newGameState
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setRoom(data.room);
      }
    });
  }, [room, playerId, playerColor]);
  
  // Новая игра
  const newGame = useCallback(() => {
    if (!room || !playerId) return;
    
    fetch('/api/chess-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'newGame',
        roomId: room.id,
        playerId
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setRoom(data.room);
      }
    });
  }, [room, playerId]);
  
  // Обновление состояния
  const refresh = useCallback(async () => {
    if (!room) return;
    
    try {
      const response = await fetch(`/api/chess-room?action=getState&roomId=${room.id}`);
      const data = await response.json();
      
      if (data.success) {
        setRoom(data.room);
      }
    } catch (err) {
      console.error('Refresh error:', err);
    }
  }, [room]);
  
  // Получение ссылки для друга
  const getShareLink = useCallback(() => {
    if (!room) return null;
    
    if (typeof window !== 'undefined') {
      return `${window.location.origin}?join=${room.id}`;
    }
    return null;
  }, [room]);
  
  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);
  
  return {
    room,
    playerId,
    playerColor,
    isConnected,
    isWaiting,
    error,
    createRoom,
    joinRoom,
    makeMove,
    newGame,
    refresh,
    getShareLink
  };
}

export default useOnlineGame;
