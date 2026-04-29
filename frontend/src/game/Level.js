export function getLevel1() {
  const G = 700;

  const platforms = [
    // === SECTION 1: STARTING GROUNDS (0-1000) ===
    { x: 0, y: G, width: 1000, height: 120 },
    { x: 350, y: G - 120, width: 120, height: 24 },

    // === SECTION 2: RUINED OUTSKIRTS (1000-2400) ===
    { x: 1100, y: G, width: 250, height: 120 },
    { x: 1450, y: G - 60, width: 150, height: 24 },
    { x: 1700, y: G, width: 300, height: 120 },
    { x: 1200, y: G - 180, width: 130, height: 24 },
    { x: 1450, y: G - 260, width: 130, height: 24 },
    { x: 1700, y: G - 180, width: 130, height: 24 },
    { x: 2050, y: G, width: 400, height: 120 },

    // === SECTION 3: DARK FOREST (2400-3800) ===
    { x: 2500, y: G - 80, width: 150, height: 24 },
    { x: 2700, y: G - 160, width: 150, height: 24 },
    { x: 2500, y: G - 240, width: 150, height: 24 },
    { x: 2300, y: G - 320, width: 200, height: 24 },
    { x: 2100, y: G + 150, width: 800, height: 120 },
    { x: 2700, y: G - 320, width: 120, height: 24 },
    { x: 2950, y: G - 320, width: 250, height: 24 },
    { x: 3250, y: G - 320, width: 200, height: 24 },
    { x: 3200, y: G - 420, width: 200, height: 24 },
    { x: 3500, y: G - 320, width: 200, height: 24 },
    { x: 3500, y: G, width: 350, height: 120 },

    // === SECTION 4: CAVERNS (3800-5200) ===
    { x: 3900, y: G, width: 200, height: 120 },
    { x: 4150, y: G - 80, width: 150, height: 24 },
    { x: 4350, y: G - 160, width: 150, height: 24 },
    { x: 4150, y: G - 240, width: 150, height: 24 },
    { x: 4350, y: G - 320, width: 150, height: 24 },
    { x: 4100, y: G - 420, width: 500, height: 24 },
    { x: 4090, y: G - 420, width: 24, height: 440 },
    { x: 4550, y: G, width: 600, height: 120 },
    { x: 4650, y: G - 140, width: 150, height: 24 },
    { x: 4900, y: G - 220, width: 150, height: 24 },

    // === SECTION 5: CASTLE APPROACH (5200-6600) ===
    { x: 5200, y: G, width: 200, height: 120 },
    { x: 5450, y: G - 70, width: 160, height: 24 },
    { x: 5650, y: G - 150, width: 160, height: 24 },
    { x: 5850, y: G - 230, width: 160, height: 24 },
    { x: 6050, y: G - 230, width: 30, height: 350 },
    { x: 6050, y: G - 400, width: 600, height: 24 },
    { x: 6150, y: G - 230, width: 120, height: 24 },
    { x: 6350, y: G - 300, width: 120, height: 24 },
    { x: 6500, y: G, width: 200, height: 120 },

    // === SECTION 6: CASTLE INTERIOR (6600-8200) ===
    { x: 6600, y: G, width: 1700, height: 120 },
    { x: 6800, y: G - 160, width: 160, height: 24 },
    { x: 7100, y: G - 260, width: 160, height: 24 },
    { x: 7400, y: G - 160, width: 160, height: 24 },
    { x: 7700, y: G - 260, width: 160, height: 24 },
    { x: 6900, y: G - 260, width: 24, height: 260 },
    { x: 7300, y: G - 260, width: 24, height: 260 },
    { x: 7000, y: G - 360, width: 400, height: 24 },
    { x: 7600, y: G - 360, width: 400, height: 24 },

    // === SECTION 7: THRONE ROOM (8200-9400) ===
    { x: 8300, y: G, width: 1000, height: 120 },
    { x: 8290, y: G - 400, width: 24, height: 400 },
    { x: 9290, y: G - 400, width: 24, height: 400 },
    { x: 8500, y: G - 160, width: 130, height: 24 },
    { x: 8900, y: G - 160, width: 130, height: 24 },
    { x: 8700, y: G - 300, width: 160, height: 24 },
  ];

  const enemies = [
    // Section 1
    { type: 'skeleton', x: 700, y: G - 50 },
    // Section 2
    { type: 'skeleton', x: 1150, y: G - 50 },
    { type: 'skeleton', x: 1800, y: G - 50 },
    { type: 'wraith', x: 1450, y: G - 340 },
    // Section 3
    { type: 'skeleton', x: 2300, y: G + 100 },
    { type: 'wraith', x: 2600, y: G - 400 },
    { type: 'skeleton', x: 3100, y: G - 370 },
    { type: 'skeleton', x: 3550, y: G - 50 },
    // Section 4
    { type: 'skeleton', x: 4200, y: G - 130 },
    { type: 'skeleton', x: 4400, y: G - 210 },
    { type: 'wraith', x: 4750, y: G - 300 },
    // Section 5
    { type: 'skeleton', x: 5500, y: G - 120 },
    { type: 'wraith', x: 5800, y: G - 320 },
    { type: 'skeleton', x: 6200, y: G - 280 },
    // Section 6
    { type: 'skeleton', x: 6900, y: G - 50 },
    { type: 'skeleton', x: 7200, y: G - 50 },
    { type: 'wraith', x: 7500, y: G - 430 },
    { type: 'skeleton', x: 7800, y: G - 50 },
    // Section 7 - Boss
    { type: 'demon_knight', x: 8800, y: G - 75 },
  ];

  const pickups = [
    { type: 'health', x: 380, y: G - 150, amount: 25 },
    { type: 'mana', x: 1500, y: G - 90, amount: 30 },
    { type: 'health', x: 2100, y: G - 30, amount: 30 },
    { type: 'health', x: 2500, y: G + 120, amount: 40 },
    { type: 'mana', x: 3300, y: G - 350, amount: 35 },
    { type: 'health', x: 4200, y: G - 270, amount: 35 },
    { type: 'mana', x: 4600, y: G - 30, amount: 35 },
    { type: 'health', x: 5700, y: G - 180, amount: 40 },
    { type: 'health', x: 7050, y: G - 390, amount: 40 },
    { type: 'mana', x: 7650, y: G - 390, amount: 40 },
    { type: 'health', x: 8350, y: G - 30, amount: 50 },
  ];

  const chests = [
    { x: 1730, y: G - 208, width: 32, height: 28, loot: 'tattered_cloak', opened: false },
    { x: 2350, y: G - 348, width: 32, height: 28, loot: 'shadow_blade', opened: false },
    { x: 2400, y: G + 122, width: 32, height: 28, loot: 'mana_ring', opened: false },
    { x: 3250, y: G - 448, width: 32, height: 28, loot: 'knights_plate', opened: false },
    { x: 4200, y: G - 268, width: 32, height: 28, loot: 'speed_boots', opened: false },
    { x: 4920, y: G - 248, width: 32, height: 28, loot: 'soul_siphon', opened: false },
    { x: 5880, y: G - 258, width: 32, height: 28, loot: 'cursed_blade', opened: false },
    { x: 6300, y: G - 428, width: 32, height: 28, loot: 'shadow_mantle', opened: false },
    { x: 7120, y: G - 288, width: 32, height: 28, loot: 'crit_charm', opened: false },
    { x: 7700, y: G - 388, width: 32, height: 28, loot: 'dragon_scale', opened: false },
    { x: 8700, y: G - 328, width: 32, height: 28, loot: 'flame_edge', opened: false },
  ];

  return {
    platforms,
    enemies,
    pickups,
    chests,
    playerSpawn: { x: 100, y: G - 60 },
    worldWidth: 9500,
    worldHeight: 1100,
  };
}
