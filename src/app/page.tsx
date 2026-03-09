'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ChessBoard } from '@/components/ChessBoard';
import { GameModeSelect } from '@/components/GameModeSelect';
import { PlayerPanel } from '@/components/PlayerPanel';
import { MoveHistory } from '@/components/MoveHistory';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  FlipHorizontal,
  Home,
  Plus,
  Settings,
  Crown,
  Trophy,
  Loader2
} from 'lucide-react';
import {
  GameState,
  Position,
  PieceColor,
  PieceType,
  GameSettings,
  Player,
  BoardSkinId,
  PieceSetId,
  createInitialGameState,
  makeMove,
  getLegalMoves,
  PIECE_SYMBOLS
} from '@/lib/chess';
import { useSounds } from '@/hooks/useSounds';
import { cn } from '@/lib/utils';

export default function ChessGame() {
  // Game state
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [legalMoves, setLegalMoves] = useState<Position[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [gameSettings, setGameSettings] = useState<(GameSettings & { boardSkin?: BoardSkinId; pieceSet?: PieceSetId }) | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerColor, setPlayerColor] = useState<PieceColor>('w');
  const [boardSkin, setBoardSkin] = useState<BoardSkinId>('classic');
  const [pieceSet, setPieceSet] = useState<PieceSetId>('fantasy');
  
  // Sound state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playSound } = useSounds(soundEnabled);

  // Online multiplayer state
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState<Player[]>([]);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [isRoomCreator, setIsRoomCreator] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Promotion dialog
  const [promotionDialog, setPromotionDialog] = useState<{
    from: Position;
    to: Position;
    color: PieceColor;
  } | null>(null);

  // Game end dialog
  const [showGameEndDialog, setShowGameEndDialog] = useState(false);

  // Timers
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer interval
  useEffect(() => {
    if (!isGameStarted || gameState.gameOver || !gameSettings?.timeControl) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      if (gameState.currentTurn === 'w') {
        setWhiteTime(prev => {
          if (prev <= 1) {
            setGameState(g => ({
              ...g,
              gameOver: true,
              winner: 'b',
              drawReason: 'Время вышло'
            }));
            setShowGameEndDialog(true);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            setGameState(g => ({
              ...g,
              gameOver: true,
              winner: 'w',
              drawReason: 'Время вышло'
            }));
            setShowGameEndDialog(true);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isGameStarted, gameState.currentTurn, gameState.gameOver, gameSettings?.timeControl]);

  // AI move
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
          
          if (newGameState.gameOver) {
            setShowGameEndDialog(true);
          }
        }
      }
    } catch (error) {
      console.error('Ошибка хода ИИ:', error);
    }

    setIsThinking(false);
  }, [gameSettings]);

  // Handle square click
  const handleSquareClick = useCallback((pos: Position) => {
    if (gameState.gameOver || isThinking) return;

    // In AI mode, check if it's player's turn
    if (gameSettings?.mode === 'ai' && gameState.currentTurn !== gameSettings.playerColor) {
      return;
    }

    const piece = gameState.board[pos.row][pos.col];

    if (selectedSquare) {
      const isLegalMove = legalMoves.some(m => m.row === pos.row && m.col === pos.col);

      if (isLegalMove) {
        const selectedPiece = gameState.board[selectedSquare.row][selectedSquare.col];
        if (selectedPiece?.type === 'p' && (pos.row === 0 || pos.row === 7)) {
          setPromotionDialog({
            from: selectedSquare,
            to: pos,
            color: selectedPiece.color
          });
          return;
        }

        const targetPiece = gameState.board[pos.row][pos.col];
        const newGameState = makeMove(gameState, selectedSquare, pos);
        if (newGameState) {
          setGameState(newGameState);
          
          // Play sound
          if (targetPiece) {
            playSound('capture');
          } else if (newGameState.isCheck) {
            playSound('check');
          } else {
            playSound('move');
          }
          
          if (newGameState.gameOver) {
            setShowGameEndDialog(true);
            playSound('gameEnd');
          }

          if (gameSettings?.mode === 'ai' && !newGameState.gameOver) {
            setTimeout(() => makeAIMove(newGameState), 500);
          }
        }
        setSelectedSquare(null);
        setLegalMoves([]);
      } else if (piece && piece.color === gameState.currentTurn) {
        if (gameSettings?.mode === 'ai' && piece.color !== gameSettings.playerColor) {
          setSelectedSquare(null);
          setLegalMoves([]);
          return;
        }
        playSound('select');
        setSelectedSquare(pos);
        setLegalMoves(getLegalMoves(gameState, pos));
      } else {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    } else {
      if (piece && piece.color === gameState.currentTurn) {
        if (gameSettings?.mode === 'ai' && piece.color !== gameSettings.playerColor) {
          return;
        }
        playSound('select');
        setSelectedSquare(pos);
        setLegalMoves(getLegalMoves(gameState, pos));
      }
    }
  }, [gameState, selectedSquare, legalMoves, isThinking, gameSettings, makeAIMove, playSound]);

  // Handle promotion
  const handlePromotion = useCallback((pieceType: PieceType) => {
    if (!promotionDialog) return;

    const newGameState = makeMove(gameState, promotionDialog.from, promotionDialog.to, pieceType);
    if (newGameState) {
      setGameState(newGameState);
      
      if (newGameState.gameOver) {
        setShowGameEndDialog(true);
      }

      if (gameSettings?.mode === 'ai' && !newGameState.gameOver) {
        setTimeout(() => makeAIMove(newGameState), 500);
      }
    }

    setPromotionDialog(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  }, [promotionDialog, gameState, gameSettings, makeAIMove]);

  // Start game
  const startGame = useCallback((settings: GameSettings & { boardSkin?: BoardSkinId }) => {
    setGameSettings(settings);
    setGameState(createInitialGameState());
    setSelectedSquare(null);
    setLegalMoves([]);
    setIsGameStarted(true);
    setPlayerColor(settings.playerColor);
    setShowGameEndDialog(false);

    if (settings.boardSkin) {
      setBoardSkin(settings.boardSkin);
    }
    if (settings.pieceSet) {
      setPieceSet(settings.pieceSet);
    }

    setWhiteTime(settings.timeControl);
    setBlackTime(settings.timeControl);
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    setSelectedSquare(null);
    setLegalMoves([]);
    setIsThinking(false);
    setIsGameStarted(false);
    setGameSettings(null);
    setRoomId(null);
    setOnlinePlayers([]);
    setWaitingForOpponent(false);
    setShowGameEndDialog(false);
    setPromotionDialog(null);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // Start polling for room updates
  const startPolling = useCallback((roomId: string) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    
    pollingRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/chess-room?action=getState&roomId=${roomId}`);
        const data = await response.json();
        
        if (data.success && data.room) {
          setOnlinePlayers(data.room.players);
          
          if (data.room.isGameStarted && !isGameStarted) {
            setWaitingForOpponent(false);
            setIsGameStarted(true);
            setGameState(data.room.gameState);
          }
          
          if (data.room.gameState) {
            setGameState(data.room.gameState);
          }
          
          if (data.room.playerTimes) {
            setWhiteTime(data.room.playerTimes.w);
            setBlackTime(data.room.playerTimes.b);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 500);
  }, [isGameStarted]);

  // Create room via API
  const createRoom = useCallback(async (playerName: string, timeControl: number, selectedBoardSkin: BoardSkinId = 'classic', selectedPieceSet: PieceSetId = 'fantasy') => {
    setWaitingForOpponent(true);
    setIsRoomCreator(true);
    setIsConnecting(true);
    
    try {
      const response = await fetch('/api/chess-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createRoom',
          playerName,
          timeControl,
          boardSkin: selectedBoardSkin,
          pieceSet: selectedPieceSet
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRoomId(data.roomId);
        setPlayerColor(data.playerColor);
        setOnlinePlayers(data.room.players);
        setBoardSkin(selectedBoardSkin);
        setPieceSet(selectedPieceSet);
        setGameSettings({
          mode: 'online',
          timeControl,
          playerColor: data.playerColor
        });
        setWhiteTime(timeControl);
        setBlackTime(timeControl);
        
        startPolling(data.roomId);
      } else {
        console.error('Failed to create room:', data.error);
        setWaitingForOpponent(false);
        setIsRoomCreator(false);
      }
    } catch (error) {
      console.error('Create room error:', error);
      setWaitingForOpponent(false);
      setIsRoomCreator(false);
    }
    
    setIsConnecting(false);
  }, [startPolling]);

  // Join room via API
  const joinRoom = useCallback(async (roomId: string, playerName: string) => {
    setIsConnecting(true);
    setIsRoomCreator(false);
    
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
        setRoomId(data.roomId);
        setPlayerColor(data.playerColor);
        setOnlinePlayers(data.room.players);
        setGameSettings({
          mode: 'online',
          timeControl: data.room.players[0]?.timeRemaining || 600,
          playerColor: data.playerColor
        });
        setIsGameStarted(true);
        setGameState(data.room.gameState);
        setWaitingForOpponent(false);
        
        startPolling(data.roomId);
      } else {
        console.error('Failed to join room:', data.error);
        alert('Не удалось присоединиться: ' + (data.error || 'Комната не найдена'));
      }
    } catch (error) {
      console.error('Join room error:', error);
      alert('Ошибка соединения');
    }
    
    setIsConnecting(false);
  }, [startPolling]);

  // Get last move
  const lastMove = gameState.moveHistory.length > 0
    ? gameState.moveHistory[gameState.moveHistory.length - 1]
    : null;

  // Get player names
  const whitePlayerName = gameSettings?.mode === 'ai'
    ? (gameSettings.playerColor === 'w' ? 'Вы' : 'Компьютер')
    : onlinePlayers.find(p => p.color === 'w')?.name || 'Белые';
  const blackPlayerName = gameSettings?.mode === 'ai'
    ? (gameSettings.playerColor === 'b' ? 'Вы' : 'Компьютер')
    : onlinePlayers.find(p => p.color === 'b')?.name || 'Чёрные';

  // Get game end message
  const getGameEndMessage = () => {
    if (gameState.isCheckmate) {
      const winner = gameState.winner === 'w' ? 'Белые' : 'Чёрные';
      return `Мат! ${winner} победили!`;
    }
    if (gameState.isStalemate) {
      return 'Пат! Ничья!';
    }
    if (gameState.drawReason) {
      return `Ничья: ${gameState.drawReason}`;
    }
    if (gameState.winner) {
      const winner = gameState.winner === 'w' ? 'Белые' : 'Чёрные';
      return `${winner} победили!`;
    }
    return 'Игра окончена';
  };

  // Handle URL join parameter (read only, no state needed)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const joinCode = params.get('join');
      // joinCode is available for future implementation of auto-join functionality
      console.log('Join code from URL:', joinCode);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#1E293B] text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0F172A] border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl font-bold shadow-lg">
              ♔
            </div>
            <div>
              <h1 className="text-lg font-bold">Шахматы</h1>
              <p className="text-xs text-slate-400">Классическая игра</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4">
        {!isGameStarted ? (
          <GameModeSelect
            onStartGame={startGame}
            onCreateOnlineRoom={createRoom}
            onJoinOnlineRoom={joinRoom}
            isConnecting={isConnecting}
          />
        ) : waitingForOpponent && isRoomCreator ? (
          // Waiting room dialog for online game
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-sm w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
                <h2 className="text-xl font-bold mb-2">Ожидание игрока</h2>
                <p className="text-slate-400 text-sm mb-6">
                  Отправьте код другу:
                </p>
                
                <div className="bg-slate-800 rounded-xl p-4 mb-4">
                  <div className="text-3xl font-mono font-bold tracking-widest text-amber-400">
                    {roomId}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full bg-slate-700 border-slate-600 hover:bg-slate-600 mb-2"
                  onClick={() => {
                    const link = `${window.location.origin}?join=${roomId}`;
                    navigator.clipboard.writeText(link);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                >
                  {copiedLink ? (
                    <><Check className="w-4 h-4 mr-2" /> Скопировано!</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-2" /> Копировать ссылку</>
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full text-slate-400 hover:text-white mt-2"
                  onClick={resetGame}
                >
                  Отмена
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
              {/* Main Game Area */}
              <div className="flex flex-col gap-4">
                {/* Black Player Panel */}
                <PlayerPanel
                  color="b"
                  name={blackPlayerName}
                  isAI={gameSettings?.mode === 'ai' && gameSettings.playerColor === 'w'}
                  time={gameSettings?.timeControl ? blackTime : undefined}
                  isActive={gameState.currentTurn === 'b' && !gameState.gameOver}
                  capturedPieces={gameState.capturedPieces.b}
                  isCheck={gameState.isCheck && gameState.currentTurn === 'b'}
                  isWinner={gameState.winner === 'b'}
                  pieceSetId={pieceSet}
                />
                
                {/* Chess Board */}
                <div className="relative flex justify-center">
                  <ChessBoard
                    board={gameState.board}
                    currentTurn={gameState.currentTurn}
                    selectedSquare={selectedSquare}
                    legalMoves={legalMoves}
                    lastMove={lastMove}
                    playerColor={playerColor}
                    isCheck={gameState.isCheck}
                    onSquareClick={handleSquareClick}
                    skinId={boardSkin}
                    pieceSetId={pieceSet}
                  />
                  
                  {/* Thinking overlay */}
                  {isThinking && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl backdrop-blur-sm">
                      <div className="bg-slate-800 px-6 py-3 rounded-xl flex items-center gap-3 shadow-2xl">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Компьютер думает...</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* White Player Panel */}
                <PlayerPanel
                  color="w"
                  name={whitePlayerName}
                  isAI={gameSettings?.mode === 'ai' && gameSettings.playerColor === 'b'}
                  time={gameSettings?.timeControl ? whiteTime : undefined}
                  isActive={gameState.currentTurn === 'w' && !gameState.gameOver}
                  capturedPieces={gameState.capturedPieces.w}
                  isCheck={gameState.isCheck && gameState.currentTurn === 'w'}
                  isWinner={gameState.winner === 'w'}
                  pieceSetId={pieceSet}
                />
                
                {/* Control Buttons */}
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={resetGame}
                    className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    В меню
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setGameState(createInitialGameState());
                      setSelectedSquare(null);
                      setLegalMoves([]);
                      setShowGameEndDialog(false);
                      if (gameSettings?.timeControl) {
                        setWhiteTime(gameSettings.timeControl);
                        setBlackTime(gameSettings.timeControl);
                      }
                    }}
                    className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Новая игра
                  </Button>
                </div>
              </div>
              
              {/* Side Panel */}
              <div className="space-y-4">
                {/* Room Info (for online mode) */}
                {gameSettings?.mode === 'online' && roomId && (
                  <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-2">Код комнаты</p>
                      <div className="bg-slate-900 py-2 px-4 rounded-lg text-xl font-mono font-bold tracking-widest text-amber-400">
                        {roomId}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Game Status */}
                <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-400">Ход</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{gameState.currentTurn === 'w' ? '♔' : '♚'}</span>
                      <span className="font-semibold">
                        {gameState.currentTurn === 'w' ? 'Белые' : 'Чёрные'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Номер хода</span>
                    <span className="font-semibold">{gameState.fullMoveNumber}</span>
                  </div>
                  
                  {gameState.isCheck && !gameState.gameOver && (
                    <div className="mt-3 flex justify-center">
                      <Badge variant="destructive" className="animate-pulse">
                        ШАХ!
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Move History */}
                <MoveHistory 
                  moves={gameState.moveHistory}
                  currentTurn={gameState.currentTurn}
                  fullMoveNumber={gameState.fullMoveNumber}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Promotion Dialog */}
      <Dialog open={!!promotionDialog} onOpenChange={() => setPromotionDialog(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Превращение пешки</DialogTitle>
            <DialogDescription className="text-slate-400 text-center">
              Выберите фигуру
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-3 mt-4">
            {(['q', 'r', 'b', 'n'] as PieceType[]).map((type) => (
              <Button
                key={type}
                variant="outline"
                className="w-16 h-16 text-3xl bg-slate-700 hover:bg-slate-600 border-slate-600 transition-transform hover:scale-110"
                onClick={() => handlePromotion(type)}
              >
                {PIECE_SYMBOLS[promotionDialog?.color || 'w'][type]}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Game End Dialog */}
      <Dialog open={showGameEndDialog} onOpenChange={setShowGameEndDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-sm">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-xl text-center">
              {getGameEndMessage()}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={() => {
                setGameState(createInitialGameState());
                setSelectedSquare(null);
                setLegalMoves([]);
                setShowGameEndDialog(false);
                if (gameSettings?.timeControl) {
                  setWhiteTime(gameSettings.timeControl);
                  setBlackTime(gameSettings.timeControl);
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Играть снова
            </Button>
            <Button
              variant="outline"
              onClick={resetGame}
              className="w-full bg-slate-700 border-slate-600 hover:bg-slate-600"
            >
              <Home className="w-4 h-4 mr-2" />
              В главное меню
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
