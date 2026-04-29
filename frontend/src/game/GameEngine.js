import { InputManager } from './InputManager';
import { Camera } from './Camera';
import { Player } from './Player';
import { createEnemy } from './Enemy';
import { Renderer } from './Renderer';
import { ParticleSystem } from './Particles';
import { getLevel1 } from './Level';
import { getItemById } from './Items';
import { aabb, hitboxCheck } from './Physics';
import { COLORS } from './constants';

export class GameEngine {
  constructor(canvas, callbacks) {
    this.canvas = canvas;
    this.callbacks = callbacks || {};
    this.input = new InputManager();
    this.camera = new Camera();
    this.renderer = new Renderer(canvas);
    this.particles = new ParticleSystem();

    this.player = null;
    this.enemies = [];
    this.platforms = [];
    this.pickups = [];

    this.gameState = 'menu';
    this.running = false;
    this.lastTime = 0;
    this.rafId = null;
    this.victoryTriggered = false;
  }

  startGame() {
    const level = getLevel1();
    this.platforms = level.platforms;
    this.player = new Player(level.playerSpawn.x, level.playerSpawn.y);

    const startWeapon = getItemById('rusty_sword');
    if (startWeapon) this.player.inventory.push(startWeapon);

    this.enemies = level.enemies.map(e => createEnemy(e));
    this.pickups = level.pickups.map(p => ({ ...p, collected: false }));

    this.camera.setBounds(level.worldWidth, level.worldHeight);
    this.victoryTriggered = false;

    this.gameState = 'playing';
    this.running = true;
    this.lastTime = performance.now();
    this.loop();
  }

