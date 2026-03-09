'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  GameState,
  Position,
  PieceColor,
  GameSettings,
  Player,
  createInitialGameState,
  makeMove,
  getLegalMoves
} from '@/lib/chess';
import {
  SocketPlayerData,
  savePlayerData,
  loadPlayerData,
  clearPlayerData
} from '@/lib/socket/client';

export interface UseChessGameReturn {
  gameState: GameState;
  selectedSquare: Position | null;
  legalMoves: Position[];
  isThinking: boolean;
  gameSettings: GameSettings | null;
  onlinePlayers: Player[];
  isGameStarted: boolean;
  playerColor: PieceColor;
  roomId: string | null;
  isConnecting: boolean;
  opponentDisconnected: boolean;
  drawOffered: boolean;
  drawOfferFrom: Player | null;
  
  // Действия
  selectSquare: (pos: Position) => void;
  startGame: (settings: GameSettings) => Promise<void>;
  resetGame: () => void;
  resign: () => void;
  offerDraw: () => void;
  acceptDraw: () => void;
  declineDraw: () => void;
  
  // Онлайн мультиплеер
  createRoom: (playerName: string, timeControl: number) => void;
  joinRoom: (roomId: string, playerName: string) => void;
  leaveRoom: () => void;
}

export function useChessGame(): UseChessGameReturn {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [legalMoves, setLegalMoves] = useState<Position[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [onlinePlayers, setOnlinePlayers] = useState<Player[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerColor, setPlayerColor] = useState<PieceColor>('w');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [drawOffered, setDrawOffered] = useState(false);
  const [drawOfferFrom, setDrawOfferFrom] = useState<Player | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const playerDataRef = useRef<SocketPlayerData | null>(null);
  const makeAIMoveRef = useRef<((state: GameState) => Promise<void>) | null>(null);

  // Ход ИИ - определяем первым, чтобы использовать в selectSquare
  const makeAIMove = useCallback(async (currentState: GameState) => {
    if (!gameSettings?.aiDifficulty) return;
    
    setIsThinking(true);
    
    try {
      const aiColor = gameSettings.playerColor === 'w' ? 'b' : 'w';
      const response = await fetch('/api/ai-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameState: currentState,
          difficulty: gameSettings.aiDifficulty,
          aiColor
        })
      });
      
      const data = await response.json();
      
      if (data.move) {
        const newGameState = makeMove(currentState, data.move.from, data.move.to);
        if (newGameState) {
          setGameState(newGameState);
        }
      }
    } catch (error) {
      console.error('AI move error:', error);
    }
    
    setIsThinking(false);
  }, [gameSettings]);

  // Сохраняем ссылку на функцию для использования в selectSquare
  useEffect(() => {
    makeAIMoveRef.current = makeAIMove;
  }, [makeAIMove]);

  // Инициализация сокета
  const initSocket = useCallback(() => {
    if (socketRef.current?.connected) return socketRef.current;
    
    const socket = io('/?XTransformPort=3003', {
      transports: ['websocket', 'polling'],
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnecting(false);
      
      // Попытка переподключения к предыдущей игре
      const savedData = loadPlayerData();
      if (savedData) {
        socket.emit('reconnect', {
          roomId: savedData.roomId,
          playerId: savedData.playerId
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnecting(false);
    });

    // Обработка событий игры
    socket.on('room-created', (data: { roomId: string; player: Player }) => {
      setRoomId(data.roomId);
      setPlayerColor(data.player.color);
      setOnlinePlayers([data.player]);
      playerDataRef.current = {
        roomId: data.roomId,
        playerId: data.player.id,
        playerColor: data.player.color
      };
      savePlayerData(playerDataRef.current);
    });

    socket.on('room-joined', (data: { roomId: string; player: Player }) => {
      setRoomId(data.roomId);
      setPlayerColor(data.player.color);
      playerDataRef.current = {
        roomId: data.roomId,
        playerId: data.player.id,
        playerColor: data.player.color
      };
      savePlayerData(playerDataRef.current);
    });

    socket.on('reconnected', (data: { roomId: string; player: Player }) => {
      setRoomId(data.roomId);
      setPlayerColor(data.player.color);
      setIsConnecting(false);
    });

    socket.on('game-started', () => {
      setIsGameStarted(true);
      setGameState(createInitialGameState());
    });

    socket.on('game-state', (data: { 
      gameState: GameState; 
      players: Player[]; 
      isGameStarted: boolean 
    }) => {
      setGameState(data.gameState);
      setOnlinePlayers(data.players);
      setIsGameStarted(data.isGameStarted);
      
      const currentPlayer = data.players.find(p => p.id === playerDataRef.current?.playerId);
      if (currentPlayer) {
        setPlayerColor(currentPlayer.color);
      }
    });

    socket.on('game-over', (data: { winner: PieceColor | null; reason: string }) => {
      setGameState(prev => ({
        ...prev,
        gameOver: true,
        winner: data.winner,
        drawReason: data.reason === 'draw' ? 'Draw by agreement' : undefined
      }));
    });

    socket.on('player-disconnected', () => {
      setOpponentDisconnected(true);
    });

    socket.on('player-reconnected', () => {
      setOpponentDisconnected(false);
    });

    socket.on('draw-offered', (data: { from: Player }) => {
      setDrawOffered(true);
      setDrawOfferFrom(data.from);
    });

    socket.on('draw-declined', () => {
      setDrawOffered(false);
      setDrawOfferFrom(null);
    });

    socket.on('draw-accepted', () => {
      setGameState(prev => ({
        ...prev,
        gameOver: true,
        isDraw: true,
        drawReason: 'Draw by agreement'
      }));
      setDrawOffered(false);
      setDrawOfferFrom(null);
    });

    socket.on('player-resigned', (data: { winner: PieceColor }) => {
      setGameState(prev => ({
        ...prev,
        gameOver: true,
        winner: data.winner
      }));
    });

    socket.on('new-game-started', () => {
      setGameState(createInitialGameState());
      setSelectedSquare(null);
      setLegalMoves([]);
    });

    socket.on('error', (data: { message: string }) => {
      console.error('Socket error:', data.message);
      setIsConnecting(false);
    });

    socketRef.current = socket;
    return socket;
  }, []);

  // Выбор клетки и совершение хода
  const selectSquare = useCallback((pos: Position) => {
    if (gameState.gameOver) return;
    
    // В онлайн режиме проверяем, наш ли ход
    if (gameSettings?.mode === 'online') {
      if (gameState.currentTurn !== playerColor) return;
    }
    
    const piece = gameState.board[pos.row][pos.col];
    
    // Если уже выбрана фигура
    if (selectedSquare) {
      // Проверяем, является ли клик на одну из легальных клеток
      const isLegalMove = legalMoves.some(m => m.row === pos.row && m.col === pos.col);
      
      if (isLegalMove) {
        // Совершаем ход
        if (gameSettings?.mode === 'online' && socketRef.current) {
          socketRef.current.emit('make-move', {
            from: selectedSquare,
            to: pos
          });
        } else {
          const newGameState = makeMove(gameState, selectedSquare, pos);
          if (newGameState) {
            setGameState(newGameState);
            
            // Для игры против ИИ
            if (gameSettings?.mode === 'ai' && !newGameState.gameOver) {
              // ИИ сделает ход после задержки
              setTimeout(() => {
                if (makeAIMoveRef.current) {
                  makeAIMoveRef.current(newGameState);
                }
              }, 500);
            }
          }
        }
        setSelectedSquare(null);
        setLegalMoves([]);
      } else if (piece && piece.color === gameState.currentTurn) {
        // Выбираем новую фигуру
        // В онлайн режиме проверяем цвет
        if (gameSettings?.mode === 'online' && piece.color !== playerColor) {
          setSelectedSquare(null);
          setLegalMoves([]);
          return;
        }
        setSelectedSquare(pos);
        setLegalMoves(getLegalMoves(gameState, pos));
      } else {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    } else {
      // Выбираем фигуру
      if (piece && piece.color === gameState.currentTurn) {
        // В онлайн режиме проверяем цвет
        if (gameSettings?.mode === 'online' && piece.color !== playerColor) {
          return;
        }
        setSelectedSquare(pos);
        setLegalMoves(getLegalMoves(gameState, pos));
      }
    }
  }, [gameState, selectedSquare, legalMoves, gameSettings, playerColor]);

  // Начало игры
  const startGame = useCallback(async (settings: GameSettings) => {
    setGameSettings(settings);
    setGameState(createInitialGameState());
    setSelectedSquare(null);
    setLegalMoves([]);
    setIsGameStarted(true);
    setPlayerColor(settings.playerColor);
    
    // Для онлайн режима инициализируем сокет
    if (settings.mode === 'online') {
      setIsConnecting(true);
      initSocket();
    }
  }, [initSocket]);

  // Сброс игры
  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    setSelectedSquare(null);
    setLegalMoves([]);
    setIsThinking(false);
    setIsGameStarted(false);
    setGameSettings(null);
    setOpponentDisconnected(false);
    setDrawOffered(false);
    setDrawOfferFrom(null);
    
    if (gameSettings?.mode === 'online' && socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      clearPlayerData();
      setRoomId(null);
      setOnlinePlayers([]);
    }
  }, [gameSettings]);

  // Создание комнаты
  const createRoom = useCallback((playerName: string, timeControl: number) => {
    const socket = initSocket();
    setIsConnecting(true);
    socket.emit('create-room', { playerName, timeControl });
  }, [initSocket]);

  // Присоединение к комнате
  const joinRoom = useCallback((roomId: string, playerName: string) => {
    const socket = initSocket();
    setIsConnecting(true);
    socket.emit('join-room', { roomId, playerName });
  }, [initSocket]);

  // Выход из комнаты
  const leaveRoom = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    clearPlayerData();
    setRoomId(null);
    setOnlinePlayers([]);
    setIsGameStarted(false);
    setGameState(createInitialGameState());
  }, []);

  // Сдача
  const resign = useCallback(() => {
    if (gameSettings?.mode === 'online' && socketRef.current) {
      socketRef.current.emit('resign');
    } else {
      setGameState(prev => ({
        ...prev,
        gameOver: true,
        winner: prev.currentTurn === 'w' ? 'b' : 'w'
      }));
    }
  }, [gameSettings]);

  // Предложение ничьей
  const offerDraw = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('offer-draw');
    }
  }, []);

  // Принятие ничьей
  const acceptDraw = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('accept-draw');
      setDrawOffered(false);
      setDrawOfferFrom(null);
    }
  }, []);

  // Отклонение ничьей
  const declineDraw = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('decline-draw');
      setDrawOffered(false);
      setDrawOfferFrom(null);
    }
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    gameState,
    selectedSquare,
    legalMoves,
    isThinking,
    gameSettings,
    onlinePlayers,
    isGameStarted,
    playerColor,
    roomId,
    isConnecting,
    opponentDisconnected,
    drawOffered,
    drawOfferFrom,
    selectSquare,
    startGame,
    resetGame,
    resign,
    offerDraw,
    acceptDraw,
    declineDraw,
    createRoom,
    joinRoom,
    leaveRoom
  };
}
