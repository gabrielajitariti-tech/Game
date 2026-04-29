export default function VictoryScreen({ score, onRestart, onQuit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" data-testid="victory-screen">
      <div className="absolute inset-0 bg-black/85" />

      <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in">
        <h1
          className="font-heading text-5xl sm:text-6xl lg:text-7xl tracking-tight font-bold"
          style={{
            color: '#FBBF24',
            textShadow: '0 0 40px rgba(251,191,36,0.4), 0 0 80px rgba(251,191,36,0.15)',
          }}
          data-testid="victory-title"
        >
          VICTORY
        </h1>

        <p className="text-slate-300 text-base font-body tracking-wide text-center max-w-sm">
          The Demon Knight has fallen. The hollow echoes your triumph.
        </p>

        <div className="text-amber-400 text-sm font-mono tracking-wider" data-testid="victory-score">
          SOULS COLLECTED: {score}
        </div>

        <div className="flex flex-col gap-4 mt-4 items-center">
          <button
            data-testid="play-again-btn"
            onClick={onRestart}
            className="bg-transparent border border-amber-600/50 text-amber-50 hover:bg-amber-900/20 hover:border-amber-400 hover:text-white transition-all duration-300 px-10 py-3 tracking-[0.2em] uppercase text-sm font-bold min-w-[200px]"
          >
            Play Again
          </button>
          <button
            data-testid="victory-quit-btn"
            onClick={onQuit}
            className="bg-transparent text-slate-400 hover:text-white transition-all duration-300 px-10 py-3 tracking-widest uppercase text-xs min-w-[200px]"
          >
            Return to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
