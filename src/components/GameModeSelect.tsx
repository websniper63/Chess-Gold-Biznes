'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { GameMode, AIDifficulty, GameSettings, PieceColor, BoardSkinId, PieceSetId, BOARD_SKINS, PIECE_SETS } from '@/lib/chess';
import { ChessPiece3D } from '@/components/ChessPiece';
import { cn } from '@/lib/utils';
import { 
  Bot, 
  Users, 
  Globe, 
  Play,
  Clock,
  Crown,
  Settings,
  ChevronRight,
  Loader2
} from 'lucide-react';

// Sample pieces for preview
const PREVIEW_KING = { type: 'k' as const, color: 'w' as const };

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
  const [mode, setMode] = useState<GameMode>('ai');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('medium');
  const [playerColor, setPlayerColor] = useState<PieceColor>('w');
  const [timeControl, setTimeControl] = useState(600);
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

  const gameModes = [
    { id: 'ai' as const, icon: Bot, label: 'Против ИИ', color: 'blue', description: 'Играйте против компьютера' },
    { id: 'local' as const, icon: Users, label: 'Вдвоём', color: 'green', description: 'На одном устройстве' },
    { id: 'online' as const, icon: Globe, label: 'Онлайн', color: 'purple', description: 'С друзьями по сети' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Логотип и заголовок */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 mb-4 shadow-lg shadow-amber-500/30">
          <span className="text-4xl">♔</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Шахматы</h1>
        <p className="text-slate-400">Классическая игра для всех</p>
      </div>

      {/* Выбор режима игры */}
      <div className="space-y-4 mb-8">
        <Label className="text-sm font-medium text-slate-300 px-1">Выберите режим</Label>
        <div className="grid grid-cols-3 gap-3">
          {gameModes.map((gm) => {
            const isActive = mode === gm.id;
            return (
              <button
                key={gm.id}
                onClick={() => setMode(gm.id)}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
                  "border-2",
                  isActive
                    ? "bg-slate-700 border-blue-500 shadow-lg shadow-blue-500/20"
                    : "bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800"
                )}
              >
                <gm.icon className={cn(
                  "w-8 h-8",
                  isActive ? "text-blue-400" : "text-slate-400"
                )} />
                <span className={cn(
                  "font-semibold text-sm",
                  isActive ? "text-white" : "text-slate-300"
                )}>
                  {gm.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Настройки для AI режима */}
      {mode === 'ai' && (
        <div className="space-y-6 p-5 bg-slate-800/50 rounded-2xl border border-slate-700">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-slate-300">Сложность</Label>
              <Select value={aiDifficulty} onValueChange={(v) => setAiDifficulty(v as AIDifficulty)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="easy">🟢 Лёгкий</SelectItem>
                  <SelectItem value="medium">🟡 Средний</SelectItem>
                  <SelectItem value="hard">🔴 Сложный</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm text-slate-300">Играть за</Label>
              <RadioGroup 
                value={playerColor} 
                onValueChange={(v) => setPlayerColor(v as PieceColor)}
                className="flex gap-2"
              >
                <div 
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer transition-colors",
                    playerColor === 'w' 
                      ? "bg-white text-slate-900" 
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  )}
                  onClick={() => setPlayerColor('w')}
                >
                  <span className="text-lg">♔</span>
                  <span className="font-medium">Белые</span>
                </div>
                <div 
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer transition-colors",
                    playerColor === 'b' 
                      ? "bg-slate-900 text-white border border-slate-600" 
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  )}
                  onClick={() => setPlayerColor('b')}
                >
                  <span className="text-lg">♚</span>
                  <span className="font-medium">Чёрные</span>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm text-slate-300">
              <Clock className="w-4 h-4" />
              Контроль времени
            </Label>
            <Select 
              value={timeControl.toString()} 
              onValueChange={(v) => setTimeControl(parseInt(v))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
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
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30"
          >
            <Play className="w-5 h-5 mr-2" />
            Начать игру
          </Button>
        </div>
      )}

      {/* Настройки для локального режима */}
      {mode === 'local' && (
        <div className="space-y-6 p-5 bg-slate-800/50 rounded-2xl border border-slate-700">
          <div className="text-center py-4">
            <Users className="w-12 h-12 mx-auto text-emerald-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">Игра вдвоём</h3>
            <p className="text-sm text-slate-400">
              Два игрока делают ходы по очереди на одном устройстве
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm text-slate-300">
              <Clock className="w-4 h-4" />
              Контроль времени
            </Label>
            <Select 
              value={timeControl.toString()} 
              onValueChange={(v) => setTimeControl(parseInt(v))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
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
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/30"
          >
            <Play className="w-5 h-5 mr-2" />
            Начать игру
          </Button>
        </div>
      )}

      {/* Настройки для онлайн режима */}
      {mode === 'online' && (
        <div className="space-y-5 p-5 bg-slate-800/50 rounded-2xl border border-slate-700">
          <div className="space-y-2">
            <Label className="text-sm text-slate-300">Ваше имя</Label>
            <Input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Введите имя..."
              maxLength={20}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm text-slate-300">
              <Clock className="w-4 h-4" />
              Контроль времени
            </Label>
            <Select 
              value={timeControl.toString()} 
              onValueChange={(v) => setTimeControl(parseInt(v))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {timeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value.toString()}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleCreateRoom} 
              disabled={!playerName.trim() || isConnecting}
              className="h-16 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/30"
            >
              {isConnecting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">+</span>
                  <span className="text-xs">Создать комнату</span>
                </div>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setShowJoinForm(!showJoinForm)} 
              disabled={!playerName.trim() || isConnecting}
              className="h-16 bg-slate-700 border-slate-600 hover:bg-slate-600 text-white font-semibold rounded-xl"
            >
              <div className="flex flex-col items-center gap-1">
                <ChevronRight className="w-5 h-5" />
                <span className="text-xs">Войти по коду</span>
              </div>
            </Button>
          </div>

          {showJoinForm && (
            <div className="flex gap-2 pt-2">
              <Input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="Код комнаты..."
                maxLength={6}
                className="text-center uppercase tracking-wider font-mono text-lg bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
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
        </div>
      )}

      {/* Выбор стиля (общий для всех режимов) */}
      {(mode === 'ai' || mode === 'local') && (
        <div className="mt-6 space-y-4">
          {/* Выбор набора фигур */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm text-slate-300 px-1">
              <Crown className="w-4 h-4 text-amber-400" />
              Набор фигур
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(PIECE_SETS).slice(0, 4).map((set) => (
                <button
                  key={set.id}
                  onClick={() => setPieceSet(set.id)}
                  className={cn(
                    "relative flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200",
                    "border-2",
                    pieceSet === set.id 
                      ? "bg-slate-700 border-amber-500 shadow-lg shadow-amber-500/20" 
                      : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                  )}
                >
                  {set.isPremium && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                      <Crown className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  <ChessPiece3D piece={PREVIEW_KING} size={28} pieceSetId={set.id} />
                  <span className="text-xs text-slate-300">{set.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Выбор скина доски */}
          <div className="space-y-2">
            <Label className="text-sm text-slate-300 px-1">Оформление доски</Label>
            <div className="grid grid-cols-5 gap-2">
              {Object.values(BOARD_SKINS).slice(0, 5).map((skin) => (
                <button
                  key={skin.id}
                  onClick={() => setBoardSkin(skin.id)}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden transition-all duration-200",
                    "border-2",
                    boardSkin === skin.id 
                      ? "border-blue-500 shadow-lg shadow-blue-500/20 scale-105" 
                      : "border-slate-700 hover:border-slate-600"
                  )}
                >
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                    <div style={{ backgroundColor: skin.lightSquare }} />
                    <div style={{ backgroundColor: skin.darkSquare }} />
                    <div style={{ backgroundColor: skin.darkSquare }} />
                    <div style={{ backgroundColor: skin.lightSquare }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameModeSelect;
