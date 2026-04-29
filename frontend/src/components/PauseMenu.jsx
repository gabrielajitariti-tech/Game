export default function PauseMenu({ onResume, onQuit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" data-testid="pause-menu">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in">
        <h2 className="font-heading text-4xl sm:text-5xl tracking-tight text-red-50 font-bold">
          PAUSED
        </h2>

        <div className="flex flex-col gap-4 items-center">
          <button
            data-testid="resume-btn"
            onClick={onResume}
            className="bg-transparent border border-red-900/50 text-red-50 hover:bg-red-900/20 hover:border-red-500 hover:text-white transition-all duration-300 px-10 py-3 tracking-[0.2em] uppercase text-sm font-bold min-w-[200px]"
          >
            Resume
          </button>
          <button
            data-testid="quit-to-menu-btn"
            onClick={onQuit}
            className="bg-transparent text-slate-400 hover:text-white transition-all duration-300 px-10 py-3 tracking-widest uppercase text-xs min-w-[200px]"
          >
            Quit to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
