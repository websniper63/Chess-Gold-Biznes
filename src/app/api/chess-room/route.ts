import { NextRequest, NextResponse } from 'next/server';

// Глобальное хранилище комнат (в памяти)
// На Vercel это работает пока функция "тёплая"
declare global {
  var chessRooms: Map<string, any> | undefined;
}

if (!global.chessRooms) {
  global.chessRooms = new Map();
}

const rooms = global.chessRooms;

// Генерация кода комнаты
function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Генерация ID игрока
function generatePlayerId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Создание начального состояния
function createInitialGameState() {
  const board = [];
  const backRow = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
  
  for (let row = 0; row < 8; row++) {
    board[row] = [];
    for (let col = 0; col < 8; col++) {
      if (row === 0) {
        board[row][col] = { type: backRow[col], color: 'b' };
      } else if (row === 1) {
        board[row][col] = { type: 'p', color: 'b' };
      } else if (row === 6) {
        board[row][col] = { type: 'p', color: 'w' };
      } else if (row === 7) {
        board[row][col] = { type: backRow[col], color: 'w' };
      } else {
        board[row][col] = null;
      }
    }
  }
  
  return {
    board,
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

// Очистка старых комнат (старше 2 часов)
function cleanupOldRooms() {
  const now = Date.now();
  rooms.forEach((room, roomId) => {
    if (room.lastActivity && now - room.lastActivity > 2 * 60 * 60 * 1000) {
      rooms.delete(roomId);
    }
  });
}

export async function GET(request: NextRequest) {
  cleanupOldRooms();
  
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const roomId = searchParams.get('roomId');
  
  try {
    // Получение состояния комнаты
    if (action === 'getState' && roomId) {
      const room = rooms.get(roomId.toUpperCase());
      
      if (!room) {
        return NextResponse.json({ error: 'Комната не найдена', exists: false }, { status: 404 });
      }
      
      room.lastActivity = Date.now();
      
      return NextResponse.json({
        success: true,
        exists: true,
        room: {
          id: room.id,
          players: room.players,
          gameState: room.gameState,
          isGameStarted: room.isGameStarted,
          timeControl: room.timeControl,
          playerTimes: room.playerTimes
        }
      });
    }
    
    // Проверка существования комнаты
    if (action === 'checkRoom' && roomId) {
      const room = rooms.get(roomId.toUpperCase());
      
      return NextResponse.json({
        exists: !!room,
        canJoin: room && room.players.length < 2 && !room.isGameStarted
      });
    }
    
    return NextResponse.json({ error: 'Неизвестное действие' }, { status: 400 });
    
  } catch (error) {
    console.error('Chess API GET error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  cleanupOldRooms();
  
  try {
    const body = await request.json();
    const { action, roomId, playerId, playerName, timeControl, gameState, playerTimes } = body;
    
    // Создание комнаты
    if (action === 'createRoom') {
      const newRoomId = generateRoomCode();
      const newPlayerId = generatePlayerId();
      const time = timeControl || 600; // 10 минут по умолчанию
      
      const room = {
        id: newRoomId,
        players: [{
          id: newPlayerId,
          color: 'w' as const,
          name: playerName || 'Игрок 1',
          timeRemaining: time,
          isConnected: true
        }],
        gameState: createInitialGameState(),
        isGameStarted: false,
        timeControl: time,
        playerTimes: { w: time, b: time },
        createdAt: Date.now(),
        lastActivity: Date.now()
      };
      
      rooms.set(newRoomId, room);
      
      return NextResponse.json({
        success: true,
        roomId: newRoomId,
        playerId: newPlayerId,
        playerColor: 'w',
        room: {
          id: room.id,
          players: room.players,
          gameState: room.gameState,
          isGameStarted: room.isGameStarted
        }
      });
    }
    
    // Присоединение к комнате
    if (action === 'joinRoom') {
      const room = rooms.get(roomId?.toUpperCase());
      
      if (!room) {
        return NextResponse.json({ error: 'Комната не найдена' }, { status: 404 });
      }
      
      if (room.players.length >= 2) {
        return NextResponse.json({ error: 'Комната заполнена' }, { status: 400 });
      }
      
      if (room.isGameStarted) {
        return NextResponse.json({ error: 'Игра уже началась' }, { status: 400 });
      }
      
      const newPlayerId = generatePlayerId();
      
      room.players.push({
        id: newPlayerId,
        color: 'b' as const,
        name: playerName || 'Игрок 2',
        timeRemaining: room.timeControl,
        isConnected: true
      });
      
      room.isGameStarted = true;
      room.lastActivity = Date.now();
      
      return NextResponse.json({
        success: true,
        roomId: room.id,
        playerId: newPlayerId,
        playerColor: 'b',
        room: {
          id: room.id,
          players: room.players,
          gameState: room.gameState,
          isGameStarted: room.isGameStarted
        }
      });
    }
    
    // Обновление состояния игры (ход)
    if (action === 'updateState') {
      const room = rooms.get(roomId?.toUpperCase());
      
      if (!room) {
        return NextResponse.json({ error: 'Комната не найдена' }, { status: 404 });
      }
      
      const player = room.players.find((p: any) => p.id === playerId);
      if (!player) {
        return NextResponse.json({ error: 'Вы не в этой комнате' }, { status: 403 });
      }
      
      // Обновляем состояние
      if (gameState) {
        room.gameState = gameState;
      }
      if (playerTimes) {
        room.playerTimes = playerTimes;
      }
      room.lastActivity = Date.now();
      
      return NextResponse.json({
        success: true,
        room: {
          id: room.id,
          players: room.players,
          gameState: room.gameState,
          isGameStarted: room.isGameStarted,
          playerTimes: room.playerTimes
        }
      });
    }
    
    // Новая игра
    if (action === 'newGame') {
      const room = rooms.get(roomId?.toUpperCase());
      
      if (!room) {
        return NextResponse.json({ error: 'Комната не найдена' }, { status: 404 });
      }
      
      room.gameState = createInitialGameState();
      room.playerTimes = { w: room.timeControl, b: room.timeControl };
      room.isGameStarted = true;
      room.lastActivity = Date.now();
      
      return NextResponse.json({
        success: true,
        room: {
          id: room.id,
          players: room.players,
          gameState: room.gameState,
          isGameStarted: room.isGameStarted
        }
      });
    }
    
    return NextResponse.json({ error: 'Неизвестное действие' }, { status: 400 });
    
  } catch (error) {
    console.error('Chess API POST error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
