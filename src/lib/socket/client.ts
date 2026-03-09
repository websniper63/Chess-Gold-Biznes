'use client';

import { io, Socket } from 'socket.io-client';
import { 
  GameState, 
  Position, 
  Player,
  Room
} from '../chess';

export interface SocketEvents {
  // Отправляемые события
  'create-room': (data: { playerName: string; timeControl: number }) => void;
  'join-room': (data: { roomId: string; playerName: string }) => void;
  'reconnect': (data: { roomId: string; playerId: string }) => void;
  'make-move': (data: { from: Position; to: Position; promotion?: string }) => void;
  'offer-draw': () => void;
  'accept-draw': () => void;
  'decline-draw': () => void;
  'resign': () => void;
  'new-game': () => void;
}

export interface SocketResponses {
  // Получаемые события
  'room-created': { roomId: string; player: Player };
  'room-joined': { roomId: string; player: Player };
  'reconnected': { roomId: string; player: Player };
  'game-state': { 
    gameState: GameState; 
    players: Player[]; 
    isGameStarted: boolean 
  };
  'game-started': { roomId: string };
  'game-over': { 
    winner: 'w' | 'b' | null; 
    reason: string 
  };
  'timeout': { loser: 'w' | 'b'; winner: 'w' | 'b' };
  'draw-offered': { from: Player };
  'draw-declined': void;
  'draw-accepted': void;
  'player-resigned': { loser: Player; winner: 'w' | 'b' };
  'player-disconnected': { player: Player };
  'player-reconnected': { player: Player };
  'new-game-started': void;
  'error': { message: string };
}

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    // Подключаемся к WebSocket серверу
    socket = io('/?XTransformPort=3003', {
      transports: ['websocket', 'polling'],
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Типобезопасные функции для отправки событий
export const socketEmit = {
  createRoom: (socket: Socket, data: { playerName: string; timeControl: number }) => {
    socket.emit('create-room', data);
  },
  
  joinRoom: (socket: Socket, data: { roomId: string; playerName: string }) => {
    socket.emit('join-room', data);
  },
  
  reconnect: (socket: Socket, data: { roomId: string; playerId: string }) => {
    socket.emit('reconnect', data);
  },
  
  makeMove: (socket: Socket, data: { from: Position; to: Position; promotion?: string }) => {
    socket.emit('make-move', data);
  },
  
  offerDraw: (socket: Socket) => {
    socket.emit('offer-draw');
  },
  
  acceptDraw: (socket: Socket) => {
    socket.emit('accept-draw');
  },
  
  declineDraw: (socket: Socket) => {
    socket.emit('decline-draw');
  },
  
  resign: (socket: Socket) => {
    socket.emit('resign');
  },
  
  newGame: (socket: Socket) => {
    socket.emit('new-game');
  }
};

// Хук для работы с сокетом (для сохранения данных игрока)
export interface SocketPlayerData {
  roomId: string;
  playerId: string;
  playerColor: 'w' | 'b';
}

const PLAYER_DATA_KEY = 'chess_player_data';

export function savePlayerData(data: SocketPlayerData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PLAYER_DATA_KEY, JSON.stringify(data));
  }
}

export function loadPlayerData(): SocketPlayerData | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(PLAYER_DATA_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function clearPlayerData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PLAYER_DATA_KEY);
  }
}
