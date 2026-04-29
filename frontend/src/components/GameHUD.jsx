export default function GameHUD({ health, maxHealth, mana, maxMana, score }) {
  const hp = Math.max(0, (health / maxHealth) * 100);
  const mp = Math.max(0, (mana / maxMana) * 100);

  return (
    <div
      className="fixed top-0 left-0 right-0 pointer-events-none z-40 p-5 sm:p-6"
      data-testid="game-hud"
    >
      <div className="flex justify-between items-start">
        {/* Left - Health & Mana */}
        <div className="flex flex-col gap-2" data-testid="hud-stats">
          {/* Health */}
          <div className="flex items-center gap-3">
            <div
              className="w-44 sm:w-52 h-4 bg-black/60 border border-white/10 overflow-hidden"
              style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}
              data-testid="health-bar-container"
            >
              <div
                className="h-full transition-all duration-300"
                data-testid="health-bar"
                style={{
                  width: `${hp}%`,
                  background: 'linear-gradient(90deg, #991B1B, #DC2626)',
                }}
              />
            </div>
            <span
              className="text-red-400 text-xs font-mono"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
            >
              {Math.ceil(health)}/{maxHealth}
            </span>
          </div>

          {/* Mana */}
          <div className="flex items-center gap-3">
            <div
              className="w-32 sm:w-40 h-2.5 bg-black/60 border border-white/10 overflow-hidden"
              style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}
              data-testid="mana-bar-container"
            >
              <div
                className="h-full transition-all duration-300"
                data-testid="mana-bar"
                style={{
                  width: `${mp}%`,
                  background: 'linear-gradient(90deg, #0369A1, #38BDF8)',
                }}
              />
            </div>
            <span
              className="text-sky-400 text-xs font-mono"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
            >
              {Math.ceil(mana)}/{maxMana}
            </span>
          </div>
        </div>

        {/* Right - Score */}
        <div
          className="text-right"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
        >
          <div
            className="text-amber-400 text-sm font-mono tracking-wider"
            data-testid="score-display"
          >
            SOULS: {score}
          </div>
        </div>
      </div>

      {/* Bottom - Key Hints */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-2" data-testid="key-hints">
        <div className="w-9 h-9 bg-black/40 border border-white/10 flex items-center justify-center text-slate-500 text-[10px] font-mono rounded-sm">
          J
        </div>
        <div className="w-9 h-9 bg-black/40 border border-sky-500/20 flex items-center justify-center text-sky-500/60 text-[10px] font-mono rounded-sm">
          K
        </div>
        <div className="w-9 h-9 bg-black/40 border border-white/10 flex items-center justify-center text-slate-500 text-[10px] font-mono rounded-sm">
          Shift
        </div>
        <div className="w-9 h-9 bg-black/40 border border-white/10 flex items-center justify-center text-slate-500 text-[10px] font-mono rounded-sm">
          I
        </div>
      </div>
    </div>
  );
}
