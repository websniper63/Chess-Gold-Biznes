'use client';

import { useCallback, useRef, useEffect } from 'react';

// Типы звуков
export type SoundType = 'move' | 'capture' | 'check' | 'checkmate' | 'gameEnd' | 'select';

// Создаём аудио контекст
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

// Генерация звука хода (мягкий клик)
function generateMoveSound(ctx: AudioContext): { oscillator: OscillatorNode, gain: GainNode } {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
  
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
  
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  
  return { oscillator, gain };
}

// Генерация звука взятия (более резкий)
function generateCaptureSound(ctx: AudioContext): { oscillator: OscillatorNode, gain: GainNode } {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(300, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
  
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  
  return { oscillator, gain };
}

// Генерация звука шаха (тревожный)
function generateCheckSound(ctx: AudioContext): { oscillator: OscillatorNode, gain: GainNode } {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(600, ctx.currentTime);
  oscillator.frequency.setValueAtTime(700, ctx.currentTime + 0.1);
  oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.2);
  
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  
  return { oscillator, gain };
}

// Генерация звука мата/конца игры
function generateGameEndSound(ctx: AudioContext): { oscillator: OscillatorNode, gain: GainNode } {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(523, ctx.currentTime); // C5
  oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.15); // E5
  oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.3); // G5
  
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
  
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  
  return { oscillator, gain };
}

// Генерация звука выбора фигуры
function generateSelectSound(ctx: AudioContext): { oscillator: OscillatorNode, gain: GainNode } {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.03);
  
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
  
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  
  return { oscillator, gain };
}

export function useSounds(enabled: boolean = true) {
  const enabledRef = useRef(enabled);
  
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);
  
  const playSound = useCallback((type: SoundType) => {
    if (!enabledRef.current) return;
    
    try {
      const ctx = getAudioContext();
      
      // Возобновляем контекст если он приостановлен (требование браузеров)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      let sound: { oscillator: OscillatorNode, gain: GainNode };
      
      switch (type) {
        case 'move':
          sound = generateMoveSound(ctx);
          sound.oscillator.start(ctx.currentTime);
          sound.oscillator.stop(ctx.currentTime + 0.1);
          break;
          
        case 'capture':
          sound = generateCaptureSound(ctx);
          sound.oscillator.start(ctx.currentTime);
          sound.oscillator.stop(ctx.currentTime + 0.2);
          break;
          
        case 'check':
          sound = generateCheckSound(ctx);
          sound.oscillator.start(ctx.currentTime);
          sound.oscillator.stop(ctx.currentTime + 0.35);
          break;
          
        case 'checkmate':
        case 'gameEnd':
          sound = generateGameEndSound(ctx);
          sound.oscillator.start(ctx.currentTime);
          sound.oscillator.stop(ctx.currentTime + 0.55);
          break;
          
        case 'select':
          sound = generateSelectSound(ctx);
          sound.oscillator.start(ctx.currentTime);
          sound.oscillator.stop(ctx.currentTime + 0.06);
          break;
      }
    } catch (error) {
      // Игнорируем ошибки аудио
      console.warn('Audio error:', error);
    }
  }, []);
  
  return { playSound };
}

export default useSounds;