  loop() {
    if (!this.running) return;

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    this.input.update();

    if (this.gameState === 'playing') {
      if (this.input.pause) {
        this.gameState = 'paused';
        this.notifyState();
      } else if (this.input.inventory) {
        this.gameState = 'inventory';
        this.notifyState();
      } else {
        this.update(dt);
      }
    } else if (this.gameState === 'paused') {
      if (this.input.pause) {
        this.gameState = 'playing';
        this.lastTime = performance.now();
        this.notifyState();
      }
    } else if (this.gameState === 'inventory') {
      if (this.input.inventory || this.input.pause) {
        this.gameState = 'playing';
        this.lastTime = performance.now();
        this.notifyState();
      }
    }

    this.renderFrame();
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  update(dt) {
    this.player.update(dt, this.input, this.platforms);

    // Update enemies
    this.enemies.forEach(e => e.update(dt, this.player, this.platforms));

    // Update player projectile
    if (this.player.specialProjectile) {
      const proj = this.player.specialProjectile;
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;
      proj.lifetime -= dt;

      this.enemies.forEach(e => {
        if (!e.alive) return;
        if (aabb(proj, e)) {
          e.takeDamage(proj.damage, Math.sign(proj.vx));
          proj.lifetime = 0;
          this.particles.emit(e.x + e.width / 2, e.y + e.height / 2, 12, {
            color: COLORS.SOUL_BLAST, spread: 150, lifetime: 0.4, size: 4,
          });
        }
      });

      if (proj.lifetime <= 0) this.player.specialProjectile = null;
    }

    // Enemy projectiles hit player
    this.enemies.forEach(e => {
      if (!e.projectiles) return;
      e.projectiles.forEach(p => {
        if (this.player.alive && aabb(p, this.player)) {
          this.player.takeDamage(p.damage);
          p.lifetime = 0;
          this.particles.emit(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 8, {
            color: '#ff4444', spread: 100, lifetime: 0.3, size: 3,
          });
        }
      });
    });

    this.particles.update(dt);

    // Dash particles
    if (this.player.dashing) {
      this.particles.emit(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 2, {
        color: COLORS.DASH_GHOST, spread: 30, lifetime: 0.2, size: 5,
      });
    }

    this.checkPlayerAttacks();
    this.checkEnemyAttacks();
    this.checkPickups();

    this.camera.follow(this.player, this.canvas.width, this.canvas.height, dt);

    // Fall death
    if (this.player.y > 1500) {
      this.player.health = 0;
      this.player.alive = false;
    }

    if (!this.player.alive) {
      this.gameState = 'game_over';
    }

    // Victory check
    if (!this.victoryTriggered) {
      const boss = this.enemies.find(e => e.config.isBoss);
      if (boss && !boss.alive) {
        this.victoryTriggered = true;
        setTimeout(() => {
          if (this.gameState === 'playing') {
            this.gameState = 'victory';
            this.notifyState();
          }
        }, 1500);
      }
    }

    this.notifyState();
  }

  checkPlayerAttacks() {
    if (!this.player.attacking) return;
    const range = this.player.getAttackRange();
    const damage = this.player.getAttackDamage();

    this.enemies.forEach((e, idx) => {
      if (!e.alive) return;
      if (this.player.attackHitEnemies.has(idx)) return;
      if (hitboxCheck(this.player, e, range, this.player.facing)) {
        e.takeDamage(damage, this.player.facing);
        this.player.attackHitEnemies.add(idx);
        this.particles.emit(e.x + e.width / 2, e.y + e.height / 2, 8, {
          color: '#ffffff', spread: 130, lifetime: 0.3, size: 3,
        });
        if (!e.alive) {
          this.player.score += e.config.isBoss ? 500 : 100;
          if (e.config.isBoss) {
            this.pickups.push({
              type: 'item', x: e.x + e.width / 2, y: e.y, itemId: 'void_cleaver', collected: false,
            });
          }
        }
      }
    });
  }

  checkEnemyAttacks() {
    this.enemies.forEach(e => {
      if (!e.alive || !e.isAttacking()) return;
      if (hitboxCheck(e, this.player, e.config.attackRange, e.facing)) {
        this.player.takeDamage(e.damage);
        this.particles.emit(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 8, {
          color: '#ff4444', spread: 100, lifetime: 0.3, size: 3,
        });
      }
    });
  }

  checkPickups() {
    this.pickups.forEach(p => {
      if (p.collected) return;
      const bounds = { x: p.x - 14, y: p.y - 14, width: 28, height: 28 };
      if (!aabb(this.player, bounds)) return;

      p.collected = true;
      if (p.type === 'health') {
        this.player.heal(p.amount);
        this.particles.emit(this.player.x + this.player.width / 2, this.player.y, 10, {
          color: COLORS.PICKUP_HEALTH, spread: 80, vy: -100, lifetime: 0.5, size: 3,
        });
      } else if (p.type === 'mana') {
        this.player.restoreMana(p.amount);
        this.particles.emit(this.player.x + this.player.width / 2, this.player.y, 10, {
          color: COLORS.PICKUP_MANA, spread: 80, vy: -100, lifetime: 0.5, size: 3,
        });
      } else if (p.type === 'item') {
        const item = getItemById(p.itemId);
        if (item) {
          this.player.inventory.push(item);
          this.particles.emit(p.x, p.y, 15, {
            color: COLORS.PICKUP_ITEM, spread: 120, lifetime: 0.6, size: 4,
          });
        }
      }
    });
  }

  renderFrame() {
    this.renderer.render({
      player: this.player,
      enemies: this.enemies,
      platforms: this.platforms,
      pickups: this.pickups,
      projectiles: this.player?.specialProjectile ? [this.player.specialProjectile] : [],
      particles: this.particles,
      camera: this.camera,
    });
  }

  notifyState() {
    if (!this.callbacks.onStateUpdate || !this.player) return;
    this.callbacks.onStateUpdate({
      health: this.player.health,
      maxHealth: this.player.maxHealth,
      mana: this.player.mana,
      maxMana: this.player.maxMana,
      score: this.player.score,
      gameState: this.gameState,
      inventory: [...this.player.inventory],
      equipment: { ...this.player.equipment },
      alive: this.player.alive,
    });
  }

  resume() {
    this.gameState = 'playing';
    this.lastTime = performance.now();
    this.notifyState();
  }

  closeInventory() {
    this.gameState = 'playing';
    this.lastTime = performance.now();
    this.notifyState();
  }

  equipItem(item) {
    if (this.player) {
      this.player.equipItem(item);
      this.notifyState();
    }
  }

  unequipItem(slot) {
    if (this.player) {
      this.player.unequipItem(slot);
      this.notifyState();
    }
  }

  restart() {
    this.stop();
    this.startGame();
  }

  stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  destroy() {
    this.stop();
    this.input.destroy();
  }
}
