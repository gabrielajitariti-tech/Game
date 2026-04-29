# Dark Hollow - 2D Platformer Hack and Slash

## Original Problem Statement
Create a 2D platformer hack and slash game with dark fantasy theme, inspired by Hollow Knight, Silksong, Dead Cells, Shovel Knight.

## Architecture
- **Frontend**: React + HTML5 Canvas game engine
- **Backend**: FastAPI + MongoDB (game saves)
- **Game Engine**: Pure JS classes (Player, Enemy, Physics, Camera, Renderer, Particles, Items, Level)
- **UI**: React overlays on canvas (MainMenu, HUD, PauseMenu, Inventory, GameOver, Victory)

## User Personas
- Casual gamers who enjoy platformer hack-and-slash games
- Fans of Hollow Knight / Dead Cells style games
- Single-player, no auth required

## Core Requirements (Static)
- Dark fantasy themed 2D platformer
- Player movement (run, jump, double jump, wall interactions)
- 3-hit attack combo system
- Dash with invincibility frames
- Soul Blast special ability (mana-based)
- 3 enemy types: Skeleton Warrior, Dark Wraith, Demon Knight (boss)
- Inventory/equipment system (weapon, armor, accessory slots)
- Items with stat bonuses (damage, defense, speed, health, mana)
- HUD with health, mana, score
- Parallax background with dark fantasy atmosphere
- Pause/inventory menus
- Victory/death screens

## What's Been Implemented (Feb 2026)
- Full game engine with physics, collision detection, camera system
- Player with movement, 3-hit combo, dash, soul blast, double jump
- 3 enemy types with AI (patrol, chase, attack)
- Wraith with ranged projectile attacks
- **Demon Knight boss with full moveset (6 abilities)**:
  - Sword combo, Charge rush, Ground Slam + shockwave
  - Phase 2 (at 50% HP): Dark Barrage (5-projectile spread), Skeleton Summoning, Teleport Slash
  - Reduced knockback, damage reduction during charge/slam
- **11 loot chests** scattered across the map with auto-open proximity
- **14 unique equipment items** across 4 rarity tiers (including cursed_blade, dragon_scale, soul_siphon)
- **7-section complex map**: Starting Grounds, Ruined Outskirts, Dark Forest, Caverns, Castle Approach, Castle Interior, Throne Room
- Parallax background (moon, mountains, castles, trees, fog)
- All UI screens (menu, HUD, pause, inventory, game over, victory)
- Backend save/load system
- Canvas-based rendering with particle effects, boss aura/shockwave FX
- Electron desktop packaging config (build as .exe/.dmg/.AppImage)

## P0 Features (Done)
- [x] Core movement + combat
- [x] Enemy AI
- [x] Level design
- [x] Inventory/equipment
- [x] HUD + menus

## P1 Features (Backlog)
- [ ] Sound effects and music
- [ ] Additional levels
- [ ] More enemy types
- [ ] Save/load from UI
- [ ] Difficulty settings

## P2 Features (Future)
- [ ] Wall slide/wall jump
- [ ] Map/minimap
- [ ] NPC dialogue
- [ ] Shop system
- [ ] Achievements
- [ ] Mobile touch controls
