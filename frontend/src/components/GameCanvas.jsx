import { useRef, useEffect, useCallback } from 'react';
import { GameEngine } from '../game/GameEngine';

export default function GameCanvas({ onStateUpdate, onEngineReady }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const engine = new GameEngine(canvas, { onStateUpdate });
    engineRef.current = engine;
    if (onEngineReady) onEngineReady(engine);

    window.addEventListener('resize', handleResize);

    return () => {
      engine.destroy();
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="game-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'block',
        background: '#050507',
      }}
    />
  );
}
