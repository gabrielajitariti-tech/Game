export default function GameOver({ score, onRestart, onQuit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" data-testid="game-over-screen">
      <div className="absolute inset-0 bg-black/90" />

      <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in">
        <h1
          className="font-heading text-5xl sm:text-6xl lg:text-7xl text-red-900 tracking-tight font-bold"
          style={{ textShadow: '0 0 30px rgba(127,29,29,0.6)' }}
          data-testid="death-title"
        >
          YOU DIED
        </h1>

        <div className="text-amber-400/60 text-sm font-mono tracking-wider" data-testid="final-score">
          SOULS COLLECTED: {score}
        </div>

        <div className="flex flex-col gap-4 mt-4 items-center">
          <button
            data-testid="restart-btn"
            onClick={onRestart}
            className="bg-transparent border border-red-900/50 text-red-50 hover:bg-red-900/20 hover:border-red-500 hover:text-white transition-all duration-300 px-10 py-3 tracking-[0.2em] uppercase text-sm font-bold min-w-[200px]"
          >
            Rise Again
          </button>
          <button
            data-testid="quit-btn"
            onClick={onQuit}
            className="bg-transparent text-slate-400 hover:text-white transition-all duration-300 px-10 py-3 tracking-widest uppercase text-xs min-w-[200px]"
          >
            Return to Void
          </button>
        </div>
      </div>
    </div>
  );
}
