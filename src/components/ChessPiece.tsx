'use client';

import { memo } from 'react';
import { Piece, PieceType, PieceColor, PieceSetId } from '@/lib/chess';

interface ChessPieceProps {
  piece: Piece;
  size?: number;
  className?: string;
  pieceSetId?: PieceSetId;
}

// ========== ФЭНТЕЗИ НАБОР ==========
function FantasyPiece({ piece, size }: { piece: Piece; size: number }) {
  const isWhite = piece.color === 'w';
  const s = size;
  
  const baseColor = isWhite 
    ? 'linear-gradient(180deg, #fff8e7 0%, #e8d5b0 30%, #c9a961 70%, #8b7355 100%)'
    : 'linear-gradient(180deg, #4a3c2a 0%, #2d2418 30%, #1a150d 70%, #0d0a07 100%)';
  
  const accentColor = isWhite 
    ? '#ffd700'
    : '#c0c0c0';
    
  const glowColor = isWhite
    ? 'rgba(255, 215, 0, 0.6)'
    : 'rgba(192, 192, 192, 0.4)';

  const renderPiece = () => {
    switch (piece.type) {
      case 'k': // Король - с большой короной и драконьими крыльями
        return (
          <svg viewBox="0 0 100 120" style={{ width: s, height: s * 1.2 }}>
            <defs>
              <linearGradient id={`kg${piece.color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? "#fff8e7" : "#5a4a3a"} />
                <stop offset="50%" stopColor={isWhite ? "#c9a961" : "#2d2418"} />
                <stop offset="100%" stopColor={isWhite ? "#8b7355" : "#1a150d"} />
              </linearGradient>
              <filter id={`shadow-k-${piece.color}`}>
                <feDropShadow dx="2" dy="4" stdDeviation="2" floodOpacity="0.4"/>
              </filter>
            </defs>
            
            {/* Крылья */}
            <path d="M15 95 Q5 70 20 55 Q25 65 30 75 Q28 85 25 95 Z" fill={`url(#kg${piece.color})`} filter={`url(#shadow-k-${piece.color})`}/>
            <path d="M85 95 Q95 70 80 55 Q75 65 70 75 Q72 85 75 95 Z" fill={`url(#kg${piece.color})`} filter={`url(#shadow-k-${piece.color})`}/>
            
            {/* Основание */}
            <ellipse cx="50" cy="110" rx="35" ry="8" fill={`url(#kg${piece.color})`} filter={`url(#shadow-k-${piece.color})`}/>
            <rect x="20" y="85" width="60" height="25" rx="5" fill={`url(#kg${piece.color})`}/>
            
            {/* Тело */}
            <path d="M30 85 Q25 60 35 45 Q50 35 65 45 Q75 60 70 85 Z" fill={`url(#kg${piece.color})`} filter={`url(#shadow-k-${piece.color})`}/>
            
            {/* Грудная пластина */}
            <path d="M40 70 L50 55 L60 70 L50 80 Z" fill={accentColor} opacity="0.8"/>
            
            {/* Голова */}
            <circle cx="50" cy="38" r="12" fill={`url(#kg${piece.color})`}/>
            
            {/* Большая корона с драгоценностями */}
            <path d="M35 35 L38 15 L45 25 L50 10 L55 25 L62 15 L65 35 Z" fill={accentColor} stroke={isWhite ? "#b8860b" : "#808080"} strokeWidth="1"/>
            
            {/* Драгоценные камни в короне */}
            <circle cx="50" cy="18" r="3" fill="#ff0000" opacity="0.9"/>
            <circle cx="42" cy="22" r="2" fill="#00ff00" opacity="0.9"/>
            <circle cx="58" cy="22" r="2" fill="#0088ff" opacity="0.9"/>
            
            {/* Свечение */}
            <circle cx="50" cy="15" r="6" fill={glowColor} opacity="0.5"/>
          </svg>
        );

      case 'q': // Ферзь - элегантная королева с крыльями бабочки
        return (
          <svg viewBox="0 0 100 120" style={{ width: s, height: s * 1.2 }}>
            <defs>
              <linearGradient id={`qg${piece.color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? "#fff8e7" : "#5a4a3a"} />
                <stop offset="50%" stopColor={isWhite ? "#c9a961" : "#2d2418"} />
                <stop offset="100%" stopColor={isWhite ? "#8b7355" : "#1a150d"} />
              </linearGradient>
            </defs>
            
            {/* Крылья бабочки/феи */}
            <ellipse cx="20" cy="55" rx="18" ry="25" fill={`url(#qg${piece.color})`} opacity="0.6" transform="rotate(-20 20 55)"/>
            <ellipse cx="80" cy="55" rx="18" ry="25" fill={`url(#qg${piece.color})`} opacity="0.6" transform="rotate(20 80 55)"/>
            
            {/* Основание */}
            <ellipse cx="50" cy="110" rx="32" ry="7" fill={`url(#qg${piece.color})`}/>
            <rect x="22" y="88" width="56" height="22" rx="8" fill={`url(#qg${piece.color})`}/>
            
            {/* Тело - платье */}
            <path d="M28 88 Q20 70 30 50 Q50 40 70 50 Q80 70 72 88 Z" fill={`url(#qg${piece.color})`}/>
            
            {/* Украшения на платье */}
            <circle cx="50" cy="65" r="4" fill={accentColor}/>
            <circle cx="40" cy="75" r="2" fill={accentColor} opacity="0.8"/>
            <circle cx="60" cy="75" r="2" fill={accentColor} opacity="0.8"/>
            
            {/* Голова */}
            <circle cx="50" cy="42" r="10" fill={`url(#qg${piece.color})`}/>
            
            {/* Корона с 5 зубцами */}
            <path d="M38 40 L40 28 L45 35 L50 22 L55 35 L60 28 L62 40 Z" fill={accentColor}/>
            
            {/* Большой бриллиант */}
            <path d="M47 25 L50 18 L53 25 L50 28 Z" fill="#fff" opacity="0.9"/>
          </svg>
        );

      case 'r': // Ладья - крепость с башнями
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1 }}>
            <defs>
              <linearGradient id={`rg${piece.color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? "#e8e8e8" : "#4a4a4a"} />
                <stop offset="100%" stopColor={isWhite ? "#a0a0a0" : "#1a1a1a"} />
              </linearGradient>
            </defs>
            
            {/* Основание-крепость */}
            <rect x="15" y="85" width="70" height="20" rx="3" fill={`url(#rg${piece.color})`}/>
            
            {/* Стены */}
            <rect x="22" y="50" width="56" height="35" fill={`url(#rg${piece.color})`}/>
            
            {/* Зубцы стен */}
            {[0, 1, 2, 3, 4].map(i => (
              <rect key={i} x={20 + i * 12} y="38" width="10" height="15" fill={`url(#rg${piece.color})`}/>
            ))}
            
            {/* Центральная башня */}
            <rect x="35" y="25" width="30" height="25" fill={`url(#rg${piece.color})`}/>
            
            {/* Зубцы башни */}
            {[0, 1, 2].map(i => (
              <rect key={i} x={35 + i * 10} y="15" width="8" height="12" fill={`url(#rg${piece.color})`}/>
            ))}
            
            {/* Ворота */}
            <path d="M42 85 L42 65 Q50 58 58 65 L58 85 Z" fill={isWhite ? "#4a3c2a" : "#8b7355"}/>
            
            {/* Окна-бойницы */}
            <rect x="42" y="32" width="5" height="8" fill={isWhite ? "#1a150d" : "#c9a961"}/>
            <rect x="53" y="32" width="5" height="8" fill={isWhite ? "#1a150d" : "#c9a961"}/>
            
            {/* Флаг */}
            <line x1="50" y1="15" x2="50" y2="5" stroke={accentColor} strokeWidth="2"/>
            <polygon points="50,5 62,10 50,15" fill="#ff4444"/>
          </svg>
        );

      case 'b': // Слон - маг с посохом
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1 }}>
            <defs>
              <linearGradient id={`bg${piece.color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? "#e8e0d0" : "#3a3a3a"} />
                <stop offset="100%" stopColor={isWhite ? "#a09888" : "#1a1a1a"} />
              </linearGradient>
              <radialGradient id={`magic${piece.color}`}>
                <stop offset="0%" stopColor="#00ffff"/>
                <stop offset="100%" stopColor="#0044ff" stopOpacity="0"/>
              </radialGradient>
            </defs>
            
            {/* Основание */}
            <ellipse cx="50" cy="100" rx="25" ry="7" fill={`url(#bg${piece.color})`}/>
            
            {/* Мантия */}
            <path d="M25 100 Q15 70 30 45 Q50 35 70 45 Q85 70 75 100 Z" fill={`url(#bg${piece.color})`}/>
            
            {/* Голова в капюшоне */}
            <ellipse cx="50" cy="42" rx="15" ry="18" fill={`url(#bg${piece.color})`}/>
            
            {/* Капюшон */}
            <path d="M32 50 Q25 35 35 22 Q50 15 65 22 Q75 35 68 50 Q50 55 32 50 Z" fill={`url(#bg${piece.color})`}/>
            
            {/* Лицо (тёмное) */}
            <ellipse cx="50" cy="42" rx="8" ry="10" fill={isWhite ? "#d4c4b0" : "#2a2a2a"}/>
            
            {/* Глаза, светящиеся */}
            <circle cx="46" cy="40" r="2" fill="#00ffff" opacity="0.9"/>
            <circle cx="54" cy="40" r="2" fill="#00ffff" opacity="0.9"/>
            
            {/* Посох */}
            <line x1="75" y1="95" x2="75" y2="25" stroke={isWhite ? "#8b4513" : "#654321"} strokeWidth="4"/>
            
            {/* Магический шар на посохе */}
            <circle cx="75" cy="22" r="8" fill={`url(#magic${piece.color})`}/>
            <circle cx="75" cy="22" r="4" fill="#fff" opacity="0.8"/>
            
            {/* Магическая аура */}
            <circle cx="75" cy="22" r="12" fill="#00ffff" opacity="0.2"/>
          </svg>
        );

      case 'n': // Конь - единорог/пегас
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1 }}>
            <defs>
              <linearGradient id={`ng${piece.color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? "#fff8f0" : "#4a4a4a"} />
                <stop offset="100%" stopColor={isWhite ? "#c9b896" : "#1a1a1a"} />
              </linearGradient>
            </defs>
            
            {/* Основание */}
            <ellipse cx="50" cy="100" rx="28" ry="8" fill={`url(#ng${piece.color})`}/>
            
            {/* Тело лошади */}
            <ellipse cx="55" cy="80" rx="20" ry="15" fill={`url(#ng${piece.color})`}/>
            
            {/* Шея */}
            <path d="M45 75 Q35 55 40 40 Q50 30 55 45 Q60 55 50 75 Z" fill={`url(#ng${piece.color})`}/>
            
            {/* Голова */}
            <ellipse cx="38" cy="38" rx="12" ry="10" fill={`url(#ng${piece.color})`} transform="rotate(-30 38 38)"/>
            
            {/* Морда */}
            <ellipse cx="28" cy="45" rx="8" ry="6" fill={`url(#ng${piece.color})`} transform="rotate(-20 28 45)"/>
            
            {/* Рог единорога */}
            <polygon points="40,28 44,8 48,28" fill={accentColor}/>
            <line x1="44" y1="8" x2="44" y2="28" stroke="#fff" strokeWidth="1" opacity="0.6"/>
            
            {/* Грива */}
            <path d="M48 35 Q60 25 55 45 Q65 40 52 55 Q62 50 48 65" stroke={isWhite ? "#c9a961" : "#666"} strokeWidth="4" fill="none"/>
            
            {/* Глаз */}
            <circle cx="35" cy="35" r="2" fill={isWhite ? "#2a2a2a" : "#c9a961"}/>
            
            {/* Уши */}
            <ellipse cx="45" cy="25" rx="3" ry="6" fill={`url(#ng${piece.color})`} transform="rotate(20 45 25)"/>
            <ellipse cx="50" cy="28" rx="3" ry="5" fill={`url(#ng${piece.color})`} transform="rotate(35 50 28)"/>
            
            {/* Крылья (опционально - пегас) */}
            <path d="M70 70 Q85 50 75 40 Q80 55 70 65" fill={`url(#ng${piece.color})`} opacity="0.7"/>
            <path d="M72 75 Q90 55 82 45 Q88 60 72 70" fill={`url(#ng${piece.color})`} opacity="0.5"/>
          </svg>
        );

      case 'p': // Пешка - маленький воин
        return (
          <svg viewBox="0 0 100 100" style={{ width: s, height: s }}>
            <defs>
              <linearGradient id={`pg${piece.color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? "#f0e6d2" : "#4a4a4a"} />
                <stop offset="100%" stopColor={isWhite ? "#a89880" : "#1a1a1a"} />
              </linearGradient>
            </defs>
            
            {/* Основание */}
            <ellipse cx="50" cy="92" rx="22" ry="6" fill={`url(#pg${piece.color})`}/>
            
            {/* Тело */}
            <path d="M30 92 Q25 70 35 55 Q50 45 65 55 Q75 70 70 92 Z" fill={`url(#pg${piece.color})`}/>
            
            {/* Голова в шлеме */}
            <circle cx="50" cy="42" r="14" fill={`url(#pg${piece.color})`}/>
            
            {/* Шлем */}
            <path d="M36 45 Q38 28 50 25 Q62 28 64 45 Q50 48 36 45 Z" fill={`url(#pg${piece.color})`}/>
            
            {/* Забрало */}
            <rect x="42" y="38" width="16" height="4" rx="2" fill={isWhite ? "#4a4a4a" : "#888"}/>
            
            {/* Глаза в щели шлема */}
            <circle cx="45" cy="42" r="1.5" fill={isWhite ? "#2a2a2a" : "#c9a961"}/>
            <circle cx="55" cy="42" r="1.5" fill={isWhite ? "#2a2a2a" : "#c9a961"}/>
            
            {/* Маленькое перо на шлеме */}
            <path d="M50 25 Q52 15 50 10 Q48 15 50 25" fill={accentColor}/>
          </svg>
        );
    }
  };

  return (
    <div style={{ width: s, height: s * 1.2, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      {renderPiece()}
    </div>
  );
}

// ========== ГЕОМЕТРИЧЕСКИЙ НАБОР ==========
function GeometricPiece({ piece, size }: { piece: Piece; size: number }) {
  const isWhite = piece.color === 'w';
  const s = size;
  
  const fillColor = isWhite ? '#f5f5f5' : '#2a2a2a';
  const strokeColor = isWhite ? '#333' : '#ccc';
  const accentColor = isWhite ? '#ffd700' : '#00bcd4';

  const renderPiece = () => {
    switch (piece.type) {
      case 'k': // Король - куб с пирамидой
        return (
          <svg viewBox="0 0 100 120" style={{ width: s, height: s * 1.2 }}>
            {/* Основание - куб */}
            <polygon points="20,110 80,110 85,85 15,85" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
            <polygon points="15,85 50,75 85,85 50,95" fill={isWhite ? '#e0e0e0' : '#3a3a3a'} stroke={strokeColor} strokeWidth="2"/>
            
            {/* Средняя часть - уменьшенный куб */}
            <polygon points="30,85 70,85 75,60 25,60" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
            <polygon points="25,60 50,50 75,60 50,70" fill={isWhite ? '#e0e0e0' : '#3a3a3a'} stroke={strokeColor} strokeWidth="2"/>
            
            {/* Верхняя пирамида */}
            <polygon points="50,50 35,25 65,25" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
            
            {/* Крест */}
            <line x1="50" y1="25" x2="50" y2="10" stroke={accentColor} strokeWidth="4"/>
            <line x1="40" y1="17" x2="60" y2="17" stroke={accentColor} strokeWidth="4"/>
          </svg>
        );

      case 'q': // Ферзь - октаэдр
        return (
          <svg viewBox="0 0 100 120" style={{ width: s, height: s * 1.2 }}>
            {/* Основание */}
            <polygon points="20,110 80,110 85,90 15,90" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
            <polygon points="15,90 50,80 85,90 50,100" fill={isWhite ? '#e0e0e0' : '#3a3a3a'} stroke={strokeColor} strokeWidth="2"/>
            
            {/* Октаэдр */}
            <polygon points="50,80 25,55 75,55" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
            <polygon points="25,55 50,20 75,55" fill={isWhite ? '#d0d0d0' : '#4a4a4a'} stroke={strokeColor} strokeWidth="2"/>
            
            {/* Верхняя вершина */}
            <polygon points="50,20 40,5 60,5" fill={accentColor} stroke={strokeColor} strokeWidth="1"/>
            
            {/* Бриллиант */}
            <polygon points="50,5 47,0 50,-5 53,0" fill="#fff" stroke={accentColor} strokeWidth="1"/>
          </svg>
        );

      case 'r': // Ладья - кубическая башня
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1 }}>
            {/* Основание */}
            <polygon points="15,105 85,105 90,85 10,85" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
            <polygon points="10,85 50,75 90,85 50,95" fill={isWhite ? '#e0e0e0' : '#3a3a3a'} stroke={strokeColor} strokeWidth="2"/>
            
            {/* Башня */}
            <polygon points="25,85 75,85 80,40 20,40" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
            <polygon points="20,40 50,30 80,40 50,50" fill={isWhite ? '#e0e0e0' : '#3a3a3a'} stroke={strokeColor} strokeWidth="2"/>
            
            {/* Зубцы */}
            {[0, 1, 2, 3].map(i => (
              <rect key={i} x={22 + i * 15} y="25" width="12" height="15" fill={fillColor} stroke={strokeColor} strokeWidth="1"/>
            ))}
            
            {/* Ворота */}
            <rect x="40" y="60" width="20" height="25" fill={isWhite ? '#333' : '#888'} rx="3"/>
          </svg>
        );

      case 'b': // Слон - конус
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1 }}>
            {/* Основание */}
            <ellipse cx="50" cy="100" rx="30" ry="8" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
            
            {/* Конус */}
            <polygon points="50,15 15,100 85,100" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
            
            {/* Линии на конусе */}
            <line x1="50" y1="15" x2="25" y2="100" stroke={strokeColor} strokeWidth="1" opacity="0.3"/>
            <line x1="50" y1="15" x2="75" y2="100" stroke={strokeColor} strokeWidth="1" opacity="0.3"/>
            
            {/* Шар на вершине */}
            <circle cx="50" cy="15" r="8" fill={accentColor} stroke={strokeColor} strokeWidth="1"/>
            
            {/* Разрез слона */}
            <ellipse cx="50" cy="55" rx="3" ry="12" fill={isWhite ? '#333' : '#888'}/>
          </svg>
        );

      case 'n': // Конь - угловатая лошадь
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1 }}>
            {/* Основание */}
            <polygon points="20,105 80,105 85,95 15,95" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
            
            {/* Тело - многоугольник */}
            <polygon points="25,95 75,95 80,70 65,60 50,70 35,60 20,70" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
            
            {/* Шея */}
            <polygon points="35,60 30,35 45,30 50,55" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
            
            {/* Голова */}
            <polygon points="30,35 20,25 15,40 30,45 45,30" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
            
            {/* Ухо */}
            <polygon points="32,25 35,15 40,25" fill={fillColor} stroke={strokeColor} strokeWidth="1"/>
            
            {/* Глаз */}
            <circle cx="25" cy="32" r="3" fill={strokeColor}/>
            
            {/* Грива */}
            <polygon points="45,30 55,20 50,50 35,60" fill={isWhite ? '#ccc' : '#555'} stroke={strokeColor} strokeWidth="1"/>
          </svg>
        );

      case 'p': // Пешка - простая пирамида
        return (
          <svg viewBox="0 0 100 100" style={{ width: s, height: s }}>
            {/* Основание */}
            <ellipse cx="50" cy="90" rx="25" ry="8" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
            
            {/* Пирамида */}
            <polygon points="50,20 25,90 75,90" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
            
            {/* Шар на вершине */}
            <circle cx="50" cy="20" r="10" fill={fillColor} stroke={strokeColor} strokeWidth="2"/>
            
            {/* Блик */}
            <circle cx="47" cy="17" r="3" fill={isWhite ? '#fff' : '#666'} opacity="0.7"/>
          </svg>
        );
    }
  };

  return (
    <div style={{ width: s, height: s * 1.2, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      {renderPiece()}
    </div>
  );
}

// ========== ЕГИПЕТСКИЙ НАБОР ==========
function EgyptianPiece({ piece, size }: { piece: Piece; size: number }) {
  const isWhite = piece.color === 'w';
  const s = size;
  
  const fillColor = isWhite ? '#f5deb3' : '#2d1f0f';
  const goldColor = '#ffd700';
  const blueColor = '#1e90ff';

  const renderPiece = () => {
    switch (piece.type) {
      case 'k': // Фараон
        return (
          <svg viewBox="0 0 100 120" style={{ width: s, height: s * 1.2 }}>
            {/* Основание - пирамида */}
            <polygon points="15,115 50,95 85,115" fill={fillColor} stroke="#8b4513" strokeWidth="2"/>
            
            {/* Трон */}
            <rect x="25" y="75" width="50" height="35" fill={fillColor} stroke="#8b4513" strokeWidth="2"/>
            <rect x="30" y="80" width="40" height="25" fill={isWhite ? '#d4a574' : '#4a3520'}/>
            
            {/* Тело */}
            <rect x="35" y="50" width="30" height="30" fill={fillColor} stroke="#8b4513" strokeWidth="1"/>
            
            {/* Голова */}
            <circle cx="50" cy="42" r="12" fill={fillColor} stroke="#8b4513" strokeWidth="2"/>
            
            {/* Немс (головной платок) */}
            <path d="M35 42 Q35 25 50 22 Q65 25 65 42" fill={goldColor} stroke="#b8860b" strokeWidth="1"/>
            
            {/* Урей (кобра) */}
            <path d="M50 22 Q48 15 50 10 Q52 15 50 22" fill={goldColor}/>
            <circle cx="50" cy="10" r="2" fill="#ff0000"/>
            
            {/* Глаза */}
            <ellipse cx="45" cy="42" rx="2" ry="3" fill="#000"/>
            <ellipse cx="55" cy="42" rx="2" ry="3" fill="#000"/>
            
            {/* Борода фараона */}
            <path d="M48 54 L50 65 L52 54 Z" fill={goldColor}/>
            
            {/* Анкх */}
            <circle cx="50" cy="60" r="3" fill={goldColor} stroke="#b8860b" strokeWidth="1"/>
            <line x1="50" y1="63" x2="50" y2="72" stroke={goldColor} strokeWidth="2"/>
            <line x1="45" y1="67" x2="55" y2="67" stroke={goldColor} strokeWidth="2"/>
          </svg>
        );

      case 'q': // Нефертити/Богиня
        return (
          <svg viewBox="0 0 100 120" style={{ width: s, height: s * 1.2 }}>
            {/* Основание */}
            <polygon points="15,115 50,95 85,115" fill={fillColor} stroke="#8b4513" strokeWidth="2"/>
            
            {/* Тело */}
            <path d="M30 95 Q25 70 35 55 Q50 50 65 55 Q75 70 70 95 Z" fill={fillColor} stroke="#8b4513" strokeWidth="2"/>
            
            {/* Голова */}
            <circle cx="50" cy="45" r="12" fill={fillColor} stroke="#8b4513" strokeWidth="2"/>
            
            {/* Высокая корона */}
            <path d="M35 45 L50 15 L65 45" fill={goldColor} stroke="#b8860b" strokeWidth="1"/>
            
            {/* Декор короны */}
            <line x1="50" y1="15" x2="50" y2="45" stroke={blueColor} strokeWidth="3"/>
            
            {/* Крылья */}
            <path d="M25 70 Q10 60 15 50 Q25 55 30 70" fill={fillColor} opacity="0.7"/>
            <path d="M75 70 Q90 60 85 50 Q75 55 70 70" fill={fillColor} opacity="0.7"/>
            
            {/* Глаза */}
            <ellipse cx="46" cy="45" rx="2" ry="3" fill="#000"/>
            <ellipse cx="54" cy="45" rx="2" ry="3" fill="#000"/>
            
            {/* Око Гора */}
            <path d="M40 38 Q45 35 55 38" fill="none" stroke={goldColor} strokeWidth="2"/>
          </svg>
        );

      case 'r': // Обелиск
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1 }}>
            {/* Основание */}
            <rect x="20" y="95" width="60" height="12" fill={fillColor} stroke="#8b4513" strokeWidth="2"/>
            
            {/* Обелиск */}
            <polygon points="30,95 50,15 70,95" fill={fillColor} stroke="#8b4513" strokeWidth="2"/>
            
            {/* Иероглифы */}
            <line x1="45" y1="40" x2="55" y2="40" stroke={goldColor} strokeWidth="2"/>
            <line x1="45" y1="55" x2="55" y2="55" stroke={goldColor} strokeWidth="2"/>
            <line x1="45" y1="70" x2="55" y2="70" stroke={goldColor} strokeWidth="2"/>
            <circle cx="50" cy="48" r="3" fill={goldColor}/>
            <circle cx="50" cy="63" r="3" fill={goldColor}/>
            
            {/* Верхушка */}
            <polygon points="50,15 45,25 55,25" fill={goldColor}/>
          </svg>
        );

      case 'b': // Анубис
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1 }}>
            {/* Основание */}
            <ellipse cx="50" cy="100" rx="25" ry="8" fill={fillColor} stroke="#8b4513" strokeWidth="2"/>
            
            {/* Тело */}
            <path d="M30 100 Q25 75 35 55 Q50 45 65 55 Q75 75 70 100 Z" fill={fillColor} stroke="#8b4513" strokeWidth="2"/>
            
            {/* Голова шакала */}
            <ellipse cx="50" cy="38" rx="15" ry="18" fill={fillColor} stroke="#8b4513" strokeWidth="2"/>
            
            {/* Морда */}
            <ellipse cx="50" cy="48" rx="8" ry="10" fill={isWhite ? '#d4a574' : '#4a3520'}/>
            
            {/* Уши шакала */}
            <polygon points="35,25 30,5 40,20" fill={fillColor} stroke="#8b4513" strokeWidth="1"/>
            <polygon points="65,25 70,5 60,20" fill={fillColor} stroke="#8b4513" strokeWidth="1"/>
            
            {/* Глаза */}
            <circle cx="43" cy="35" r="3" fill={goldColor}/>
            <circle cx="57" cy="35" r="3" fill={goldColor}/>
            <circle cx="43" cy="35" r="1" fill="#000"/>
            <circle cx="57" cy="35" r="1" fill="#000"/>
            
            {/* Посох */}
            <line x1="75" y1="100" x2="75" y2="30" stroke={goldColor} strokeWidth="3"/>
            <circle cx="75" cy="28" r="5" fill={blueColor}/>
          </svg>
        );

      case 'n': // Сфинкс
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1 }}>
            {/* Основание */}
            <ellipse cx="50" cy="100" rx="30" ry="8" fill={fillColor} stroke="#8b4513" strokeWidth="2"/>
            
            {/* Тело льва */}
            <ellipse cx="55" cy="85" rx="25" ry="15" fill={fillColor} stroke="#8b4513" strokeWidth="2"/>
            
            {/* Лапы */}
            <rect x="35" y="90" width="10" height="15" fill={fillColor} stroke="#8b4513" strokeWidth="1"/>
            <rect x="55" y="90" width="10" height="15" fill={fillColor} stroke="#8b4513" strokeWidth="1"/>
            
            {/* Шея */}
            <rect x="35" y="55" width="25" height="30" fill={fillColor} stroke="#8b4513" strokeWidth="1"/>
            
            {/* Голова человека */}
            <circle cx="47" cy="42" r="14" fill={fillColor} stroke="#8b4513" strokeWidth="2"/>
            
            {/* Головной убор */}
            <path d="M33 42 Q33 25 47 22 Q61 25 61 42" fill={goldColor} stroke="#b8860b" strokeWidth="1"/>
            
            {/* Глаза */}
            <ellipse cx="42" cy="42" rx="2" ry="3" fill="#000"/>
            <ellipse cx="52" cy="42" rx="2" ry="3" fill="#000"/>
            
            {/* Нос */}
            <path d="M47 45 L45 50 L49 50 Z" fill={isWhite ? '#d4a574' : '#4a3520'}/>
            
            {/* Крылья */}
            <path d="M75 70 Q90 55 85 40 Q80 55 70 65" fill={fillColor} opacity="0.6"/>
          </svg>
        );

      case 'p': // Пирамида
        return (
          <svg viewBox="0 0 100 100" style={{ width: s, height: s }}>
            {/* Основание */}
            <polygon points="15,95 85,95 50,15" fill={fillColor} stroke="#8b4513" strokeWidth="2"/>
            
            {/* Грань освещённая */}
            <polygon points="50,15 15,95 50,95" fill={isWhite ? '#e8d4b8' : '#3d2815'}/>
            
            {/* Грань в тени */}
            <polygon points="50,15 85,95 50,95" fill={isWhite ? '#c9b090' : '#2d1f0f'}/>
            
            {/* Вход */}
            <rect x="45" y="70" width="10" height="20" fill={isWhite ? '#2d1f0f' : '#f5deb3'} rx="2"/>
            
            {/* Верхушка */}
            <polygon points="50,15 47,22 53,22" fill={goldColor}/>
          </svg>
        );
    }
  };

  return (
    <div style={{ width: s, height: s * 1.2, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      {renderPiece()}
    </div>
  );
}

// ========== КРИСТАЛЛЬНЫЙ НАБОР ==========
function CrystalPiece({ piece, size }: { piece: Piece; size: number }) {
  const isWhite = piece.color === 'w';
  const s = size;
  
  const crystalFill = isWhite 
    ? 'rgba(255,255,255,0.85)'
    : 'rgba(50,50,80,0.9)';
  const crystalStroke = isWhite ? '#c0c0c0' : '#1a1a3a';
  const gemColor = isWhite ? '#ffd700' : '#ff4444';

  const renderPiece = () => {
    const baseFilter = `drop-shadow(0 4px 8px rgba(0,0,0,0.3)) drop-shadow(0 0 10px ${isWhite ? 'rgba(255,255,255,0.5)' : 'rgba(100,100,255,0.3)'})`;

    switch (piece.type) {
      case 'k':
        return (
          <svg viewBox="0 0 100 120" style={{ width: s, height: s * 1.2, filter: baseFilter }}>
            <defs>
              <linearGradient id={`crystal-k-${piece.color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#6060a0'}/>
                <stop offset="50%" stopColor={isWhite ? '#e0e0e0' : '#404080'}/>
                <stop offset="100%" stopColor={isWhite ? '#c0c0c0' : '#202040'}/>
              </linearGradient>
            </defs>
            
            {/* Кристальное основание */}
            <polygon points="20,110 80,110 85,90 15,90" fill={`url(#crystal-k-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Основной кристалл */}
            <polygon points="50,20 20,90 80,90" fill={`url(#crystal-k-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Грани */}
            <line x1="50" y1="20" x2="35" y2="90" stroke={crystalStroke} strokeWidth="0.5" opacity="0.5"/>
            <line x1="50" y1="20" x2="65" y2="90" stroke={crystalStroke} strokeWidth="0.5" opacity="0.5"/>
            
            {/* Корона из кристаллов */}
            <polygon points="50,20 40,5 50,15 60,5" fill={gemColor} stroke="#fff" strokeWidth="0.5"/>
            
            {/* Драгоценные камни */}
            <circle cx="35" cy="60" r="4" fill={gemColor} opacity="0.8"/>
            <circle cx="65" cy="60" r="4" fill={gemColor} opacity="0.8"/>
            <circle cx="50" cy="45" r="5" fill={gemColor} opacity="0.9"/>
            
            {/* Блики */}
            <line x1="30" y1="50" x2="40" y2="70" stroke="#fff" strokeWidth="2" opacity="0.6"/>
          </svg>
        );

      case 'q':
        return (
          <svg viewBox="0 0 100 120" style={{ width: s, height: s * 1.2, filter: baseFilter }}>
            <defs>
              <linearGradient id={`crystal-q-${piece.color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#8060a0'}/>
                <stop offset="100%" stopColor={isWhite ? '#d0d0d0' : '#302040'}/>
              </linearGradient>
            </defs>
            
            {/* Основание */}
            <polygon points="20,110 80,110 85,90 15,90" fill={`url(#crystal-q-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Центральный кристалл */}
            <polygon points="50,15 25,90 75,90" fill={`url(#crystal-q-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Боковые кристаллы */}
            <polygon points="20,70 10,90 30,90" fill={`url(#crystal-q-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            <polygon points="80,70 70,90 90,90" fill={`url(#crystal-q-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Вершина */}
            <polygon points="50,15 45,0 55,0" fill={gemColor}/>
            
            {/* Драгоценности */}
            <circle cx="50" cy="35" r="6" fill={gemColor} opacity="0.9"/>
            <circle cx="50" cy="35" r="3" fill="#fff" opacity="0.8"/>
            
            {/* Блики */}
            <line x1="35" y1="40" x2="45" y2="70" stroke="#fff" strokeWidth="2" opacity="0.5"/>
          </svg>
        );

      case 'r':
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1, filter: baseFilter }}>
            <defs>
              <linearGradient id={`crystal-r-${piece.color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#f0f0f0' : '#505070'}/>
                <stop offset="100%" stopColor={isWhite ? '#a0a0a0' : '#252535'}/>
              </linearGradient>
            </defs>
            
            {/* Основание */}
            <polygon points="15,105 85,105 90,85 10,85" fill={`url(#crystal-r-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Башня */}
            <polygon points="25,85 75,85 80,35 20,35" fill={`url(#crystal-r-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Кристальные зубцы */}
            {[0, 1, 2, 3].map(i => (
              <polygon key={i} points={`${30 + i * 12},35 ${35 + i * 12},15 ${40 + i * 12},35`} fill={`url(#crystal-r-${piece.color})`} stroke={crystalStroke} strokeWidth="0.5"/>
            ))}
            
            {/* Ворота */}
            <polygon points="40,85 50,60 60,85" fill={isWhite ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.2)'}/>
            
            {/* Блики */}
            <line x1="25" y1="50" x2="35" y2="75" stroke="#fff" strokeWidth="2" opacity="0.4"/>
          </svg>
        );

      case 'b':
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1, filter: baseFilter }}>
            <defs>
              <linearGradient id={`crystal-b-${piece.color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#e8e8ff' : '#4040a0'}/>
                <stop offset="100%" stopColor={isWhite ? '#a0a0d0' : '#202050'}/>
              </linearGradient>
            </defs>
            
            {/* Основание */}
            <ellipse cx="50" cy="100" rx="28" ry="8" fill={`url(#crystal-b-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Основной кристалл-конус */}
            <polygon points="50,20 20,100 80,100" fill={`url(#crystal-b-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Шар наверху */}
            <circle cx="50" cy="20" r="12" fill={`url(#crystal-b-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Блики */}
            <ellipse cx="45" cy="15" rx="3" ry="5" fill="#fff" opacity="0.7"/>
            
            {/* Разрез */}
            <ellipse cx="50" cy="60" rx="4" ry="15" fill={isWhite ? 'rgba(100,100,200,0.3)' : 'rgba(200,200,255,0.2)'}/>
            
            {/* Драгоценность */}
            <circle cx="50" cy="50" r="5" fill={gemColor} opacity="0.8"/>
          </svg>
        );

      case 'n':
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1, filter: baseFilter }}>
            <defs>
              <linearGradient id={`crystal-n-${piece.color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#505080'}/>
                <stop offset="100%" stopColor={isWhite ? '#b0b0b0' : '#252540'}/>
              </linearGradient>
            </defs>
            
            {/* Основание */}
            <ellipse cx="50" cy="100" rx="25" ry="7" fill={`url(#crystal-n-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Тело */}
            <polygon points="30,100 70,100 75,70 25,70" fill={`url(#crystal-n-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Шея */}
            <polygon points="35,70 55,70 50,40 30,50" fill={`url(#crystal-n-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Голова */}
            <polygon points="30,50 15,40 20,55 35,60" fill={`url(#crystal-n-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Рог */}
            <polygon points="25,40 20,20 30,35" fill={gemColor} opacity="0.9"/>
            
            {/* Грива-кристаллы */}
            <polygon points="55,70 65,50 58,70" fill={`url(#crystal-n-${piece.color})`} stroke={crystalStroke} strokeWidth="0.5"/>
            <polygon points="60,70 72,55 63,70" fill={`url(#crystal-n-${piece.color})`} stroke={crystalStroke} strokeWidth="0.5"/>
            
            {/* Глаз */}
            <circle cx="22" cy="45" r="3" fill={gemColor}/>
          </svg>
        );

      case 'p':
        return (
          <svg viewBox="0 0 100 100" style={{ width: s, height: s, filter: baseFilter }}>
            <defs>
              <linearGradient id={`crystal-p-${piece.color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#6060a0'}/>
                <stop offset="100%" stopColor={isWhite ? '#c0c0c0' : '#303050'}/>
              </linearGradient>
            </defs>
            
            {/* Основание */}
            <ellipse cx="50" cy="90" rx="22" ry="6" fill={`url(#crystal-p-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Маленький кристалл */}
            <polygon points="50,25 25,90 75,90" fill={`url(#crystal-p-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Шар */}
            <circle cx="50" cy="25" r="12" fill={`url(#crystal-p-${piece.color})`} stroke={crystalStroke} strokeWidth="1"/>
            
            {/* Блик */}
            <ellipse cx="45" cy="20" rx="4" ry="6" fill="#fff" opacity="0.6"/>
            
            {/* Маленький камень */}
            <circle cx="50" cy="50" r="4" fill={gemColor} opacity="0.7"/>
          </svg>
        );
    }
  };

  return (
    <div style={{ width: s, height: s * 1.2, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      {renderPiece()}
    </div>
  );
}

// ========== НАБОР ВИКИНГОВ (ОСТРОВ ЛЬЮИС) ==========
function LewisPiece({ piece, size }: { piece: Piece; size: number }) {
  const isWhite = piece.color === 'w';
  const s = size;
  
  // Стиль старинной кости/моржового клыка
  const boneColor = isWhite 
    ? 'linear-gradient(180deg, #f5f0e6 0%, #e8dcc8 50%, #d4c4a8 100%)'
    : 'linear-gradient(180deg, #8b7355 0%, #6b5344 50%, #4a3828 100%)';
  const boneFill = isWhite ? '#f5f0e6' : '#6b5344';
  const boneStroke = isWhite ? '#8b7355' : '#2a1f15';
  const detailColor = isWhite ? '#4a3828' : '#d4c4a8';

  const renderPiece = () => {
    switch (piece.type) {
      case 'k': // Король-викинг на троне
        return (
          <svg viewBox="0 0 100 120" style={{ width: s, height: s * 1.2 }}>
            <defs>
              <linearGradient id={`lewis-k-${piece.color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#f5f0e6' : '#8b7355'}/>
                <stop offset="100%" stopColor={isWhite ? '#d4c4a8' : '#4a3828'}/>
              </linearGradient>
            </defs>
            
            {/* Трон */}
            <rect x="20" y="70" width="60" height="45" fill={`url(#lewis-k-${piece.color})`} stroke={boneStroke} strokeWidth="2" rx="3"/>
            <rect x="25" y="75" width="50" height="35" fill={isWhite ? '#e8dcc8' : '#5a4434'}/>
            
            {/* Спинка трона с узором */}
            <rect x="22" y="40" width="56" height="35" fill={`url(#lewis-k-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            
            {/* Узоры на троне */}
            <line x1="30" y1="50" x2="30" y2="65" stroke={detailColor} strokeWidth="2"/>
            <line x1="70" y1="50" x2="70" y2="65" stroke={detailColor} strokeWidth="2"/>
            <circle cx="50" cy="57" r="5" fill="none" stroke={detailColor} strokeWidth="2"/>
            
            {/* Фигура короля */}
            <rect x="35" y="45" width="30" height="35" fill={`url(#lewis-k-${piece.color})`} stroke={boneStroke} strokeWidth="1"/>
            
            {/* Голова */}
            <circle cx="50" cy="35" r="12" fill={`url(#lewis-k-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            
            {/* Лицо */}
            <circle cx="45" cy="33" r="2" fill={detailColor}/>
            <circle cx="55" cy="33" r="2" fill={detailColor}/>
            <line x1="45" y1="40" x2="55" y2="40" stroke={detailColor} strokeWidth="2"/>
            
            {/* Корона */}
            <path d="M38 25 L42 15 L50 20 L58 15 L62 25 Z" fill={`url(#lewis-k-${piece.color})`} stroke={boneStroke} strokeWidth="1"/>
            
            {/* Меч в руке */}
            <rect x="70" y="50" width="4" height="30" fill={isWhite ? '#8b8b8b' : '#c0c0c0'} stroke={boneStroke} strokeWidth="0.5"/>
            <rect x="67" y="48" width="10" height="4" fill={isWhite ? '#654321' : '#a08060'}/>
          </svg>
        );

      case 'q': // Королева
        return (
          <svg viewBox="0 0 100 120" style={{ width: s, height: s * 1.2 }}>
            <defs>
              <linearGradient id={`lewis-q-${piece.color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#f5f0e6' : '#8b7355'}/>
                <stop offset="100%" stopColor={isWhite ? '#d4c4a8' : '#4a3828'}/>
              </linearGradient>
            </defs>
            
            {/* Трон/основание */}
            <rect x="25" y="80" width="50" height="35" fill={`url(#lewis-q-${piece.color})`} stroke={boneStroke} strokeWidth="2" rx="3"/>
            
            {/* Тело */}
            <path d="M30 80 Q25 55 35 45 Q50 40 65 45 Q75 55 70 80 Z" fill={`url(#lewis-q-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            
            {/* Голова */}
            <circle cx="50" cy="35" r="11" fill={`url(#lewis-q-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            
            {/* Лицо */}
            <circle cx="45" cy="33" r="1.5" fill={detailColor}/>
            <circle cx="55" cy="33" r="1.5" fill={detailColor}/>
            
            {/* Волосы/покрывало */}
            <path d="M39 35 Q35 50 40 60 M61 35 Q65 50 60 60" fill="none" stroke={detailColor} strokeWidth="2"/>
            
            {/* Корона */}
            <path d="M40 27 L44 18 L50 24 L56 18 L60 27 Z" fill={`url(#lewis-q-${piece.color})`} stroke={boneStroke} strokeWidth="1"/>
            
            {/* Руки на подлокотниках */}
            <ellipse cx="28" cy="75" rx="5" ry="3" fill={`url(#lewis-q-${piece.color})`}/>
            <ellipse cx="72" cy="75" rx="5" ry="3" fill={`url(#lewis-q-${piece.color})`}/>
          </svg>
        );

      case 'r': // Берсерк/воин (как ладья в оригинале)
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1 }}>
            <defs>
              <linearGradient id={`lewis-r-${piece.color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#f5f0e6' : '#8b7355'}/>
                <stop offset="100%" stopColor={isWhite ? '#d4c4a8' : '#4a3828'}/>
              </linearGradient>
            </defs>
            
            {/* Основание */}
            <rect x="25" y="85" width="50" height="20" fill={`url(#lewis-r-${piece.color})`} stroke={boneStroke} strokeWidth="2" rx="2"/>
            
            {/* Тело */}
            <rect x="32" y="45" width="36" height="42" fill={`url(#lewis-r-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            
            {/* Щит */}
            <ellipse cx="68" cy="65" rx="10" ry="18" fill={`url(#lewis-r-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            <circle cx="68" cy="65" r="4" fill={detailColor}/>
            
            {/* Голова */}
            <circle cx="50" cy="35" r="12" fill={`url(#lewis-r-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            
            {/* Лицо - суровое */}
            <circle cx="45" cy="32" r="2" fill={detailColor}/>
            <circle cx="55" cy="32" r="2" fill={detailColor}/>
            <path d="M45 40 L55 40" stroke={detailColor} strokeWidth="2"/>
            
            {/* Шлем */}
            <path d="M38 32 Q38 20 50 18 Q62 20 62 32" fill={`url(#lewis-r-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            <line x1="50" y1="18" x2="50" y2="10" stroke={boneStroke} strokeWidth="3"/>
            
            {/* Меч */}
            <rect x="25" y="45" width="5" height="35" fill={isWhite ? '#808080' : '#a0a0a0'} stroke={boneStroke} strokeWidth="0.5"/>
            <rect x="22" y="43" width="11" height="5" fill={isWhite ? '#654321' : '#a08060'}/>
          </svg>
        );

      case 'b': // Епископ с посохом
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1 }}>
            <defs>
              <linearGradient id={`lewis-b-${piece.color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#f5f0e6' : '#8b7355'}/>
                <stop offset="100%" stopColor={isWhite ? '#d4c4a8' : '#4a3828'}/>
              </linearGradient>
            </defs>
            
            {/* Основание */}
            <rect x="30" y="90" width="40" height="15" fill={`url(#lewis-b-${piece.color})`} stroke={boneStroke} strokeWidth="2" rx="2"/>
            
            {/* Мантия */}
            <path d="M32 90 Q25 65 35 50 Q50 45 65 50 Q75 65 68 90 Z" fill={`url(#lewis-b-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            
            {/* Голова */}
            <circle cx="50" cy="40" r="11" fill={`url(#lewis-b-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            
            {/* Лицо */}
            <circle cx="45" cy="38" r="1.5" fill={detailColor}/>
            <circle cx="55" cy="38" r="1.5" fill={detailColor}/>
            <line x1="46" y1="45" x2="54" y2="45" stroke={detailColor} strokeWidth="1"/>
            
            {/* Капюшон/митра */}
            <path d="M38 40 Q35 25 50 22 Q65 25 62 40" fill={`url(#lewis-b-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            
            {/* Посох */}
            <line x1="72" y1="95" x2="72" y2="25" stroke={isWhite ? '#654321' : '#a08060'} strokeWidth="4"/>
            <circle cx="72" cy="22" r="6" fill={`url(#lewis-b-${piece.color})`} stroke={boneStroke} strokeWidth="1"/>
          </svg>
        );

      case 'n': // Всадник на коне
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1 }}>
            <defs>
              <linearGradient id={`lewis-n-${piece.color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#f5f0e6' : '#8b7355'}/>
                <stop offset="100%" stopColor={isWhite ? '#d4c4a8' : '#4a3828'}/>
              </linearGradient>
            </defs>
            
            {/* Основание */}
            <rect x="20" y="95" width="60" height="12" fill={`url(#lewis-n-${piece.color})`} stroke={boneStroke} strokeWidth="2" rx="2"/>
            
            {/* Тело коня */}
            <ellipse cx="55" cy="80" rx="25" ry="15" fill={`url(#lewis-n-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            
            {/* Ноги коня */}
            <rect x="35" y="88" width="6" height="12" fill={`url(#lewis-n-${piece.color})`} stroke={boneStroke} strokeWidth="1"/>
            <rect x="50" y="88" width="6" height="12" fill={`url(#lewis-n-${piece.color})`} stroke={boneStroke} strokeWidth="1"/>
            <rect x="65" y="88" width="6" height="12" fill={`url(#lewis-n-${piece.color})`} stroke={boneStroke} strokeWidth="1"/>
            
            {/* Шея коня */}
            <path d="M40 75 Q30 55 35 45" fill="none" stroke={boneStroke} strokeWidth="12"/>
            <path d="M40 75 Q30 55 35 45" fill={`url(#lewis-n-${piece.color})`}/>
            
            {/* Голова коня */}
            <ellipse cx="30" cy="45" rx="10" ry="8" fill={`url(#lewis-n-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            <circle cx="25" cy="42" r="2" fill={detailColor}/>
            
            {/* Всадник */}
            <rect x="45" y="50" width="20" height="25" fill={`url(#lewis-n-${piece.color})`} stroke={boneStroke} strokeWidth="1"/>
            <circle cx="55" cy="42" r="8" fill={`url(#lewis-n-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            <circle cx="52" cy="40" r="1.5" fill={detailColor}/>
            <circle cx="58" cy="40" r="1.5" fill={detailColor}/>
            
            {/* Шлем всадника */}
            <path d="M48 40 Q48 32 55 30 Q62 32 62 40" fill={`url(#lewis-n-${piece.color})`} stroke={boneStroke} strokeWidth="1"/>
            
            {/* Копьё */}
            <line x1="75" y1="70" x2="85" y2="25" stroke={isWhite ? '#654321' : '#a08060'} strokeWidth="3"/>
            <polygon points="85,25 82,15 88,15" fill={isWhite ? '#808080' : '#c0c0c0'}/>
          </svg>
        );

      case 'p': // Воин-пехотинец
        return (
          <svg viewBox="0 0 100 100" style={{ width: s, height: s }}>
            <defs>
              <linearGradient id={`lewis-p-${piece.color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#f5f0e6' : '#8b7355'}/>
                <stop offset="100%" stopColor={isWhite ? '#d4c4a8' : '#4a3828'}/>
              </linearGradient>
            </defs>
            
            {/* Основание */}
            <ellipse cx="50" cy="90" rx="20" ry="6" fill={`url(#lewis-p-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            
            {/* Тело */}
            <rect x="35" y="50" width="30" height="35" fill={`url(#lewis-p-${piece.color})`} stroke={boneStroke} strokeWidth="2" rx="3"/>
            
            {/* Щит */}
            <ellipse cx="68" cy="65" rx="8" ry="14" fill={`url(#lewis-p-${piece.color})`} stroke={boneStroke} strokeWidth="1"/>
            
            {/* Голова */}
            <circle cx="50" cy="38" r="12" fill={`url(#lewis-p-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            
            {/* Лицо */}
            <circle cx="46" cy="36" r="1.5" fill={detailColor}/>
            <circle cx="54" cy="36" r="1.5" fill={detailColor}/>
            <line x1="46" y1="42" x2="54" y2="42" stroke={detailColor} strokeWidth="1"/>
            
            {/* Шлем */}
            <path d="M38 38 Q38 26 50 24 Q62 26 62 38" fill={`url(#lewis-p-${piece.color})`} stroke={boneStroke} strokeWidth="2"/>
            
            {/* Меч */}
            <rect x="25" y="50" width="4" height="28" fill={isWhite ? '#808080' : '#c0c0c0'} stroke={boneStroke} strokeWidth="0.5"/>
            <rect x="22" y="48" width="10" height="4" fill={isWhite ? '#654321' : '#a08060'}/>
          </svg>
        );
    }
  };

  return (
    <div style={{ width: s, height: s * 1.2, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      {renderPiece()}
    </div>
  );
}

// ========== МИНИМАЛЬНЫЙ НАБОР ==========
function MinimalPiece({ piece, size }: { piece: Piece; size: number }) {
  const isWhite = piece.color === 'w';
  const s = size;
  
  const fillColor = isWhite ? '#ffffff' : '#1a1a1a';
  const strokeColor = isWhite ? '#333333' : '#ffffff';
  const strokeWidth = 2;

  const renderPiece = () => {
    switch (piece.type) {
      case 'k':
        return (
          <svg viewBox="0 0 100 120" style={{ width: s, height: s * 1.2 }}>
            <circle cx="50" cy="85" r="25" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
            <circle cx="50" cy="50" r="20" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
            <line x1="50" y1="15" x2="50" y2="35" stroke={strokeColor} strokeWidth="4"/>
            <line x1="35" y1="25" x2="65" y2="25" stroke={strokeColor} strokeWidth="4"/>
          </svg>
        );

      case 'q':
        return (
          <svg viewBox="0 0 100 120" style={{ width: s, height: s * 1.2 }}>
            <circle cx="50" cy="85" r="25" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
            <circle cx="50" cy="45" r="22" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
            {[0, 1, 2, 3, 4].map(i => {
              const angle = (i * 72 - 90) * Math.PI / 180;
              const x = 50 + 20 * Math.cos(angle);
              const y = 45 + 20 * Math.sin(angle);
              return <circle key={i} cx={x} cy={y} r="5" fill={strokeColor}/>;
            })}
            <circle cx="50" cy="20" r="8" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          </svg>
        );

      case 'r':
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1 }}>
            <rect x="25" y="60" width="50" height="40" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} rx="3"/>
            <rect x="25" y="25" width="50" height="40" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} rx="3"/>
            {[0, 1, 2, 3].map(i => (
              <rect key={i} x={28 + i * 12} y="10" width="10" height="20" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth - 0.5} rx="2"/>
            ))}
          </svg>
        );

      case 'b':
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1 }}>
            <ellipse cx="50" cy="90" rx="22" ry="8" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
            <polygon points="50,25 25,90 75,90" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
            <circle cx="50" cy="25" r="10" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
            <line x1="50" y1="35" x2="50" y2="55" stroke={strokeColor} strokeWidth="3"/>
          </svg>
        );

      case 'n':
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1 }}>
            <ellipse cx="50" cy="90" rx="22" ry="8" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
            <path d="M30 85 L30 55 Q30 35 50 30 L65 45 L50 55 L50 85 Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
            <polygon points="45,30 50,15 55,30" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth - 0.5}/>
          </svg>
        );

      case 'p':
        return (
          <svg viewBox="0 0 100 100" style={{ width: s, height: s }}>
            <ellipse cx="50" cy="85" rx="18" ry="6" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
            <circle cx="50" cy="55" r="20" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
            <circle cx="50" cy="30" r="12" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          </svg>
        );
    }
  };

  return (
    <div style={{ width: s, height: s * 1.2, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      {renderPiece()}
    </div>
  );
}

// ========== НАБОР САМУРАЕВ ==========
function SamuraiPiece({ piece, size }: { piece: Piece; size: number }) {
  const isWhite = piece.color === 'w';
  const s = size;
  
  // Японская цветовая палитра
  const armorColor = isWhite 
    ? 'linear-gradient(180deg, #f8f4e8 0%, #e8dcc0 30%, #c9b896 70%, #a89070 100%)'
    : 'linear-gradient(180deg, #2d1f1a 0%, #1a1210 30%, #0d0a08 70%, #050403 100%)';
  const armorFill = isWhite ? '#e8dcc0' : '#1a1210';
  const armorStroke = isWhite ? '#8b7355' : '#d4c4a8';
  const accentColor = isWhite ? '#c41e3a' : '#ffd700'; // Красный для белых, золотой для чёрных
  const goldDetail = '#d4af37';
  const steelColor = isWhite ? '#c0c0c0' : '#404040';

  const renderPiece = () => {
    switch (piece.type) {
      case 'k': // Сёгун - император/военачальник
        return (
          <svg viewBox="0 0 100 130" style={{ width: s, height: s * 1.3 }}>
            <defs>
              <linearGradient id={`sam-k-${piece.color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#f8f4e8' : '#2d1f1a'}/>
                <stop offset="50%" stopColor={isWhite ? '#c9b896' : '#1a1210'}/>
                <stop offset="100%" stopColor={isWhite ? '#a89070' : '#0d0a08'}/>
              </linearGradient>
              <linearGradient id={`sam-k-armor-${piece.color}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={isWhite ? '#d4c4a8' : '#3d2d25'}/>
                <stop offset="50%" stopColor={isWhite ? '#e8dcc0' : '#2d1f1a'}/>
                <stop offset="100%" stopColor={isWhite ? '#d4c4a8' : '#3d2d25'}/>
              </linearGradient>
            </defs>
            
            {/* Основание - татами */}
            <ellipse cx="50" cy="120" rx="35" ry="8" fill={isWhite ? '#c9b896' : '#2d1f1a'} stroke={armorStroke} strokeWidth="1"/>
            
            {/* Тело в полном доспехе */}
            <path d="M25 120 Q20 95 30 75 Q50 65 70 75 Q80 95 75 120 Z" fill={`url(#sam-k-${piece.color})`} stroke={armorStroke} strokeWidth="2"/>
            
            {/* Нагрудник до (грудная пластина) */}
            <path d="M32 95 L50 70 L68 95 L50 115 Z" fill={`url(#sam-k-armor-${piece.color})`} stroke={goldDetail} strokeWidth="1"/>
            
            {/* Дракон на нагруднике */}
            <circle cx="50" cy="90" r="8" fill="none" stroke={accentColor} strokeWidth="1.5"/>
            <path d="M45 88 Q50 82 55 88 M45 92 Q50 98 55 92" fill="none" stroke={accentColor} strokeWidth="1"/>
            
            {/* Плечевые пластины содэ */}
            <ellipse cx="25" cy="80" rx="12" ry="8" fill={`url(#sam-k-armor-${piece.color})`} stroke={goldDetail} strokeWidth="1"/>
            <ellipse cx="75" cy="80" rx="12" ry="8" fill={`url(#sam-k-armor-${piece.color})`} stroke={goldDetail} strokeWidth="1"/>
            
            {/* Шея */}
            <rect x="40" y="55" width="20" height="15" fill={`url(#sam-k-${piece.color})`}/>
            
            {/* Голова */}
            <circle cx="50" cy="45" r="15" fill={`url(#sam-k-${piece.color})`} stroke={armorStroke} strokeWidth="2"/>
            
            {/* Лицо */}
            <ellipse cx="50" cy="47" rx="9" ry="10" fill={isWhite ? '#f5e6d3' : '#3d2d25'}/>
            
            {/* Глаза */}
            <ellipse cx="45" cy="45" rx="2" ry="1.5" fill="#000"/>
            <ellipse cx="55" cy="45" rx="2" ry="1.5" fill="#000"/>
            <circle cx="46" cy="44.5" r="0.5" fill="#fff"/>
            <circle cx="56" cy="44.5" r="0.5" fill="#fff"/>
            
            {/* Брови */}
            <path d="M42 42 Q45 40 48 42" fill="none" stroke={isWhite ? '#333' : '#888'} strokeWidth="1"/>
            <path d="M52 42 Q55 40 58 42" fill="none" stroke={isWhite ? '#333' : '#888'} strokeWidth="1"/>
            
            {/* Кабуто (шлем) */}
            <path d="M32 45 Q32 25 50 20 Q68 25 68 45 Q50 50 32 45 Z" fill={`url(#sam-k-armor-${piece.color})`} stroke={goldDetail} strokeWidth="1.5"/>
            
            {/* Маэдатэ (гребень на шлеме) */}
            <path d="M50 20 L50 5 L45 15 L55 15 Z" fill={accentColor} stroke={goldDetail} strokeWidth="0.5"/>
            
            {/* Рога на шлеме */}
            <path d="M35 30 Q25 20 30 10" fill="none" stroke={goldDetail} strokeWidth="3" strokeLinecap="round"/>
            <path d="M65 30 Q75 20 70 10" fill="none" stroke={goldDetail} strokeWidth="3" strokeLinecap="round"/>
            
            {/* Мэнпо (маска) */}
            <path d="M42 50 Q50 55 58 50" fill="none" stroke={armorStroke} strokeWidth="1"/>
            
            {/* Катаны за спиной */}
            <line x1="25" y1="75" x2="20" y2="35" stroke={steelColor} strokeWidth="2"/>
            <line x1="75" y1="75" x2="80" y2="35" stroke={steelColor} strokeWidth="2"/>
            <rect x="18" y="33" width="4" height="5" fill={goldDetail}/>
            <rect x="78" y="33" width="4" height="5" fill={goldDetail}/>
          </svg>
        );

      case 'q': // Принцесса/Императрица
        return (
          <svg viewBox="0 0 100 130" style={{ width: s, height: s * 1.3 }}>
            <defs>
              <linearGradient id={`sam-q-${piece.color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#fff8f0' : '#3d2520'}/>
                <stop offset="100%" stopColor={isWhite ? '#e8d4c0' : '#1a1010'}/>
              </linearGradient>
            </defs>
            
            {/* Основание - кимоно */}
            <ellipse cx="50" cy="120" rx="30" ry="8" fill={`url(#sam-q-${piece.color})`} stroke={armorStroke} strokeWidth="1"/>
            
            {/* Кимоно */}
            <path d="M25 120 Q15 90 30 70 Q50 60 70 70 Q85 90 75 120 Z" fill={`url(#sam-q-${piece.color})`} stroke={armorStroke} strokeWidth="2"/>
            
            {/* Узор на кимоно */}
            <path d="M35 85 Q50 80 65 85" fill="none" stroke={accentColor} strokeWidth="2"/>
            <path d="M30 100 Q50 95 70 100" fill="none" stroke={accentColor} strokeWidth="1.5"/>
            <circle cx="50" cy="90" r="3" fill={accentColor}/>
            
            {/* Оби (пояс) */}
            <rect x="30" y="70" width="40" height="10" fill={accentColor} stroke={goldDetail} strokeWidth="1"/>
            <circle cx="50" cy="75" r="4" fill={goldDetail}/>
            
            {/* Тело */}
            <ellipse cx="50" cy="60" rx="12" ry="15" fill={`url(#sam-q-${piece.color})`}/>
            
            {/* Голова */}
            <circle cx="50" cy="40" r="12" fill={isWhite ? '#f5e6d3' : '#3d2d25'} stroke={armorStroke} strokeWidth="1"/>
            
            {/* Волосы */}
            <path d="M38 40 Q38 28 50 25 Q62 28 62 40 Q58 35 50 35 Q42 35 38 40 Z" fill={isWhite ? '#1a1a1a' : '#0a0a0a'}/>
            
            {/* Причёска с украшениями */}
            <path d="M38 32 Q30 28 28 35 Q32 38 38 35" fill={isWhite ? '#1a1a1a' : '#0a0a0a'}/>
            <path d="M62 32 Q70 28 72 35 Q68 38 62 35" fill={isWhite ? '#1a1a1a' : '#0a0a0a'}/>
            
            {/* Заколки канзаши */}
            <circle cx="35" cy="32" r="3" fill={accentColor}/>
            <circle cx="65" cy="32" r="3" fill={accentColor}/>
            <circle cx="50" cy="28" r="2" fill={goldDetail}/>
            
            {/* Глаза */}
            <ellipse cx="46" cy="40" rx="2" ry="2.5" fill="#000"/>
            <ellipse cx="54" cy="40" rx="2" ry="2.5" fill="#000"/>
            <line x1="44" y1="38" x2="48" y2="37" stroke="#000" strokeWidth="0.5"/>
            <line x1="52" y1="37" x2="56" y2="38" stroke="#000" strokeWidth="0.5"/>
            
            {/* Губы */}
            <ellipse cx="50" cy="46" rx="2" ry="1" fill={accentColor}/>
            
            {/* Веер */}
            <path d="M75 85 Q85 65 75 50 L85 50 Q95 70 85 85 Z" fill={`url(#sam-q-${piece.color})`} stroke={goldDetail} strokeWidth="1"/>
            <line x1="78" y1="55" x2="88" y2="55" stroke={accentColor} strokeWidth="0.5"/>
            <line x1="78" y1="60" x2="90" y2="60" stroke={accentColor} strokeWidth="0.5"/>
            <line x1="78" y1="65" x2="91" y2="65" stroke={accentColor} strokeWidth="0.5"/>
          </svg>
        );

      case 'r': // Замок/Башня
        return (
          <svg viewBox="0 0 100 120" style={{ width: s, height: s * 1.2 }}>
            <defs>
              <linearGradient id={`sam-r-${piece.color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#e8e0d0' : '#3d3530'}/>
                <stop offset="100%" stopColor={isWhite ? '#a09888' : '#1a1510'}/>
              </linearGradient>
            </defs>
            
            {/* Основание */}
            <rect x="15" y="100" width="70" height="15" fill={`url(#sam-r-${piece.color})`} stroke={armorStroke} strokeWidth="2" rx="2"/>
            
            {/* Главные стены */}
            <rect x="22" y="50" width="56" height="50" fill={`url(#sam-r-${piece.color})`} stroke={armorStroke} strokeWidth="2"/>
            
            {/* Японская крыша */}
            <path d="M10 55 Q50 30 90 55 L80 55 Q50 40 20 55 Z" fill={accentColor} stroke={goldDetail} strokeWidth="1"/>
            
            {/* Загнутые углы крыши */}
            <path d="M10 55 Q5 50 12 45 L20 55 Z" fill={accentColor}/>
            <path d="M90 55 Q95 50 88 45 L80 55 Z" fill={accentColor}/>
            
            {/* Ворота */}
            <path d="M40 100 L40 75 Q50 68 60 75 L60 100 Z" fill={isWhite ? '#2d1f1a' : '#4a3525'} stroke={goldDetail} strokeWidth="1"/>
            
            {/* Врата в виде седзи */}
            <rect x="43" y="78" width="5" height="15" fill="none" stroke={goldDetail} strokeWidth="0.5"/>
            <rect x="52" y="78" width="5" height="15" fill="none" stroke={goldDetail} strokeWidth="0.5"/>
            
            {/* Окна */}
            <rect x="27" y="65" width="12" height="15" fill={isWhite ? '#1a1510' : '#e8dcc0'} stroke={goldDetail} strokeWidth="1"/>
            <line x1="33" y1="65" x2="33" y2="80" stroke={goldDetail} strokeWidth="0.5"/>
            <line x1="27" y1="72" x2="39" y2="72" stroke={goldDetail} strokeWidth="0.5"/>
            
            <rect x="61" y="65" width="12" height="15" fill={isWhite ? '#1a1510' : '#e8dcc0'} stroke={goldDetail} strokeWidth="1"/>
            <line x1="67" y1="65" x2="67" y2="80" stroke={goldDetail} strokeWidth="0.5"/>
            <line x1="61" y1="72" x2="73" y2="72" stroke={goldDetail} strokeWidth="0.5"/>
            
            {/* Башенки по углам */}
            <rect x="15" y="35" width="15" height="20" fill={`url(#sam-r-${piece.color})`} stroke={armorStroke} strokeWidth="1"/>
            <path d="M12 35 Q22 28 32 35 Z" fill={accentColor} stroke={goldDetail} strokeWidth="0.5"/>
            
            <rect x="70" y="35" width="15" height="20" fill={`url(#sam-r-${piece.color})`} stroke={armorStroke} strokeWidth="1"/>
            <path d="M68 35 Q78 28 88 35 Z" fill={accentColor} stroke={goldDetail} strokeWidth="0.5"/>
            
            {/* Флаг */}
            <line x1="50" y1="30" x2="50" y2="10" stroke={goldDetail} strokeWidth="2"/>
            <path d="M50 10 L65 15 L50 20 Z" fill={accentColor}/>
          </svg>
        );

      case 'b': // Соэй (монах-воин)
        return (
          <svg viewBox="0 0 100 120" style={{ width: s, height: s * 1.2 }}>
            <defs>
              <linearGradient id={`sam-b-${piece.color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#e8e0d8' : '#2d2520'}/>
                <stop offset="100%" stopColor={isWhite ? '#a09890' : '#1a1512'}/>
              </linearGradient>
            </defs>
            
            {/* Основание */}
            <ellipse cx="50" cy="110" rx="25" ry="8" fill={`url(#sam-b-${piece.color})`} stroke={armorStroke} strokeWidth="1"/>
            
            {/* Роба */}
            <path d="M25 110 Q15 80 30 55 Q50 45 70 55 Q85 80 75 110 Z" fill={`url(#sam-b-${piece.color})`} stroke={armorStroke} strokeWidth="2"/>
            
            {/* Складки робы */}
            <line x1="35" y1="60" x2="30" y2="105" stroke={armorStroke} strokeWidth="1" opacity="0.5"/>
            <line x1="50" y1="50" x2="50" y2="105" stroke={armorStroke} strokeWidth="1" opacity="0.5"/>
            <line x1="65" y1="60" x2="70" y2="105" stroke={armorStroke} strokeWidth="1" opacity="0.5"/>
            
            {/* Голова */}
            <circle cx="50" cy="40" r="14" fill={isWhite ? '#e8d4c0' : '#2d1f15'}/>
            
            {/* Капюшон */}
            <path d="M32 48 Q25 35 35 22 Q50 15 65 22 Q75 35 68 48 Q50 55 32 48 Z" fill={`url(#sam-b-${piece.color})`} stroke={armorStroke} strokeWidth="2"/>
            
            {/* Лицо */}
            <ellipse cx="50" cy="42" rx="8" ry="9" fill={isWhite ? '#d4c4b0' : '#3d2d25'}/>
            
            {/* Глаза (мудрые) */}
            <ellipse cx="46" cy="40" rx="2" ry="1.5" fill="#000"/>
            <ellipse cx="54" cy="40" rx="2" ry="1.5" fill="#000"/>
            
            {/* Медитативное выражение */}
            <path d="M46 46 Q50 48 54 46" fill="none" stroke={isWhite ? '#8b7355' : '#a08060'} strokeWidth="1"/>
            
            {/* Чётки */}
            <circle cx="25" cy="75" r="3" fill={accentColor}/>
            <circle cx="22" cy="80" r="2.5" fill={accentColor}/>
            <circle cx="20" cy="86" r="2" fill={accentColor}/>
            <line x1="25" y1="72" x2="20" y2="90" stroke={goldDetail} strokeWidth="0.5"/>
            
            {/* Посох сякудзё */}
            <line x1="78" y1="110" x2="78" y2="25" stroke={isWhite ? '#654321' : '#8b7355'} strokeWidth="4"/>
            
            {/* Металлические кольца на посохе */}
            <circle cx="78" cy="22" r="6" fill="none" stroke={steelColor} strokeWidth="2"/>
            <circle cx="78" cy="22" r="10" fill="none" stroke={steelColor} strokeWidth="1.5"/>
            <circle cx="78" cy="22" r="14" fill="none" stroke={steelColor} strokeWidth="1"/>
            
            {/* Символ ом на робе */}
            <circle cx="50" cy="75" r="8" fill="none" stroke={accentColor} strokeWidth="1.5"/>
            <path d="M46 75 L50 70 L54 75 L50 80 Z" fill={accentColor} opacity="0.5"/>
          </svg>
        );

      case 'n': // Самурай на коне
        return (
          <svg viewBox="0 0 100 120" style={{ width: s, height: s * 1.2 }}>
            <defs>
              <linearGradient id={`sam-n-${piece.color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#f0e8dc' : '#3d2d25'}/>
                <stop offset="100%" stopColor={isWhite ? '#b0a090' : '#1a1510'}/>
              </linearGradient>
            </defs>
            
            {/* Основание */}
            <ellipse cx="50" cy="110" rx="30" ry="8" fill={`url(#sam-n-${piece.color})`} stroke={armorStroke} strokeWidth="1"/>
            
            {/* Тело лошади */}
            <ellipse cx="55" cy="90" rx="30" ry="18" fill={`url(#sam-n-${piece.color})`} stroke={armorStroke} strokeWidth="2"/>
            
            {/* Ноги лошади */}
            <rect x="32" y="98" width="8" height="15" fill={`url(#sam-n-${piece.color})`} stroke={armorStroke} strokeWidth="1"/>
            <rect x="45" y="98" width="8" height="15" fill={`url(#sam-n-${piece.color})`} stroke={armorStroke} strokeWidth="1"/>
            <rect x="58" y="98" width="8" height="15" fill={`url(#sam-n-${piece.color})`} stroke={armorStroke} strokeWidth="1"/>
            <rect x="72" y="98" width="8" height="15" fill={`url(#sam-n-${piece.color})`} stroke={armorStroke} strokeWidth="1"/>
            
            {/* Шея лошади */}
            <path d="M30 85 Q20 60 28 45 Q38 40 42 50 Q40 70 35 85 Z" fill={`url(#sam-n-${piece.color})`} stroke={armorStroke} strokeWidth="2"/>
            
            {/* Голова лошади */}
            <ellipse cx="28" cy="45" rx="12" ry="10" fill={`url(#sam-n-${piece.color})`} stroke={armorStroke} strokeWidth="2"/>
            
            {/* Морда */}
            <ellipse cx="18" cy="52" rx="8" ry="6" fill={`url(#sam-n-${piece.color})`} stroke={armorStroke} strokeWidth="1"/>
            
            {/* Глаз лошади */}
            <circle cx="25" cy="42" r="3" fill="#000"/>
            <circle cx="24" cy="41" r="1" fill="#fff"/>
            
            {/* Уши лошади */}
            <polygon points="30,35 35,25 38,38" fill={`url(#sam-n-${piece.color})`} stroke={armorStroke} strokeWidth="1"/>
            <polygon points="22,35 18,22 28,32" fill={`url(#sam-n-${piece.color})`} stroke={armorStroke} strokeWidth="1"/>
            
            {/* Грива */}
            <path d="M35 42 Q45 35 42 50 Q50 45 45 60 Q55 55 48 70" fill="none" stroke={isWhite ? '#333' : '#888'} strokeWidth="3"/>
            
            {/* Седло */}
            <rect x="42" y="70" width="25" height="8" fill={accentColor} stroke={goldDetail} strokeWidth="1"/>
            
            {/* Всадник - самурай */}
            <rect x="45" y="50" width="20" height="25" fill={`url(#sam-n-${piece.color})`} stroke={armorStroke} strokeWidth="1"/>
            
            {/* Голова всадника */}
            <circle cx="55" cy="40" r="10" fill={isWhite ? '#f5e6d3' : '#3d2d25'} stroke={armorStroke} strokeWidth="1"/>
            
            {/* Шлем кабуто */}
            <path d="M43 42 Q43 32 55 28 Q67 32 67 42 Q55 45 43 42 Z" fill={`url(#sam-n-${piece.color})`} stroke={goldDetail} strokeWidth="1"/>
            
            {/* Гребень на шлеме */}
            <path d="M55 28 L55 20" stroke={accentColor} strokeWidth="3" strokeLinecap="round"/>
            
            {/* Глаза */}
            <ellipse cx="51" cy="40" rx="1.5" ry="1" fill="#000"/>
            <ellipse cx="59" cy="40" rx="1.5" ry="1" fill="#000"/>
            
            {/* Яри (копьё) */}
            <line x1="75" y1="85" x2="75" y2="15" stroke={isWhite ? '#654321' : '#8b7355'} strokeWidth="3"/>
            <polygon points="75,15 72,5 78,5" fill={steelColor} stroke={goldDetail} strokeWidth="0.5"/>
          </svg>
        );

      case 'p': // Асигару (пехотинец)
        return (
          <svg viewBox="0 0 100 110" style={{ width: s, height: s * 1.1 }}>
            <defs>
              <linearGradient id={`sam-p-${piece.color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#f0e8dc' : '#3d2d25'}/>
                <stop offset="100%" stopColor={isWhite ? '#b0a090' : '#1a1510'}/>
              </linearGradient>
            </defs>
            
            {/* Основание */}
            <ellipse cx="50" cy="100" rx="22" ry="7" fill={`url(#sam-p-${piece.color})`} stroke={armorStroke} strokeWidth="1"/>
            
            {/* Тело в лёгкой броне */}
            <path d="M30 100 Q25 75 35 60 Q50 50 65 60 Q75 75 70 100 Z" fill={`url(#sam-p-${piece.color})`} stroke={armorStroke} strokeWidth="2"/>
            
            {/* Простая грудная пластина */}
            <path d="M38 80 L50 65 L62 80 L50 95 Z" fill={`url(#sam-p-${piece.color})`} stroke={goldDetail} strokeWidth="0.5"/>
            
            {/* Голова */}
            <circle cx="50" cy="45" r="12" fill={isWhite ? '#f5e6d3' : '#3d2d25'} stroke={armorStroke} strokeWidth="1"/>
            
            {/* Простой шлем дзингаса */}
            <path d="M36 47 Q36 35 50 32 Q64 35 64 47 Q50 50 36 47 Z" fill={`url(#sam-p-${piece.color})`} stroke={armorStroke} strokeWidth="1.5"/>
            
            {/* Гребень на шлеме */}
            <ellipse cx="50" cy="34" rx="8" ry="3" fill={accentColor} stroke={goldDetail} strokeWidth="0.5"/>
            
            {/* Глаза */}
            <ellipse cx="46" cy="45" rx="2" ry="1.5" fill="#000"/>
            <ellipse cx="54" cy="45" rx="2" ry="1.5" fill="#000"/>
            
            {/* Голова повязка (хатимаки) */}
            <line x1="38" y1="42" x2="62" y2="42" stroke={accentColor} strokeWidth="3"/>
            
            {/* Катана */}
            <line x1="70" y1="95" x2="75" y2="50" stroke={steelColor} strokeWidth="2"/>
            <rect x="72" y="48" width="6" height="8" fill={goldDetail}/>
            
            {/* Яри (копьё) - опирается */}
            <line x1="25" y1="95" x2="30" y2="30" stroke={isWhite ? '#654321' : '#8b7355'} strokeWidth="2"/>
            <polygon points="30,30 28,22 32,22" fill={steelColor}/>
          </svg>
        );
    }
  };

  return (
    <div style={{ width: s, height: s * 1.3, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      {renderPiece()}
    </div>
  );
}

// ========== ГЛАВНЫЙ КОМПОНЕНТ ==========
function ChessPieceComponent({ piece, size = 60, className = '', pieceSetId = 'fantasy' }: ChessPieceProps) {
  const pieceSize = size;
  
  const renderPieceBySet = () => {
    switch (pieceSetId) {
      case 'fantasy':
        return <FantasyPiece piece={piece} size={pieceSize} />;
      case 'geometric':
        return <GeometricPiece piece={piece} size={pieceSize} />;
      case 'egyptian':
        return <EgyptianPiece piece={piece} size={pieceSize} />;
      case 'crystal':
        return <CrystalPiece piece={piece} size={pieceSize} />;
      case 'lewis':
        return <LewisPiece piece={piece} size={pieceSize} />;
      case 'minimal':
        return <MinimalPiece piece={piece} size={pieceSize} />;
      case 'samurai':
        return <SamuraiPiece piece={piece} size={pieceSize} />;
      default:
        return <FantasyPiece piece={piece} size={pieceSize} />;
    }
  };

  return (
    <div 
      className={`pointer-events-none ${className}`}
      style={{ 
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
      }}
    >
      {renderPieceBySet()}
    </div>
  );
}

export const ChessPiece3D = memo(ChessPieceComponent);
export default ChessPiece3D;
