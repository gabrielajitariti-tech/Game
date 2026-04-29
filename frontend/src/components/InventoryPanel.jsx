import { RARITY_COLORS } from '../game/Items';
import { Sword, Shield, Gem, X } from 'lucide-react';

const SlotIcon = ({ type, size = 20 }) => {
  if (type === 'sword') return <Sword size={size} strokeWidth={1.5} />;
  if (type === 'shield') return <Shield size={size} strokeWidth={1.5} />;
  return <Gem size={size} strokeWidth={1.5} />;
};

const ItemTooltip = ({ item }) => (
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0A0A0C]/95 border border-white/15 p-3 w-44 z-50 pointer-events-none shadow-xl">
    <div className="text-xs font-bold" style={{ color: RARITY_COLORS[item.rarity] }}>
      {item.name}
    </div>
    <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">{item.description}</div>
    <div className="text-[10px] text-slate-300 mt-1.5 space-y-0.5">
      {item.bonusDamage ? <div>+{item.bonusDamage} Damage</div> : null}
      {item.bonusDefense ? <div>+{item.bonusDefense} Defense</div> : null}
      {item.bonusSpeed ? <div>+{item.bonusSpeed} Speed</div> : null}
      {item.bonusHealth ? <div>+{item.bonusHealth} Health</div> : null}
      {item.bonusMana ? <div>+{item.bonusMana} Mana</div> : null}
    </div>
  </div>
);

export default function InventoryPanel({ inventory, equipment, onEquip, onUnequip, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" data-testid="inventory-panel">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div
        className="relative z-10 bg-[#0A0A0C] border border-white/10 shadow-2xl p-6 sm:p-8 w-[90vw] max-w-[560px] max-h-[80vh] overflow-auto animate-fade-in"
        style={{
          clipPath: 'polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))',
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-2xl sm:text-3xl text-red-50 tracking-tight font-bold">
            Equipment
          </h2>
          <button
            data-testid="close-inventory-btn"
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Equipment Slots */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {['weapon', 'armor', 'accessory'].map((slot) => (
            <div key={slot} className="flex flex-col items-center gap-2">
              <span className="text-[10px] tracking-[0.2em] uppercase text-slate-500 font-body">
                {slot}
              </span>
              <div
                data-testid={`equip-slot-${slot}`}
                className={`w-16 h-16 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  equipment[slot]
                    ? 'bg-blue-900/20 border border-blue-500/50 shadow-[inset_0_0_15px_rgba(59,130,246,0.15)]'
                    : 'bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/8'
                }`}
                onClick={() => equipment[slot] && onUnequip(slot)}
              >
                {equipment[slot] ? (
                  <div className="flex flex-col items-center">
                    <div style={{ color: RARITY_COLORS[equipment[slot].rarity] }}>
                      <SlotIcon type={equipment[slot].icon} size={18} />
                    </div>
                    <div
                      className="text-[8px] mt-0.5 truncate w-14 text-center"
                      style={{ color: RARITY_COLORS[equipment[slot].rarity] }}
                    >
                      {equipment[slot].name}
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-600 text-[10px]">Empty</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Inventory Grid */}
        <div>
          <h3 className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-3 font-body">
            Inventory
          </h3>
          {inventory.length === 0 ? (
            <p className="text-slate-600 text-sm font-body">No items collected yet...</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {inventory.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  data-testid={`inventory-item-${item.id}`}
                  className="relative bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-200 p-3 cursor-pointer group"
                  onClick={() => onEquip(item)}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div style={{ color: RARITY_COLORS[item.rarity] }}>
                      <SlotIcon type={item.icon} />
                    </div>
                    <span
                      className="text-[10px] text-center leading-tight"
                      style={{ color: RARITY_COLORS[item.rarity] }}
                    >
                      {item.name}
                    </span>
                  </div>
                  <div className="hidden group-hover:block">
                    <ItemTooltip item={item} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-slate-600 text-[10px] mt-6 text-center tracking-widest uppercase font-body">
          Click item to equip &mdash; Click equipped slot to unequip
        </p>
      </div>
    </div>
  );
}
