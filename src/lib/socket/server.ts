import { createServer } from 'http'
import { Server } from 'socket.io'
import { 
  GameState, 
  Position, 
  Room, 
  Player, 
  PieceColor,
  createInitialGameState,
  makeMove
} from '../chess'

const httpServer = createServer()
const io = new Server(httpServer, {
  path: '/',
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})

// Хранилище комнат
const rooms = new Map<string, Room>()

// Генерация уникального кода комнаты
function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Генерация ID игрока
function generatePlayerId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Получение или создание комнаты
function getOrCreateRoom(roomId: string, timeControl: number = 600): Room {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      id: roomId,
      players: [],
      gameState: createInitialGameState(),
      timeControl,
      isGameStarted: false,
      createdAt: new Date()
    })
  }
  return rooms.get(roomId)!
}

// Отправка обновления состояния игры всем игрокам в комнате
function broadcastGameState(room: Room) {
  io.to(room.id).emit('game-state', {
    gameState: room.gameState,
    players: room.players,
    isGameStarted: room.isGameStarted
  })
}

// Интервал для обновления таймеров
setInterval(() => {
  rooms.forEach((room) => {
    if (room.isGameStarted && !room.gameState.gameOver) {
      const currentPlayer = room.players.find(p => p.color === room.gameState.currentTurn)
      if (currentPlayer && room.timeControl > 0) {
        currentPlayer.timeRemaining = Math.max(0, currentPlayer.timeRemaining - 1)
        
        if (currentPlayer.timeRemaining === 0) {
          // Время истекло
          room.gameState.gameOver = true
          room.gameState.winner = currentPlayer.color === 'w' ? 'b' : 'w'
          room.gameState.drawReason = undefined
          io.to(room.id).emit('timeout', { 
            loser: currentPlayer.color, 
            winner: room.gameState.winner 
          })
        }
        
        broadcastGameState(room)
      }
    }
  })
}, 1000)

