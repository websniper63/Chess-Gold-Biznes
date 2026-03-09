'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ChessBoard } from '@/components/ChessBoard';
import { GameModeSelect } from '@/components/GameModeSelect';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
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

  // Online multiplayer state
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState<Player[]>([]);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [isRoomCreator, setIsRoomCreator] = useState(false);

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
  const prevGameOverRef = useRef(false);

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
            setGameState(g => {
              if (!g.gameOver) {
                setShowGameEndDialog(true);
              }
              return {
                ...g,
                gameOver: true,
                winner: 'b',
                drawReason: 'Время вышло'
              };
            });
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            setGameState(g => {
              if (!g.gameOver) {
                setShowGameEndDialog(true);
              }
              return {
                ...g,
                gameOver: true,
                winner: 'w',
                drawReason: 'Время вышло'
              };
            });
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

        const newGameState = makeMove(gameState, selectedSquare, pos);
        if (newGameState) {
          setGameState(newGameState);
          
          if (newGameState.gameOver) {
            setShowGameEndDialog(true);
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
        setSelectedSquare(pos);
        setLegalMoves(getLegalMoves(gameState, pos));
      }
    }
  }, [gameState, selectedSquare, legalMoves, isThinking, gameSettings, makeAIMove]);

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
    prevGameOverRef.current = false;

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
    setOpponentDisconnected(false);
    setShowGameEndDialog(false);
    setPromotionDialog(null);
    prevGameOverRef.current = false;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Create room
  const createRoom = useCallback((playerName: string, timeControl: number, skin: BoardSkinId) => {
    setWaitingForOpponent(true);
    setIsRoomCreator(true);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(code);
    setPlayerColor('w');
    setBoardSkin(skin);
    setOnlinePlayers([{
      id: '1',
      color: 'w',
      name: playerName,
      timeRemaining: timeControl,
      isConnected: true
    }]);
    setGameSettings({
      mode: 'online',
      timeControl,
      playerColor: 'w',
      boardSkin: skin
    });
    setWhiteTime(timeControl);
    setBlackTime(timeControl);
  }, []);

  // Join room
  const joinRoom = useCallback((roomId: string, playerName: string) => {
    setWaitingForOpponent(false);
    setIsRoomCreator(false);
    setRoomId(roomId);
    setPlayerColor('b');
    setOnlinePlayers([
      { id: '1', color: 'w', name: 'Игрок 1', timeRemaining: 600, isConnected: true },
      { id: '2', color: 'b', name: playerName, timeRemaining: 600, isConnected: true }
    ]);
    setGameSettings({
      mode: 'online',
      timeControl: 600,
      playerColor: 'b'
    });
    setIsGameStarted(true);
    setGameState(createInitialGameState());
  }, []);

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

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
            <span className="text-4xl">♔</span>
            Шахматы
            <span className="text-4xl">♚</span>
          </h1>
          <p className="text-slate-400 mt-1">Играйте против ИИ, вдвоём или онлайн с друзьями</p>
        </header>

        {!isGameStarted ? (
          <GameModeSelect
            onStartGame={startGame}
            onCreateRoom={createRoom}
            onJoinRoom={joinRoom}
            isConnecting={isConnecting}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 max-w-6xl mx-auto">
            {/* Main Game Area */}
            <div className="flex flex-col items-center gap-4">
              {/* Black Player Timer (top) */}
              <div className="w-full max-w-md">
                <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                  gameState.currentTurn === 'b'
                    ? 'bg-slate-700 ring-2 ring-yellow-500 shadow-lg shadow-yellow-500/20'
                    : 'bg-slate-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">♚</span>
                    <span className="font-semibold">{blackPlayerName}</span>
                    {isThinking && gameSettings?.mode === 'ai' && gameSettings.playerColor === 'w' && (
                      <Badge variant="secondary" className="ml-2 animate-pulse bg-slate-600">
                        Думаю...
                      </Badge>
                    )}
                  </div>
                  {gameSettings?.timeControl ? (
                    <span className={`font-mono text-xl font-bold ${
                      blackTime < 30 ? 'text-red-400 animate-pulse' : ''
                    }`}>
                      {formatTime(blackTime)}
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      {gameState.currentTurn === 'b' ? '⏳ Ход' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Chess Board */}
              <div className="relative">
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
                {isThinking && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl backdrop-blur-sm">
                    <div className="bg-slate-800 px-6 py-3 rounded-xl flex items-center gap-3 shadow-2xl">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Компьютер думает...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* White Player Timer (bottom) */}
              <div className="w-full max-w-md">
                <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                  gameState.currentTurn === 'w'
                    ? 'bg-slate-700 ring-2 ring-yellow-500 shadow-lg shadow-yellow-500/20'
                    : 'bg-slate-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">♔</span>
                    <span className="font-semibold">{whitePlayerName}</span>
                    {isThinking && gameSettings?.mode === 'ai' && gameSettings.playerColor === 'b' && (
                      <Badge variant="secondary" className="ml-2 animate-pulse bg-slate-600">
                        Думаю...
                      </Badge>
                    )}
                  </div>
                  {gameSettings?.timeControl ? (
                    <span className={`font-mono text-xl font-bold ${
                      whiteTime < 30 ? 'text-red-400 animate-pulse' : ''
                    }`}>
                      {formatTime(whiteTime)}
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      {gameState.currentTurn === 'w' ? '⏳ Ваш ход' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-2">
                <Button variant="outline" onClick={resetGame} className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                  ← В меню
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setGameState(createInitialGameState());
                    setSelectedSquare(null);
                    setLegalMoves([]);
                    setShowGameEndDialog(false);
                    prevGameOverRef.current = false;
                    if (gameSettings?.timeControl) {
                      setWhiteTime(gameSettings.timeControl);
                      setBlackTime(gameSettings.timeControl);
                    }
                  }}
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                >
                  Новая игра
                </Button>
              </div>
            </div>

            {/* Side Panel */}
            <div className="flex flex-col gap-4">
              {/* Room Info (for online mode) */}
              {gameSettings?.mode === 'online' && roomId && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Комната</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-sm text-slate-400 mb-2">
                        {waitingForOpponent 
                          ? 'Отправьте код другу:' 
                          : 'Код комнаты:'}
                      </p>
                      <div className="bg-slate-900 py-3 px-4 rounded-lg text-2xl font-mono font-bold tracking-widest">
                        {roomId}
                      </div>
                      {waitingForOpponent && (
                        <p className="text-sm text-yellow-400 mt-2 animate-pulse">
                          ⏳ Ожидание противника...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Game Status */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Статус
                    {gameState.isCheck && !gameState.gameOver && (
                      <Badge variant="destructive" className="animate-pulse">ШАХ!</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Ход:</span>
                    <span className="font-semibold flex items-center gap-2">
                      {gameState.currentTurn === 'w' ? (
                        <>♔ Белые</>
                      ) : (
                        <>♚ Чёрные</>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-slate-400">Номер хода:</span>
                    <span className="font-semibold">{gameState.fullMoveNumber}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Move History */}
              <Card className="bg-slate-800 border-slate-700 flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">История ходов</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] pr-4">
                    {gameState.moveHistory.length === 0 ? (
                      <p className="text-slate-500 text-sm">Ходов пока нет</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        {gameState.moveHistory.map((move, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-2 py-1 px-2 rounded ${
                              index === gameState.moveHistory.length - 1
                                ? 'bg-slate-700'
                                : ''
                            }`}
                          >
                            <span className="text-slate-500 w-6">
                              {index % 2 === 0 ? Math.floor(index / 2) + 1 + '.' : ''}
                            </span>
                            <span className="font-mono">
                              {move.notation}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Captured Pieces */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Взятые фигуры</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-slate-400 text-sm">Белыми: </span>
                    <span className="font-mono text-lg">
                      {gameState.capturedPieces.b
                        .sort((a, b) => {
                          const order = { q: 1, r: 2, b: 3, n: 4, p: 5 };
                          return order[a.type] - order[b.type];
                        })
                        .map(p => PIECE_SYMBOLS.b[p.type])
                        .join(' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Чёрными: </span>
                    <span className="font-mono text-lg">
                      {gameState.capturedPieces.w
                        .sort((a, b) => {
                          const order = { q: 1, r: 2, b: 3, n: 4, p: 5 };
                          return order[a.type] - order[b.type];
                        })
                        .map(p => PIECE_SYMBOLS.w[p.type])
                        .join(' ')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Promotion Dialog */}
      <Dialog open={!!promotionDialog} onOpenChange={() => setPromotionDialog(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Превращение пешки</DialogTitle>
            <DialogDescription className="text-slate-400">
              Выберите фигуру для превращения
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 mt-4">
            {(['q', 'r', 'b', 'n'] as PieceType[]).map((type) => (
              <Button
                key={type}
                variant="outline"
                className="w-16 h-16 text-4xl bg-slate-700 hover:bg-slate-600 border-slate-600 transition-transform hover:scale-110"
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
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
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
                prevGameOverRef.current = false;
                if (gameSettings?.timeControl) {
                  setWhiteTime(gameSettings.timeControl);
                  setBlackTime(gameSettings.timeControl);
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Играть снова
            </Button>
            <Button
              variant="outline"
              onClick={resetGame}
              className="w-full bg-slate-700 border-slate-600 hover:bg-slate-600"
            >
              В главное меню
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
