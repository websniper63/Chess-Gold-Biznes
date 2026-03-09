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
import { GameMode, AIDifficulty, GameSettings, PieceColor, BoardSkinId, PieceSetId, BOARD_SKINS, PIECE_SETS } from '@/lib/chess';
import { 
  Bot, 
  Users, 
  Globe, 
  Play, 
  ArrowRight,
  Clock,
  Palette,
  Crown
} from 'lucide-react';

interface GameModeSelectProps {
  onStartGame: (settings: GameSettings & { boardSkin?: BoardSkinId; pieceSet?: PieceSetId }) => void;
  onCreateRoom: (playerName: string, timeControl: number, boardSkin: BoardSkinId) => void;
  onJoinRoom: (roomId: string, playerName: string) => void;
  isConnecting?: boolean;
}

export function GameModeSelect({ 
  onStartGame, 
  onCreateRoom, 
  onJoinRoom,
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
      onCreateRoom(playerName.trim(), timeControl, boardSkin);
    }
  };

  const handleJoinRoom = () => {
    if (playerName.trim() && roomId.trim()) {
      onJoinRoom(roomId.trim().toUpperCase(), playerName.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            <span className="text-4xl">♔</span>
            Шахматы
            <span className="text-4xl">♚</span>
          </CardTitle>
          <CardDescription className="text-lg text-slate-300">
            Выберите режим игры и начните партию
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Выбор режима */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={mode === 'ai' ? 'default' : 'outline'}
              className={`h-24 flex-col gap-2 ${mode === 'ai' ? 'ring-2 ring-blue-500 bg-blue-600' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
              onClick={() => setMode('ai')}
            >
              <Bot className="w-8 h-8" />
              <span className="font-semibold">Против ИИ</span>
            </Button>
            
            <Button
              variant={mode === 'local' ? 'default' : 'outline'}
              className={`h-24 flex-col gap-2 ${mode === 'local' ? 'ring-2 ring-green-500 bg-green-600' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
              onClick={() => setMode('local')}
            >
              <Users className="w-8 h-8" />
              <span className="font-semibold">Вдвоём</span>
            </Button>
            
            <Button
              variant={mode === 'online' ? 'default' : 'outline'}
              className={`h-24 flex-col gap-2 ${mode === 'online' ? 'ring-2 ring-purple-500 bg-purple-600' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
              onClick={() => setMode('online')}
            >
              <Globe className="w-8 h-8" />
              <span className="font-semibold">Онлайн</span>
            </Button>
          </div>

          {/* Выбор набора фигур */}
          {(mode === 'ai' || mode === 'local') && (
            <div className="space-y-3 p-4 bg-slate-700/50 rounded-lg">
              <Label className="flex items-center gap-2 text-white font-semibold">
                <Crown className="w-5 h-5" />
                Набор фигур
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.values(PIECE_SETS).map((set) => (
                  <button
                    key={set.id}
                    onClick={() => setPieceSet(set.id)}
                    className={`relative p-3 rounded-lg transition-all duration-200 text-left ${
                      pieceSet === set.id 
                        ? 'ring-2 ring-yellow-500 bg-slate-600' 
                        : 'hover:bg-slate-600/70 bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">♔</span>
                      <div>
                        <div className="text-sm font-semibold text-white flex items-center gap-1">
                          {set.name}
                          {set.isPremium && (
                            <span className="text-yellow-400 text-xs">★</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 truncate">{set.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Выбор скина доски */}
          {(mode === 'ai' || mode === 'local') && (
            <div className="space-y-3 p-4 bg-slate-700/50 rounded-lg">
              <Label className="flex items-center gap-2 text-white font-semibold">
                <Palette className="w-5 h-5" />
                Оформление доски
              </Label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {Object.values(BOARD_SKINS).map((skin) => (
                  <button
                    key={skin.id}
                    onClick={() => setBoardSkin(skin.id)}
                    className={`relative rounded-lg overflow-hidden transition-all duration-200 ${
                      boardSkin === skin.id 
                        ? 'ring-2 ring-white scale-105' 
                        : 'hover:scale-105 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-full aspect-square flex">
                      <div className="w-1/2 h-full" style={{ backgroundColor: skin.lightSquare }} />
                      <div className="w-1/2 h-full" style={{ backgroundColor: skin.darkSquare }} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-1 left-1 right-1 text-xs text-white font-medium truncate">
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
            <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg">
              <h3 className="font-semibold text-lg text-white">Онлайн игра</h3>
              
              <div className="space-y-2">
                <Label className="text-slate-200">Ваше имя</Label>
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Введите имя..."
                  maxLength={20}
                  className="bg-slate-700 border-slate-600 placeholder:text-slate-500"
                />
              </div>

              {/* Выбор скина для создателя комнаты */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-slate-200 font-semibold">
                  <Palette className="w-5 h-5" />
                  Оформление доски (для создателя)
                </Label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {Object.values(BOARD_SKINS).map((skin) => (
                    <button
                      key={skin.id}
                      onClick={() => setBoardSkin(skin.id)}
                      className={`relative rounded-lg overflow-hidden transition-all duration-200 ${
                        boardSkin === skin.id 
                          ? 'ring-2 ring-white scale-105' 
                          : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="w-full aspect-square flex">
                        <div className="w-1/2 h-full" style={{ backgroundColor: skin.lightSquare }} />
                        <div className="w-1/2 h-full" style={{ backgroundColor: skin.darkSquare }} />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute bottom-1 left-1 right-1 text-xs text-white font-medium truncate">
                        {skin.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Выбор набора фигур */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-slate-200 font-semibold">
                  <Crown className="w-5 h-5" />
                  Набор фигур (для создателя)
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(PIECE_SETS).map((set) => (
                    <button
                      key={set.id}
                      onClick={() => setPieceSet(set.id)}
                      className={`relative p-2 rounded-lg transition-all duration-200 text-left ${
                        pieceSet === set.id 
                          ? 'ring-2 ring-yellow-500 bg-slate-600' 
                          : 'hover:bg-slate-600/70 bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">♔</span>
                        <div>
                          <div className="text-sm font-semibold text-white flex items-center gap-1">
                            {set.name}
                            {set.isPremium && (
                              <span className="text-yellow-400 text-xs">★</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
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

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={handleCreateRoom} 
                  disabled={!playerName.trim() || isConnecting}
                  className="h-16 bg-purple-600 hover:bg-purple-700"
                >
                  <div className="flex flex-col items-center gap-1">
                    <Play className="w-5 h-5" />
                    <span>Создать комнату</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setShowJoinForm(!showJoinForm)} 
                  disabled={!playerName.trim() || isConnecting}
                  className="h-16 bg-slate-700 border-slate-600 hover:bg-slate-600"
                >
                  <div className="flex flex-col items-center gap-1">
                    <ArrowRight className="w-5 h-5" />
                    <span>Войти в комнату</span>
                  </div>
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
                    disabled={roomId.length !== 6 || isConnecting}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Войти
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
