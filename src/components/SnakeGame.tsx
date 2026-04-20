import { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

const generateFood = (currentSnake: {x: number, y: number}[]) => {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!onSnake) break;
  }
  return newFood;
};

export function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
    containerRef.current?.focus();
  };

  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Enter') {
        if (gameOver) {
          resetGame();
        } else {
          setIsPaused(prev => !prev);
        }
        return;
      }

      if (gameOver || isPaused) return;

      setDirection(prevDir => {
        switch (e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            return prevDir.y === 1 ? prevDir : { x: 0, y: -1 };
          case 'ArrowDown':
          case 's':
          case 'S':
            return prevDir.y === -1 ? prevDir : { x: 0, y: 1 };
          case 'ArrowLeft':
          case 'a':
          case 'A':
            return prevDir.x === 1 ? prevDir : { x: -1, y: 0 };
          case 'ArrowRight':
          case 'd':
          case 'D':
            return prevDir.x === -1 ? prevDir : { x: 1, y: 0 };
          default:
            return prevDir;
        }
      });
    };

    const container = containerRef.current;
    container?.addEventListener('keydown', handleKeyDown);
    return () => container?.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          setHighScore(prev => Math.max(prev, score));
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speedOptions = Math.max(50, 150 - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speedOptions);

    return () => clearInterval(intervalId);
  }, [direction.x, direction.y, food.x, food.y, gameOver, isPaused, score]);

  return (
    <div id="snake-game-container" className="flex flex-col xl:flex-row flex-grow gap-8 w-full font-mono text-white">
      {/* Main Game Section */}
      <section id="game-board-section" className="flex-grow flex flex-col items-center">
        <div 
          id="game-board"
          ref={containerRef}
          tabIndex={0}
          className="relative neon-border-cyan grid-bg bg-black p-0 overflow-hidden outline-none w-full max-w-[500px] aspect-square rounded-sm"
        >
          {snake.map((segment, index) => (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute z-10 ${index === 0 ? 'snake-segment' : 'snake-segment bg-opacity-80'}`}
              style={{
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                transform: 'scale(1)',
              }}
            />
          ))}

          <div
            className="absolute z-10 food-segment animate-pulse"
            style={{
              left: `${(food.x / GRID_SIZE) * 100}%`,
              top: `${(food.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              transform: 'scale(0.8)',
            }}
          />

          {/* In-game Overlays */}
          <div className="absolute bottom-4 left-4 text-[10px] opacity-30 pointer-events-none hidden sm:block">
            [ WASD ] TO NAVIGATE . . .
          </div>
          <div className="absolute top-4 right-4 text-[10px] text-pink-500 opacity-80 pointer-events-none hidden sm:block">
            SYSTEM: STABLE
          </div>

          {gameOver && (
            <div id="game-over-overlay" className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
              <h2 className="text-4xl justify-center font-bold font-['Syne'] italic neon-text-pink text-pink-500 mb-2 animate-pulse">
                SYSTEM FAILURE
              </h2>
              <p className="text-white/60 mb-6 text-sm tracking-widest uppercase">Process Terminated</p>
              <button
                id="btn-reboot"
                onClick={resetGame}
                className="px-6 py-3 min-h-[44px] border border-pink-500 neon-text-pink text-pink-500 bg-pink-500/10 hover:bg-pink-500/30 text-xs font-bold tracking-widest uppercase rounded-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Reboot System
              </button>
            </div>
          )}

          {!gameOver && isPaused && (
            <div id="game-paused-overlay" className="absolute inset-0 z-20 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
              <h2 className="text-3xl font-bold font-['Syne'] italic neon-text-cyan text-cyan-400 mb-4 tracking-widest uppercase">
                PAUSED
              </h2>
              <button
                id="btn-resume"
                onClick={() => {
                  setIsPaused(false);
                  containerRef.current?.focus();
                }}
                className="px-6 py-3 min-h-[44px] border border-cyan-500 neon-text-cyan text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/30 text-xs font-bold tracking-widest uppercase rounded-sm transition-all cursor-pointer"
              >
                Resume Process
              </button>
            </div>
          )}
        </div>
        
        <p className="text-[10px] text-white/40 mt-4 uppercase tracking-widest sm:hidden">
          Touch to focus, tap space to pause
        </p>
      </section>

      {/* Right Stats Section */}
      <section id="game-stats-section" className="w-full xl:w-48 flex flex-col gap-4 shrink-0">
        <div id="score-container" className="flex xl:flex-col justify-between items-end gap-2 px-2 xl:px-0 w-full mb-2">
          <div className="text-left xl:text-right w-full">
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-50">Current Score</p>
            <p id="current-score" className="text-3xl font-bold neon-text-pink">{score.toString().padStart(5, '0')}</p>
          </div>
          <div className="text-right w-full">
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-50">Hi-Score</p>
            <p id="high-score" className="text-3xl font-bold opacity-80">{highScore.toString().padStart(5, '0')}</p>
          </div>
        </div>

        <div id="detailed-stats-card" className="p-4 border border-white/10 rounded-sm bg-white/5 flex-grow hidden xl:block">
          <h3 className="text-[10px] uppercase tracking-widest mb-6">Game Stats</h3>
          <div className="space-y-4">
            <div className="border-b border-white/5 pb-2">
              <p className="text-[9px] opacity-40">SYSTEM STATE</p>
              <p className="text-xl">{gameOver ? 'OFFLINE' : (isPaused ? 'PAUSED' : 'ONLINE')}</p>
            </div>
            <div className="border-b border-white/5 pb-2">
              <p className="text-[9px] opacity-40">MULTIPLIER</p>
              <p className="text-xl">x1.0</p>
            </div>
            <div className="border-b border-white/5 pb-2">
              <p className="text-[9px] opacity-40">BLOCKS</p>
              <p className="text-xl">{snake.length}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
