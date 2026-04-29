export default function MainMenu({ onStartGame }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      data-testid="main-menu"
      style={{
        backgroundImage:
          'url(https://images.pexels.com/photos/29672206/pexels-photo-29672206.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <div className="relative z-10 flex flex-col items-center gap-10">
        <div className="text-center animate-fade-in">
          <h1
            className="font-heading text-5xl sm:text-6xl lg:text-7xl tracking-tight font-bold text-red-50"
            style={{
              textShadow: '0 0 40px rgba(127,29,29,0.5), 0 0 80px rgba(127,29,29,0.2)',
            }}
            data-testid="game-title"
          >
            DARK HOLLOW
          </h1>
          <p className="mt-4 text-sm tracking-[0.3em] uppercase text-slate-400 font-body">
            A Journey Through Shadow
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center animate-slide-up">
          <button
            data-testid="start-game-btn"
            onClick={onStartGame}
            className="bg-transparent border border-red-900/50 text-red-50 hover:bg-red-900/20 hover:border-red-500 hover:text-white transition-all duration-300 px-12 py-4 tracking-[0.2em] uppercase text-sm font-bold"
          >
            Begin Journey
          </button>
        </div>

        <div className="text-center text-slate-500 text-xs tracking-widest uppercase space-y-1.5 mt-6 animate-fade-in font-body" data-testid="controls-info">
          <p>WASD / Arrows &mdash; Move &amp; Jump</p>
          <p>Space &mdash; Jump &nbsp; | &nbsp; Shift &mdash; Dash</p>
          <p>J &mdash; Attack &nbsp; | &nbsp; K &mdash; Soul Blast</p>
          <p>I or E &mdash; Inventory &nbsp; | &nbsp; Esc &mdash; Pause</p>
        </div>
      </div>
    </div>
  );
}
