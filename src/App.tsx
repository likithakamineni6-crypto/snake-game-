import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div id="app-root" className="min-h-screen bg-[#050505] text-[#ffffff] font-mono flex flex-col p-4 md:p-8 box-border selection:bg-pink-500/30">
      <header id="app-header" className="w-full flex justify-center md:justify-start items-center mb-6">
        <h1 id="app-title" className="text-3xl md:text-5xl font-extrabold font-['Syne'] italic neon-text-cyan tracking-tighter uppercase">
          SYNTH-SNAKE v1.0
        </h1>
      </header>

      <main id="main-content" className="flex flex-col xl:flex-row w-full flex-grow gap-8 items-start justify-center overflow-x-hidden">
        <MusicPlayer />
        <SnakeGame />
      </main>

      <footer id="app-footer" className="w-full mt-6 pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-widest opacity-40 gap-2">
        <p>&copy; 2026 NEON-ARCADE INDUSTRIES</p>
        <p>LATENCY: 12MS // BUFFER: 100%</p>
      </footer>
    </div>
  );
}
