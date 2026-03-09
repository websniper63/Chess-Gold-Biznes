import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { 
  GameState, 
  Position, 
  PieceColor,
  getAllLegalMoves,
  evaluateBoard,
  makeMove
} from '@/lib/chess';

// Минимакс с альфа-бета отсечением для сложного уровня
function minimax(
  gameState: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  aiColor: PieceColor
): number {
  if (depth === 0 || gameState.gameOver) {
    return evaluateBoard(gameState.board, aiColor);
  }

  const currentColor = gameState.currentTurn;
  const moves = getAllLegalMoves(gameState, currentColor);

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newState = makeMove(gameState, move.from, move.to);
      if (newState) {
        const evalScore = minimax(newState, depth - 1, alpha, beta, false, aiColor);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newState = makeMove(gameState, move.from, move.to);
      if (newState) {
        const evalScore = minimax(newState, depth - 1, alpha, beta, true, aiColor);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
}

// Получить лучший ход с использованием минимакса
function getBestMove(gameState: GameState, aiColor: PieceColor, depth: number = 3): { from: Position; to: Position } | null {
  const moves = getAllLegalMoves(gameState, aiColor);
  
  if (moves.length === 0) return null;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const newState = makeMove(gameState, move.from, move.to);
    if (newState) {
      const score = minimax(newState, depth - 1, -Infinity, Infinity, false, aiColor);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }

  return bestMove;
}

// Получить случайный ход (для лёгкого уровня)
function getRandomMove(gameState: GameState, aiColor: PieceColor): { from: Position; to: Position } | null {
  const moves = getAllLegalMoves(gameState, aiColor);
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

// Получить ход с использованием ИИ через z-ai-web-dev-sdk
async function getAIMoveFromLLM(gameState: GameState, aiColor: PieceColor): Promise<{ from: Position; to: Position } | null> {
  try {
    const zai = await ZAI.create();
    
    // Создаём строковое представление доски
    let boardStr = 'Current board position:\n';
    boardStr += '  a b c d e f g h\n';
    for (let row = 0; row < 8; row++) {
      boardStr += `${8 - row} `;
      for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];
        if (piece) {
          const symbols: Record<string, string> = {
            'wp': '♙', 'wn': '♘', 'wb': '♗', 'wr': '♖', 'wq': '♕', 'wk': '♔',
            'bp': '♟', 'bn': '♞', 'bb': '♝', 'br': '♜', 'bq': '♛', 'bk': '♚'
          };
          boardStr += symbols[piece.color + piece.type] + ' ';
        } else {
          boardStr += '. ';
        }
      }
      boardStr += `${8 - row}\n`;
    }
    boardStr += '  a b c d e f g h\n';
    
    // История последних ходов
    const moveHistory = gameState.moveHistory.slice(-5).map(m => m.notation).join(', ');
    
    const prompt = `You are a chess AI. You are playing as ${aiColor === 'w' ? 'White' : 'Black'}.
    
${boardStr}

Move history (last 5 moves): ${moveHistory || 'None'}
Current turn: ${gameState.currentTurn === 'w' ? 'White' : 'Black'}
You are in check: ${gameState.isCheck}

Analyze the position and provide your best move in algebraic notation (e.g., "e2e4" or "g1f3" for moving from e2 to e4 or g1 to f3).
Consider:
- Material balance
- Piece development
- King safety
- Center control

Respond with ONLY the move in format "from_to" (e.g., "e2e4"). No explanation needed.`;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a chess AI. Respond only with moves in the format "e2e4" (from square to square).'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    });

    const response = completion.choices[0]?.message?.content?.trim().toLowerCase();
    
    if (response && response.length >= 4) {
      // Парсим ответ типа "e2e4"
      const fromCol = response.charCodeAt(0) - 97;
      const fromRow = 8 - parseInt(response[1]);
      const toCol = response.charCodeAt(2) - 97;
      const toRow = 8 - parseInt(response[3]);
      
      if (fromCol >= 0 && fromCol < 8 && fromRow >= 0 && fromRow < 8 &&
          toCol >= 0 && toCol < 8 && toRow >= 0 && toRow < 8) {
        const from = { row: fromRow, col: fromCol };
        const to = { row: toRow, col: toCol };
        
        // Проверяем валидность хода
        const moves = getAllLegalMoves(gameState, aiColor);
        const isValidMove = moves.some(m => 
          m.from.row === from.row && m.from.col === from.col &&
          m.to.row === to.row && m.to.col === to.col
        );
        
        if (isValidMove) {
          return { from, to };
        }
      }
    }
    
    // Fallback к минимаксу если ИИ дал невалидный ход
    return getBestMove(gameState, aiColor, 2);
    
  } catch (error) {
    console.error('Error getting AI move from LLM:', error);
    return getBestMove(gameState, aiColor, 2);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameState, difficulty, aiColor } = body as {
      gameState: GameState;
      difficulty: 'easy' | 'medium' | 'hard';
      aiColor: PieceColor;
    };

    if (!gameState || !difficulty || !aiColor) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let move: { from: Position; to: Position } | null = null;

    switch (difficulty) {
      case 'easy':
        // Лёгкий: случайные ходы
        move = getRandomMove(gameState, aiColor);
        break;
        
      case 'medium':
        // Средний: ИИ через LLM или минимакс глубины 2
        move = await getAIMoveFromLLM(gameState, aiColor);
        break;
        
      case 'hard':
        // Сложный: минимакс глубины 4
        move = getBestMove(gameState, aiColor, 4);
        break;
    }

    if (!move) {
      return NextResponse.json(
        { error: 'No legal moves available' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      move: {
        from: move.from,
        to: move.to
      }
    });
    
  } catch (error) {
    console.error('AI move error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