// Очистка неактивных комнат (старше 2 часов)
setInterval(() => {
  const now = new Date()
  rooms.forEach((room, roomId) => {
    const hoursSinceCreation = (now.getTime() - room.createdAt.getTime()) / (1000 * 60 * 60)
    if (hoursSinceCreation > 2 || (room.players.length === 0 && hoursSinceCreation > 0.5)) {
      rooms.delete(roomId)
      console.log(`Room ${roomId} cleaned up`)
    }
  })
}, 60000) // Каждую минуту

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  // Создание новой комнаты
  socket.on('create-room', (data: { playerName: string; timeControl: number }) => {
    const { playerName, timeControl } = data
    const roomId = generateRoomCode()
    const playerId = generatePlayerId()
    
    const room = getOrCreateRoom(roomId, timeControl)
    
    const player: Player = {
      id: playerId,
      color: 'w', // Создатель комнаты играет белыми
      name: playerName,
      timeRemaining: timeControl,
      isConnected: true
    }
    
    room.players.push(player)
    socket.join(roomId)
    socket.data = { roomId, playerId }
    
    socket.emit('room-created', {
      roomId,
      player
    })
    
    broadcastGameState(room)
    console.log(`Room ${roomId} created by ${playerName}`)
  })

  // Присоединение к комнате
  socket.on('join-room', (data: { roomId: string; playerName: string }) => {
    const { roomId, playerName } = data
    const room = rooms.get(roomId.toUpperCase())
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' })
      return
    }
    
    if (room.players.length >= 2) {
      socket.emit('error', { message: 'Room is full' })
      return
    }
    
    if (room.isGameStarted) {
      socket.emit('error', { message: 'Game already started' })
      return
    }
    
    const playerId = generatePlayerId()
    
    const player: Player = {
      id: playerId,
      color: 'b', // Присоединившийся играет чёрными
      name: playerName,
      timeRemaining: room.timeControl,
      isConnected: true
    }
    
    room.players.push(player)
    socket.join(roomId)
    socket.data = { roomId, playerId }
    
    // Игра начинается, когда есть 2 игрока
    if (room.players.length === 2) {
      room.isGameStarted = true
      io.to(roomId).emit('game-started', { roomId })
    }
    
    socket.emit('room-joined', {
      roomId,
      player
    })
    
    broadcastGameState(room)
    console.log(`${playerName} joined room ${roomId}`)
  })

  // Переподключение к комнате
  socket.on('reconnect', (data: { roomId: string; playerId: string }) => {
    const { roomId, playerId } = data
    const room = rooms.get(roomId.toUpperCase())
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' })
      return
    }
    
    const player = room.players.find(p => p.id === playerId)
    if (!player) {
      socket.emit('error', { message: 'Player not found in room' })
      return
    }
    
    player.isConnected = true
    socket.join(roomId)
    socket.data = { roomId, playerId }
    
    socket.emit('reconnected', { roomId, player })
    broadcastGameState(room)
    
    io.to(roomId).emit('player-reconnected', { player })
    console.log(`Player ${player.name} reconnected to room ${roomId}`)
  })

  // Совершение хода
  socket.on('make-move', (data: { 
    from: Position; 
    to: Position; 
    promotion?: string 
  }) => {
    const { roomId, playerId } = socket.data || {}
    if (!roomId || !playerId) {
      socket.emit('error', { message: 'Not in a room' })
      return
    }
    
    const room = rooms.get(roomId)
    if (!room) {
      socket.emit('error', { message: 'Room not found' })
      return
    }
    
    const player = room.players.find(p => p.id === playerId)
    if (!player) {
      socket.emit('error', { message: 'Player not found' })
      return
    }
    
    // Проверка хода игрока
    if (room.gameState.currentTurn !== player.color) {
      socket.emit('error', { message: 'Not your turn' })
      return
    }
    
    // Выполнение хода
    const newGameState = makeMove(room.gameState, data.from, data.to, data.promotion as any)
    
    if (!newGameState) {
      socket.emit('error', { message: 'Invalid move' })
      return
    }
    
    room.gameState = newGameState
    
    // Уведомление о результате игры
    if (newGameState.gameOver) {
      io.to(roomId).emit('game-over', {
        winner: newGameState.winner,
        reason: newGameState.isCheckmate ? 'checkmate' : 
                newGameState.isStalemate ? 'stalemate' : 
                newGameState.drawReason
      })
    }
    
    broadcastGameState(room)
    console.log(`Move in room ${roomId}: ${JSON.stringify(data.from)} -> ${JSON.stringify(data.to)}`)
  })

  // Предложение ничьей
  socket.on('offer-draw', () => {
    const { roomId, playerId } = socket.data || {}
    if (!roomId) return
    
    const room = rooms.get(roomId)
    if (!room) return
    
    const player = room.players.find(p => p.id === playerId)
    if (!player) return
    
    socket.to(roomId).emit('draw-offered', { from: player })
  })

  // Принятие ничьей
  socket.on('accept-draw', () => {
    const { roomId } = socket.data || {}
    if (!roomId) return
    
    const room = rooms.get(roomId)
    if (!room) return
    
    room.gameState.gameOver = true
    room.gameState.isDraw = true
    room.gameState.drawReason = 'Draw by agreement'
    
    io.to(roomId).emit('draw-accepted')
    broadcastGameState(room)
  })

  // Отклонение ничьей
  socket.on('decline-draw', () => {
    const { roomId } = socket.data || {}
    if (!roomId) return
    
    socket.to(roomId).emit('draw-declined')
  })

  // Сдача
  socket.on('resign', () => {
    const { roomId, playerId } = socket.data || {}
    if (!roomId || !playerId) return
    
    const room = rooms.get(roomId)
    if (!room) return
    
    const player = room.players.find(p => p.id === playerId)
    if (!player) return
    
    room.gameState.gameOver = true
    room.gameState.winner = player.color === 'w' ? 'b' : 'w'
    
    io.to(roomId).emit('player-resigned', { 
      loser: player,
      winner: room.gameState.winner 
    })
    broadcastGameState(room)
  })

  // Запрос новой игры
  socket.on('new-game', () => {
    const { roomId } = socket.data || {}
    if (!roomId) return
    
    const room = rooms.get(roomId)
    if (!room) return
    
    room.gameState = createInitialGameState()
    room.isGameStarted = true
    
    // Сброс таймеров
    room.players.forEach(p => {
      p.timeRemaining = room.timeControl
    })
    
    io.to(roomId).emit('new-game-started')
    broadcastGameState(room)
  })

  // Отключение
  socket.on('disconnect', () => {
    const { roomId, playerId } = socket.data || {}
    
    if (roomId && playerId) {
      const room = rooms.get(roomId)
      if (room) {
        const player = room.players.find(p => p.id === playerId)
        if (player) {
          player.isConnected = false
          socket.to(roomId).emit('player-disconnected', { player })
          console.log(`Player ${player.name} disconnected from room ${roomId}`)
        }
      }
    }
    
    console.log(`User disconnected: ${socket.id}`)
  })

  socket.on('error', (error) => {
    console.error(`Socket error (${socket.id}):`, error)
  })
})

const PORT = 3003
httpServer.listen(PORT, () => {
  console.log(`Chess WebSocket server running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down server...')
  httpServer.close(() => {
    console.log('WebSocket server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('Received SIGINT signal, shutting down server...')
  httpServer.close(() => {
    console.log('WebSocket server closed')
    process.exit(0)
  })
})

export { io, rooms }
