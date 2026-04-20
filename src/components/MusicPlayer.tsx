import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const tracks = [
  { id: 1, title: 'Neon Dreams', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Silicon Soul', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Grid Runner', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlayState = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error(e));
    }
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  return (
    <section id="music-player-section" className="w-full xl:w-64 flex flex-col gap-4 font-mono text-white shrink-0">
      <div id="now-playing-card" className="p-4 neon-border-cyan bg-black/40 rounded-sm">
        <h2 id="now-playing-title" className="text-xs uppercase tracking-widest mb-4 opacity-70">Now Playing</h2>
        
        <div id="track-art" className="mb-4 aspect-square bg-gradient-to-tr from-cyan-900 to-pink-900 flex items-center justify-center neon-border-pink relative group">
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-2">
            <p id="current-track-name" className="text-sm font-bold uppercase">{currentTrack.title}</p>
            <p className="text-[10px] opacity-60 mt-1">AI GENERATOR X</p>
          </div>
        </div>

        <div id="player-controls" className="flex justify-between items-center px-2 mb-2 relative z-10">
          <button id="btn-skip-back" onClick={skipBack} className="hover:text-cyan-400 transition-colors cursor-pointer p-3 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            id="btn-play-pause"
            onClick={togglePlayState} 
            className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full border border-pink-500 flex items-center justify-center hover:bg-pink-500/20 transition-all cursor-pointer shadow-[0_0_8px_rgba(255,0,200,0.3)]"
          >
            {isPlaying ? 
              <Pause className="w-5 h-5 fill-current" /> : 
              <Play className="w-5 h-5 fill-current ml-1" />
            }
          </button>
          <button id="btn-skip-forward" onClick={skipForward} className="hover:text-cyan-400 transition-colors cursor-pointer p-3 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        <div id="volume-control-card" className="p-3 border border-pink-500/30 rounded-sm bg-pink-500/5 mt-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px]">VOLUME</p>
            <button id="btn-mute-toggle" onClick={() => setIsMuted(!isMuted)} className="hover:text-pink-400 transition-colors cursor-pointer opacity-70 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 -mt-2">
              {isMuted || volume === 0 ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </button>
          </div>
          <div className="w-full relative flex items-center">
            <input 
              id="volume-slider"
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-full cursor-pointer relative z-20"
            />
          </div>
        </div>
      </div>

      <div id="playlist-container" className="flex-grow flex flex-col gap-2 overflow-hidden mt-2">
        <p className="text-[10px] uppercase tracking-widest opacity-40 px-2">Playlist</p>
        {tracks.map((track, idx) => (
          <div 
            key={track.id}
            id={`playlist-track-${track.id}`}
            onClick={() => {
              setCurrentTrackIndex(idx);
              if (!isPlaying) setIsPlaying(true);
            }}
            className={`p-4 min-h-[44px] text-xs flex items-center justify-between cursor-pointer transition-colors ${
              currentTrackIndex === idx 
                ? 'bg-cyan-500/10 border-l-2 border-cyan-500 neon-text-cyan' 
                : 'bg-white/5 border-l-2 border-transparent text-white/70 hover:bg-white/10'
            }`}
          >
            <span className="truncate pr-2">0{idx + 1}. {track.title.toUpperCase()}</span>
            <span className="opacity-50 flex-shrink-0">--:--</span>
          </div>
        ))}
      </div>

      <audio 
        id="audio-element"
        ref={audioRef}
        src={currentTrack.src}
        onEnded={skipForward}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </section>
  );
}
