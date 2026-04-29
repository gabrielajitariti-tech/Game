export function getLevel1() {
  const G = 700;

  const platforms = [
    // === Starting Area ===
    { x: 0, y: G, width: 1000, height: 120 },

    // === First Gaps ===
    { x: 1100, y: G, width: 200, height: 120 },
    { x: 1400, y: G - 80, width: 150, height: 24 },
    { x: 1650, y: G - 160, width: 150, height: 24 },
    { x: 1900, y: G, width: 400, height: 120 },

    // === Vertical Climb ===
    { x: 2100, y: G - 120, width: 130, height: 24 },
    { x: 1980, y: G - 250, width: 130, height: 24 },
    { x: 2130, y: G - 370, width: 130, height: 24 },
    { x: 1980, y: G - 490, width: 220, height: 24 },

    // === Upper Path ===
    { x: 2300, y: G - 490, width: 900, height: 24 },
    { x: 3300, y: G - 410, width: 200, height: 24 },
    { x: 3600, y: G - 330, width: 200, height: 24 },

    // === Mid Section ===
    { x: 3900, y: G - 200, width: 500, height: 24 },
    { x: 3900, y: G, width: 500, height: 120 },

    // === Castle Section ===
    { x: 4500, y: G, width: 1600, height: 120 },
    { x: 4600, y: G - 160, width: 180, height: 24 },
    { x: 4900, y: G - 260, width: 160, height: 24 },
    { x: 5200, y: G - 160, width: 180, height: 24 },

    // === Boss Arena ===
    { x: 5500, y: G, width: 600, height: 120 },
    // Arena walls
    { x: 5490, y: G - 350, width: 24, height: 350 },
    { x: 6086, y: G - 350, width: 24, height: 350 },
  ];

  const enemies = [
    { type: 'skeleton', x: 550, y: G - 50 },
    { type: 'skeleton', x: 820, y: G - 50 },
    { type: 'skeleton', x: 1950, y: G - 50 },
    { type: 'wraith', x: 1500, y: G - 250 },
    { type: 'wraith', x: 2600, y: G - 570 },
    { type: 'skeleton', x: 2900, y: G - 540 },
    { type: 'skeleton', x: 4650, y: G - 50 },
    { type: 'skeleton', x: 4950, y: G - 50 },
    { type: 'wraith', x: 5100, y: G - 320 },
    { type: 'demon_knight', x: 5720, y: G - 70 },
  ];

  const pickups = [
    { type: 'health', x: 450, y: G - 30, amount: 30 },
    { type: 'mana', x: 1200, y: G - 30, amount: 30 },
    { type: 'item', x: 1650, y: G - 200, itemId: 'shadow_blade' },
    { type: 'health', x: 2050, y: G - 530, amount: 40 },
    { type: 'item', x: 2500, y: G - 530, itemId: 'knights_plate' },
    { type: 'mana', x: 3400, y: G - 450, amount: 40 },
    { type: 'item', x: 3700, y: G - 370, itemId: 'speed_boots' },
    { type: 'health', x: 4100, y: G - 240, amount: 50 },
    { type: 'item', x: 5200, y: G - 200, itemId: 'flame_edge' },
  ];

  return {
    platforms,
    enemies,
    pickups,
    playerSpawn: { x: 100, y: G - 60 },
    worldWidth: 6200,
    worldHeight: 950,
  };
}
