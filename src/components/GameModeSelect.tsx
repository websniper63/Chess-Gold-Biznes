'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { GameMode, AIDifficulty, GameSettings, PieceColor, BoardSkinId, PieceSetId, BOARD_SKINS, PIECE_SETS, Piece } from '@/lib/chess';
import { ChessPiece3D } from '@/components/ChessPiece';
import { 
  Bot, 
  Users, 
  Globe, 
  Play, 
  ArrowRight,
  Clock,
  Palette,
  Crown,
  Copy,
  Check,
  Share2,
  Loader2
} from 'lucide-react';

// Sample pieces for preview
const PREVIEW_KING: Piece = { type: 'k', color: 'w' };
const PREVIEW_QUEEN: Piece = { type: 'q', color: 'w' };
const PREVIEW_KNIGHT: Piece = { type: 'n', color: 'w' };

interface GameModeSelectProps {
  onStartGame: (settings: GameSettings & { boardSkin?: BoardSkinId; pieceSet?: PieceSetId }) => void;
  onCreateOnlineRoom: (playerName: string, timeControl: number, boardSkin: BoardSkinId, pieceSet: PieceSetId) => void;
  onJoinOnlineRoom: (roomId: string, playerName: string) => void;
  isConnecting?: boolean;
}

export function GameModeSelect({ 
  onStartGame, 
  onCreateOnlineRoom, 
  onJoinOnlineRoom,
  isConnecting 
}: GameModeSelectProps) {
  const [mode, setMode] = useState<GameMode>('local');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('medium');
  const [playerColor, setPlayerColor] = useState<PieceColor>('w');
  const [timeControl, setTimeControl] = useState(600); // 10 минут по умолчанию
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [boardSkin, setBoardSkin] = useState<BoardSkinId>('classic');
  const [pieceSet, setPieceSet] = useState<PieceSetId>('fantasy');

  const timeOptions = [
    { label: '1 мин', value: 60 },
    { label: '3 мин', value: 180 },
    { label: '5 мин', value: 300 },
    { label: '10 мин', value: 600 },
    { label: '15 мин', value: 900 },
    { label: '30 мин', value: 1800 },
    { label: 'Без лимита', value: 0 },
  ];

  const handleStartLocalGame = () => {
    onStartGame({
      mode: 'local',
      timeControl,
      playerColor: 'w',
      boardSkin,
      pieceSet
    });
  };

  const handleStartAIGame = () => {
    onStartGame({
      mode: 'ai',
      aiDifficulty,
      timeControl,
      playerColor,
      boardSkin,
      pieceSet
    });
  };

  const handleCreateRoom = () => {
    if (playerName.trim()) {
      onCreateOnlineRoom(playerName.trim(), timeControl, boardSkin, pieceSet);
    }
  };

  const handleJoinRoom = () => {
    if (playerName.trim() && roomId.trim()) {
      onJoinOnlineRoom(roomId.trim().toUpperCase(), playerName.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="shadow-2xl bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border-slate-600/50 overflow-hidden">
        {/* Premium header with gradient */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500" />
        
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-4xl font-bold flex items-center justify-center gap-4">
            <span className="text-5xl drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">♔</span>
            <span className="bg-gradient-to-r from-yellow-200 via-amber-100 to-yellow-200 bg-clip-text text-transparent">
              Шахматы
            </span>
            <span className="text-5xl drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">♚</span>
          </CardTitle>
          <CardDescription className="text-lg text-slate-300 mt-2">
            Играйте против ИИ, вдвоём на одном устройстве или онлайн с друзьями
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Выбор режима */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={mode === 'ai' ? 'default' : 'outline'}
              className={`h-28 flex-col gap-3 rounded-xl transition-all duration-300 ${
                mode === 'ai' 
                  ? 'ring-2 ring-blue-400 bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30 scale-[1.02]' 
                  : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-blue-500/30'
              }`}
              onClick={() => setMode('ai')}
            >
              <Bot className="w-10 h-10" />
              <span className="font-semibold text-lg">Против ИИ</span>
            </Button>
            
            <Button
              variant={mode === 'local' ? 'default' : 'outline'}
              className={`h-28 flex-col gap-3 rounded-xl transition-all duration-300 ${
                mode === 'local' 
                  ? 'ring-2 ring-green-400 bg-gradient-to-br from-green-600 to-green-700 shadow-lg shadow-green-500/30 scale-[1.02]' 
                  : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-green-500/30'
              }`}
              onClick={() => setMode('local')}
            >
              <Users className="w-10 h-10" />
              <span className="font-semibold text-lg">Вдвоём</span>
            </Button>
            
            <Button
              variant={mode === 'online' ? 'default' : 'outline'}
              className={`h-28 flex-col gap-3 rounded-xl transition-all duration-300 ${
                mode === 'online' 
                  ? 'ring-2 ring-purple-400 bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg shadow-purple-500/30 scale-[1.02]' 
                  : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 hover:border-purple-500/30'
              }`}
              onClick={() => setMode('online')}
            >
              <Globe className="w-10 h-10" />
              <span className="font-semibold text-lg">Онлайн</span>
            </Button>
          </div>

          {/* Выбор набора фигур */}
          {(mode === 'ai' || mode === 'local') && (
            <div className="space-y-3 p-4 bg-gradient-to-br from-slate-700/60 to-slate-800/60 rounded-xl border border-slate-600/30">
              <Label className="flex items-center gap-2 text-white font-semibold text-lg">
                <Crown className="w-5 h-5 text-yellow-400" />
                Набор фигур
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.values(PIECE_SETS).map((set) => (
                  <button
                    key={set.id}
                    onClick={() => setPieceSet(set.id)}
                    className={`relative p-3 rounded-xl transition-all duration-300 text-center group ${
                      pieceSet === set.id 
                        ? 'ring-2 ring-yellow-400 bg-gradient-to-br from-slate-600 to-slate-700 scale-[1.02] shadow-lg shadow-yellow-500/20' 
                        : 'hover:bg-slate-600/50 bg-slate-700/30 border border-slate-600/30 hover:border-yellow-500/30'
                    }`}
                  >
                    {/* Premium badge */}
                    {set.isPremium && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-xs text-black font-bold px-2 py-0.5 rounded-full shadow-lg">
                        ★ PRO
                      </div>
                    )}
                    
                    {/* Piece preview */}
                    <div className="flex items-center justify-center gap-1 h-16 mb-2">
                      <div className="transform transition-transform group-hover:scale-110">
                        <ChessPiece3D piece={PREVIEW_KING} size={40} pieceSetId={set.id} />
                      </div>
                    </div>
                    
                    <div className="font-semibold text-white text-sm">
                      {set.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Выбор скина доски */}
          {(mode === 'ai' || mode === 'local') && (
            <div className="space-y-3 p-4 bg-gradient-to-br from-slate-700/60 to-slate-800/60 rounded-xl border border-slate-600/30">
              <Label className="flex items-center gap-2 text-white font-semibold text-lg">
                <Palette className="w-5 h-5 text-purple-400" />
                Оформление доски
              </Label>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {Object.values(BOARD_SKINS).map((skin) => (
                  <button
                    key={skin.id}
                    onClick={() => setBoardSkin(skin.id)}
                    className={`relative rounded-xl overflow-hidden transition-all duration-300 group ${
                      boardSkin === skin.id 
                        ? 'ring-2 ring-white scale-105 shadow-lg shadow-white/20' 
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {/* Mini board preview */}
                    <div className="w-full aspect-square relative">
                      {/* 2x2 mini board pattern */}
                      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                        <div style={{ backgroundColor: skin.lightSquare }} />
                        <div style={{ backgroundColor: skin.darkSquare }} />
                        <div style={{ backgroundColor: skin.darkSquare }} />
                        <div style={{ backgroundColor: skin.lightSquare }} />
                      </div>
                      
                      {/* Glossy overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20" />
                      
                      {/* Selected indicator */}
                      {boardSkin === skin.id && (
                        <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Border frame effect */}
                    <div 
                      className="absolute inset-0 border-2 rounded-xl pointer-events-none"
                      style={{ borderColor: skin.border + '60' }}
                    />
                    
                    {/* Name label */}
                    <span className="absolute bottom-0 left-0 right-0 text-xs text-white font-medium bg-gradient-to-t from-black/80 to-transparent py-2 text-center">
                      {skin.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Настройки для AI */}
          {mode === 'ai' && (
            <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg">
              <h3 className="font-semibold text-lg text-white">Настройки ИИ</h3>
              
              <div className="space-y-2">
                <Label className="text-slate-200">Сложность</Label>
                <Select value={aiDifficulty} onValueChange={(v) => setAiDifficulty(v as AIDifficulty)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">🟢 Лёгкий</SelectItem>
                    <SelectItem value="medium">🟡 Средний</SelectItem>
                    <SelectItem value="hard">🔴 Сложный</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Играть за</Label>
                <RadioGroup 
                  value={playerColor} 
                  onValueChange={(v) => setPlayerColor(v as PieceColor)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="w" id="white" className="border-slate-500" />
                    <Label htmlFor="white" className="cursor-pointer text-slate-200">⚪ Белые</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="b" id="black" className="border-slate-500" />
                    <Label htmlFor="black" className="cursor-pointer text-slate-200">⚫ Чёрные</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-200">
                  <Clock className="w-4 h-4" />
                  Контроль времени
                </Label>
                <Select 
                  value={timeControl.toString()} 
                  onValueChange={(v) => setTimeControl(parseInt(v))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value.toString()}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleStartAIGame} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Начать игру
              </Button>
            </div>
          )}

          {/* Настройки для локального мультиплеера */}
          {mode === 'local' && (
            <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg">
              <h3 className="font-semibold text-lg text-white">Игра вдвоём</h3>
              <p className="text-sm text-slate-400">
                Два игрока делают ходы по очереди на одном устройстве. Белые ходят первыми.
              </p>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-200">
                  <Clock className="w-4 h-4" />
                  Контроль времени
                </Label>
                <Select 
                  value={timeControl.toString()} 
                  onValueChange={(v) => setTimeControl(parseInt(v))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value.toString()}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleStartLocalGame} 
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Начать игру
              </Button>
            </div>
          )}

          {/* Настройки для онлайн мультиплеера */}
          {mode === 'online' && (
            <div className="space-y-5 p-5 bg-gradient-to-br from-slate-700/60 to-slate-800/60 rounded-xl border border-slate-600/30">
              <h3 className="font-semibold text-xl text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                Онлайн игра
              </h3>
              <p className="text-sm text-slate-400">
                Создайте комнату и поделитесь кодом с другом, или присоединитесь к существующей.
              </p>
              
              <div className="space-y-2">
                <Label className="text-slate-200">Ваше имя</Label>
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Введите имя..."
                  maxLength={20}
                  className="bg-slate-700/50 border-slate-600/50 placeholder:text-slate-500 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-200">
                  <Clock className="w-4 h-4" />
                  Контроль времени
                </Label>
                <Select 
                  value={timeControl.toString()} 
                  onValueChange={(v) => setTimeControl(parseInt(v))}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value.toString()}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Выбор набора фигур для онлайн */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-white font-semibold">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  Набор фигур
                </Label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {Object.values(PIECE_SETS).map((set) => (
                    <button
                      key={set.id}
                      onClick={() => setPieceSet(set.id)}
                      className={`relative p-2 rounded-xl transition-all duration-300 text-center group ${
                        pieceSet === set.id 
                          ? 'ring-2 ring-yellow-400 bg-gradient-to-br from-slate-600 to-slate-700 scale-[1.02] shadow-lg shadow-yellow-500/20' 
                          : 'hover:bg-slate-600/50 bg-slate-700/30 border border-slate-600/30'
                      }`}
                    >
                      {set.isPremium && (
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-[8px] text-black font-bold px-1.5 py-0.5 rounded-full">
                          ★
                        </div>
                      )}
                      <div className="flex items-center justify-center h-10">
                        <ChessPiece3D piece={PREVIEW_KING} size={28} pieceSetId={set.id} />
                      </div>
                      <div className="text-xs font-semibold text-white">{set.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Выбор скина доски для онлайн */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-white font-semibold">
                  <Palette className="w-5 h-5 text-purple-400" />
                  Оформление доски
                </Label>
                <div className="grid grid-cols-5 md:grid-cols-6 gap-2">
                  {Object.values(BOARD_SKINS).map((skin) => (
                    <button
                      key={skin.id}
                      onClick={() => setBoardSkin(skin.id)}
                      className={`relative rounded-lg overflow-hidden transition-all duration-200 ${
                        boardSkin === skin.id 
                          ? 'ring-2 ring-white scale-105 shadow-lg shadow-white/20' 
                          : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="w-full aspect-square grid grid-cols-2 grid-rows-2">
                        <div style={{ backgroundColor: skin.lightSquare }} />
                        <div style={{ backgroundColor: skin.darkSquare }} />
                        <div style={{ backgroundColor: skin.darkSquare }} />
                        <div style={{ backgroundColor: skin.lightSquare }} />
                      </div>
                      <span className="absolute bottom-0 left-0 right-0 text-[9px] text-white font-medium bg-black/60 text-center py-0.5">
                        {skin.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={handleCreateRoom} 
                  disabled={!playerName.trim() || isConnecting}
                  className="h-20 bg-purple-600 hover:bg-purple-700 flex-col"
                >
                  {isConnecting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Share2 className="w-6 h-6 mb-1" />
                      <span className="font-semibold">Создать комнату</span>
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setShowJoinForm(!showJoinForm)} 
                  disabled={!playerName.trim() || isConnecting}
                  className="h-20 bg-slate-700 border-slate-600 hover:bg-slate-600 flex-col"
                >
                  <ArrowRight className="w-6 h-6 mb-1" />
                  <span className="font-semibold">Войти по коду</span>
                </Button>
              </div>

              {showJoinForm && (
                <div className="flex gap-2 mt-4">
                  <Input
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="Код комнаты (например: ABC123)"
                    maxLength={6}
                    className="text-center uppercase tracking-wider font-mono text-lg bg-slate-700 border-slate-600 placeholder:text-slate-500"
                  />
                  <Button 
                    onClick={handleJoinRoom}
                    disabled={roomId.length < 4 || isConnecting}
                    className="bg-purple-600 hover:bg-purple-700 px-6"
                  >
                    {isConnecting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Войти'
                    )}
                  </Button>
                </div>
              )}

              {isConnecting && (
                <div className="text-center text-sm text-slate-400 animate-pulse">
                  Подключение...
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default GameModeSelect;
