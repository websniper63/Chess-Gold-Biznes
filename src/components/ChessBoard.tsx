'use client';

import { memo, useState, useEffect } from 'react';
import { 
  Board, 
  Position, 
  Piece,
  Move,
  positionToAlgebraic,
  BoardSkin,
  BoardSkinId,
  PieceSetId,
  BOARD_SKINS
} from '@/lib/chess';
import { ChessPiece3D } from './ChessPiece';
import { cn } from '@/lib/utils';

interface ChessBoardProps {
  board: Board;
  currentTurn: 'w' | 'b';
  selectedSquare: Position | null;
  legalMoves: Position[];
  lastMove?: Move | null;
  playerColor?: 'w' | 'b';
  isCheck?: boolean;
  onSquareClick: (pos: Position) => void;
  isFlipped?: boolean;
  skinId?: BoardSkinId;
  pieceSetId?: PieceSetId;
}

// Премиальная крупная клетка доски
function BoardSquare({ 
  piece, 
  position, 
  isSelected, 
  isLegalMove,
  isLastMove,
  isCheckSquare,
  onClick,
  squareSize,
  skin,
  pieceSetId,
}: { 
  piece: Piece | null;
  position: Position;
  isSelected: boolean;
  isLegalMove: boolean;
  isLastMove: boolean;
  isCheckSquare: boolean;
  onClick: () => void;
  squareSize: number;
  skin: BoardSkin;
  pieceSetId: PieceSetId;
}) {
  const isLight = (position.row + position.col) % 2 === 0;
  
  // Определяем цвет клетки с реалистичными эффектами
  let bgColor: string;
  if (isCheckSquare) {
    bgColor = isLight ? '#ff5555' : '#cc3333';
  } else if (isSelected) {
    bgColor = isLight ? '#fff176' : '#ffeb3b';
  } else if (isLastMove) {
    bgColor = isLight ? '#c5e1a5' : '#9ccc65';
  } else {
    bgColor = isLight ? skin.lightSquare : skin.darkSquare;
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-end justify-center',
        'transition-all duration-150 ease-out',
        'hover:brightness-110',
        'active:scale-[0.98]',
        'group'
      )}
      style={{ 
        width: squareSize, 
        height: squareSize,
        background: bgColor,
        boxShadow: `
          inset 0 2px 0 ${isLight ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'},
          inset 0 -3px 6px rgba(0,0,0,0.15),
          inset 2px 0 0 ${isLight ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.15)'},
          inset -2px 0 0 ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.25)'}
        `,
      }}
    >
      {/* Реалистичная текстура клетки */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLight 
            ? `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 3px,
                rgba(0,0,0,0.015) 3px,
                rgba(0,0,0,0.015) 6px
              )`
            : `repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 4px,
                rgba(0,0,0,0.025) 4px,
                rgba(0,0,0,0.025) 8px
              )`,
        }}
      />
      
      {/* Глянцевый блик сверху-слева */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            135deg,
            ${isLight ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)'} 0%,
            transparent 35%,
            transparent 65%,
            ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.15)'} 100%
          )`,
        }}
      />

      {/* Индикатор возможного хода (пустая клетка) */}
      {isLegalMove && !piece && (
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ 
            width: squareSize * 0.32, 
            height: squareSize * 0.32,
            background: `radial-gradient(circle, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.12) 100%)`,
            boxShadow: '0 3px 8px rgba(0,0,0,0.25)',
          }}
        />
      )}
      
      {/* Индикатор взятия */}
      {isLegalMove && piece && (
        <div 
          className="absolute inset-2 pointer-events-none"
          style={{
            border: `5px solid rgba(220,50,50,0.6)`,
            borderRadius: '50%',
            boxShadow: '0 0 15px rgba(220,50,50,0.4), inset 0 0 10px rgba(220,50,50,0.2)',
          }}
        />
      )}

      {/* Выбранная клетка - свечение */}
      {isSelected && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,100,0.35) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Фигура - с запасом места по высоте */}
      {piece && (
        <div 
          className="relative z-10 flex items-end justify-center overflow-visible"
          style={{
            width: squareSize,
            height: squareSize * 1.3,
            marginTop: -squareSize * 0.3,
            marginBottom: -2,
            transform: isSelected ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
            transition: 'transform 0.15s ease-out',
            filter: isLastMove 
              ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))' 
              : isSelected 
                ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))'
                : 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))',
          }}
        >
          <ChessPiece3D piece={piece} size={squareSize * 0.88} pieceSetId={pieceSetId} />
        </div>
      )}
      
      {/* Шах - пульсация */}
      {isCheckSquare && (
        <div 
          className="absolute inset-0 pointer-events-none animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(255,0,0,0.45) 0%, transparent 60%)',
          }}
        />
      )}
    </button>
  );
}

function ChessBoardComponent({
  board,
  currentTurn,
  selectedSquare,
  legalMoves,
  lastMove,
  playerColor = 'w',
  isCheck = false,
  onSquareClick,
  isFlipped = false,
  skinId = 'classic',
  pieceSetId = 'fantasy'
}: ChessBoardProps) {
  const [squareSize, setSquareSize] = useState(75);
  const skin = BOARD_SKINS[skinId];
  
  // Адаптивный размер - делаем доску МАКСИМАЛЬНО большой
  useEffect(() => {
    const calculateSize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Минимальные отступы для максимального размера доски
      const maxWidth = windowWidth - 40; // минимальные отступы по бокам
      const maxHeight = windowHeight - 180; // отступы для UI сверху/снизу
      
      // Берём меньший размер, но минимум 55px на клетку
      const maxSquareByWidth = Math.floor(maxWidth / 8);
      const maxSquareByHeight = Math.floor(maxHeight / 8);
      
      let size = Math.min(maxSquareByWidth, maxSquareByHeight);
      // Увеличиваем лимит для более крупных фигур
      size = Math.max(55, Math.min(100, size));
      
      setSquareSize(size);
    };
    
    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, []);
  
  // Определяем, нужно ли перевернуть доску
  const flipBoard = isFlipped || playerColor === 'b';
  
  // Генерация строк и колонок
  const rows = flipBoard ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
  const cols = flipBoard ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  
  // Найдем позицию короля для подсветки шаха
  let checkKingPos: Position | null = null;
  if (isCheck) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === currentTurn) {
          checkKingPos = { row: r, col: c };
          break;
        }
      }
      if (checkKingPos) break;
    }
  }
  
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  const displayFiles = flipBoard ? [...files].reverse() : files;
  const displayRanks = flipBoard ? [...ranks].reverse() : ranks;

  const boardWidth = squareSize * 8;
  const borderWidth = Math.max(16, squareSize * 0.22);
  
  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Заголовок с координатами колонок (сверху) */}
      <div 
        className="flex mb-1"
        style={{ 
          marginLeft: borderWidth + 20,
          width: boardWidth,
        }}
      >
        {displayFiles.map((file) => (
          <span 
            key={file} 
            className="flex items-center justify-center font-bold"
            style={{ 
              width: squareSize,
              height: 22,
              fontSize: squareSize * 0.2,
              color: skin.border,
              textShadow: '0 1px 3px rgba(255,255,255,0.3)',
            }}
          >
            {file}
          </span>
        ))}
      </div>
      
      <div className="flex items-center">
        {/* Координаты рядов (слева) */}
        <div 
          className="flex flex-col mr-1"
          style={{ height: boardWidth }}
        >
          {displayRanks.map((rank) => (
            <span 
              key={rank} 
              className="flex items-center justify-center font-bold"
              style={{ 
                height: squareSize,
                width: borderWidth + 16,
                fontSize: squareSize * 0.2,
                color: skin.border,
                textShadow: '0 1px 3px rgba(255,255,255,0.3)',
              }}
            >
              {rank}
            </span>
          ))}
        </div>
        
        {/* Премиальная доска на столе */}
        <div 
          className="relative"
          style={{
            perspective: '1400px',
          }}
        >
          {/* Глубокая тень под доской */}
          <div 
            className="absolute -bottom-10 left-6 right-6 h-12 rounded-2xl"
            style={{
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, transparent 70%)',
              filter: 'blur(12px)',
            }}
          />
          
          {/* Роскошный стол под доской */}
          <div 
            className="absolute -inset-12 rounded-3xl"
            style={{
              background: `
                linear-gradient(160deg, 
                  ${skin.tableColor} 0%, 
                  ${skin.tableAccent} 50%,
                  #1a1a1a 100%
                )
              `,
              boxShadow: `
                inset 0 3px 15px rgba(255,255,255,0.08),
                inset 0 -3px 15px rgba(0,0,0,0.4),
                0 35px 70px -20px rgba(0,0,0,0.6)
              `,
            }}
          />
          
          {/* Деревянная/кожаная текстура стола */}
          <div 
            className="absolute -inset-12 rounded-3xl pointer-events-none overflow-hidden"
            style={{
              background: `
                repeating-linear-gradient(
                  95deg,
                  transparent,
                  transparent 30px,
                  rgba(255,255,255,0.015) 30px,
                  rgba(255,255,255,0.015) 60px
                )
              `,
            }}
          />
          
          {/* Отражение стола (пол) */}
          <div 
            className="absolute -bottom-24 -left-12 -right-12 h-32 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)`,
              filter: 'blur(2px)',
            }}
          />
          
          {/* Рамка доски (премиальная) */}
          <div 
            className="relative rounded-xl overflow-visible"
            style={{
              width: boardWidth + borderWidth * 2,
              height: boardWidth + borderWidth * 2,
              background: `
                linear-gradient(145deg,
                  #c9a227 0%,
                  #d4af37 15%,
                  #b8941f 35%,
                  #9a7b15 50%,
                  #b8941f 65%,
                  #d4af37 85%,
                  #c9a227 100%
                )
              `,
              padding: borderWidth,
              boxShadow: `
                0 25px 50px -15px rgba(0,0,0,0.5),
                0 15px 30px -10px rgba(0,0,0,0.35),
                inset 0 3px 8px rgba(255,255,255,0.35),
                inset 0 -3px 8px rgba(0,0,0,0.25),
                inset 6px 0 12px rgba(255,255,255,0.15),
                inset -6px 0 12px rgba(0,0,0,0.15)
              `,
            }}
          >
            {/* Внутренняя тень рамки */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-xl"
              style={{
                boxShadow: `
                  inset 6px 6px 12px rgba(0,0,0,0.25),
                  inset -3px -3px 6px rgba(255,255,255,0.12)
                `,
              }}
            />
            
            {/* Угловые золотые украшения */}
            {[[0, 0], [0, boardWidth + borderWidth * 2 - 6], [boardWidth + borderWidth * 2 - 6, 0], [boardWidth + borderWidth * 2 - 6, boardWidth + borderWidth * 2 - 6]].map(([x, y], i) => (
              <div 
                key={i}
                className="absolute rounded-full"
                style={{
                  left: x,
                  top: y,
                  width: 10,
                  height: 10,
                  background: 'radial-gradient(circle at 30% 30%, #fff8dc 0%, #ffd700 40%, #b8860b 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.3)',
                }}
              />
            ))}
            
            {/* Игровая поверхность - overflow-visible для фигур */}
            <div 
              className="relative rounded-lg overflow-visible"
              style={{
                width: boardWidth,
                height: boardWidth,
                boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.35)',
              }}
            >
              {/* Сетка доски */}
              <div 
                className="grid grid-cols-8"
                style={{ width: boardWidth, height: boardWidth }}
              >
                {rows.map(row => 
                  cols.map(col => {
                    const piece = board[row][col];
                    const position: Position = { row, col };
                    const isSelected = selectedSquare?.row === row && selectedSquare?.col === col;
                    const isLegalMove = legalMoves.some(m => m.row === row && m.col === col);
                    const isLastMove = lastMove && (
                      (lastMove.from.row === row && lastMove.from.col === col) ||
                      (lastMove.to.row === row && lastMove.to.col === col)
                    );
                    const isCheckSquare = checkKingPos?.row === row && checkKingPos?.col === col;
                    
                    return (
                      <BoardSquare
                        key={`${row}-${col}`}
                        piece={piece}
                        position={position}
                        isSelected={isSelected}
                        isLegalMove={isLegalMove}
                        isLastMove={isLastMove}
                        isCheckSquare={isCheckSquare}
                        onClick={() => onSquareClick(position)}
                        squareSize={squareSize}
                        skin={skin}
                        pieceSetId={pieceSetId}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Координаты рядов (справа) */}
        <div 
          className="flex flex-col ml-1"
          style={{ height: boardWidth }}
        >
          {displayRanks.map((rank) => (
            <span 
              key={rank} 
              className="flex items-center justify-center font-bold"
              style={{ 
                height: squareSize,
                width: borderWidth + 16,
                fontSize: squareSize * 0.2,
                color: skin.border,
                textShadow: '0 1px 3px rgba(255,255,255,0.3)',
              }}
            >
              {rank}
            </span>
          ))}
        </div>
      </div>
      
      {/* Координаты колонок (снизу) */}
      <div 
        className="flex mt-1"
        style={{ 
          marginLeft: borderWidth + 20,
          width: boardWidth,
        }}
      >
        {displayFiles.map((file) => (
          <span 
            key={file} 
            className="flex items-center justify-center font-bold"
            style={{ 
              width: squareSize,
              height: 22,
              fontSize: squareSize * 0.2,
              color: skin.border,
              textShadow: '0 1px 3px rgba(255,255,255,0.3)',
            }}
          >
            {file}
          </span>
        ))}
      </div>
    </div>
  );
}

export const ChessBoard = memo(ChessBoardComponent);
export default ChessBoard;
