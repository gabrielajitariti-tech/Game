import { ENEMY_CONFIG } from './constants';
import { applyGravity, moveEntity, resolveCollisions } from './Physics';

class BaseEnemy {
  constructor(x, y, type) {
    const config = ENEMY_CONFIG[type];
    this.x = x;
    this.y = y;
    this.width = config.width;
    this.height = config.height;
    this.vx = 0;
    this.vy = 0;
    this.type = type;
    this.config = config;

    this.health = config.health;
    this.maxHealth = config.health;
    this.damage = config.damage;
    this.speed = config.speed;

    this.facing = -1;
    this.onGround = false;
    this.alive = true;
    this.deathTimer = 0;

    this.state = 'patrol';
    this.patrolDir = Math.random() > 0.5 ? 1 : -1;
    this.patrolTimer = 2 + Math.random() * 3;
    this.patrolRange = 200;
    this.startX = x;

    this.attackCooldown = 0;
    this.attackTimer = 0;
    this.attacking = false;

    this.hurtTimer = 0;
    this.invincibleTimer = 0;

    this.animFrame = 0;
    this.animTimer = 0;
    this.floatOffset = 0;
    this.projectiles = [];
  }

  update(dt, player, platforms) {
    if (!this.alive) {
      this.deathTimer -= dt;
      return;
    }

    this.updateTimers(dt);
    this.updateAI(dt, player);

    applyGravity(this, dt);
    moveEntity(this, dt);
    resolveCollisions(this, platforms);
    this.updateAnimation(dt);
  }

  updateTimers(dt) {
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.hurtTimer > 0) this.hurtTimer -= dt;
    if (this.invincibleTimer > 0) this.invincibleTimer -= dt;
    if (this.attacking) {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) this.attacking = false;
    }
  }

  updateAI(dt, player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (this.hurtTimer > 0) {
      this.vx *= 0.9;
      return;
    }

    if (dist < this.config.attackRange + 10 && this.attackCooldown <= 0 && player.alive) {
      this.state = 'attack';
      this.attacking = true;
      this.attackTimer = 0.3;
      this.attackCooldown = this.config.attackCooldown;
      this.vx = 0;
      this.facing = dx > 0 ? 1 : -1;
      return;
    }

    if (dist < this.config.detectionRange && player.alive) {
      this.state = 'chase';
      this.facing = dx > 0 ? 1 : -1;
      this.vx = this.facing * this.speed;
      return;
    }

    this.state = 'patrol';
    this.patrolTimer -= dt;
    if (this.patrolTimer <= 0) {
      this.patrolDir *= -1;
      this.patrolTimer = 2 + Math.random() * 3;
    }
    if (Math.abs(this.x - this.startX) > this.patrolRange) {
      this.patrolDir = this.x > this.startX ? -1 : 1;
    }
    this.facing = this.patrolDir;
    this.vx = this.patrolDir * this.speed * 0.4;
  }

  takeDamage(amount, fromDir) {
    if (this.invincibleTimer > 0 || !this.alive) return;
    this.health -= amount;
    this.hurtTimer = 0.2;
    this.invincibleTimer = 0.3;
    this.vx = fromDir * 200;
    this.vy = -100;

    if (this.health <= 0) {
      this.alive = false;
      this.deathTimer = 0.6;
    }
  }

  isAttacking() {
    return this.attacking && this.attackTimer > 0.05 && this.attackTimer < 0.25;
  }

  updateAnimation(dt) {
    this.animTimer += dt;
    if (this.animTimer >= 0.15) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4;
    }
  }
}

class Wraith extends BaseEnemy {
  constructor(x, y) {
    super(x, y, 'wraith');
    this.baseY = y;
  }

  update(dt, player, platforms) {
    if (!this.alive) {
      this.deathTimer -= dt;
      return;
    }

    this.updateTimers(dt);
    this.floatOffset = Math.sin(performance.now() / 500) * 12;

    const dx = player.x - this.x;
    const dist = Math.hypot(dx, player.y - this.y);

    if (this.hurtTimer > 0) {
      this.vx *= 0.9;
    } else {
      this.facing = dx > 0 ? 1 : -1;

      if (dist < this.config.detectionRange && player.alive) {
        this.state = 'chase';
        if (dist < 150) {
          this.vx = -this.facing * this.speed;
        } else if (dist > 220) {
          this.vx = this.facing * this.speed * 0.5;
        } else {
          this.vx = 0;
        }

        if (this.attackCooldown <= 0 && player.alive) {
          this.fireProjectile(player);
        }
      } else {
        this.state = 'patrol';
        this.vx = 0;
      }
    }

    this.vy = 0;
    moveEntity(this, dt);

    this.projectiles.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.lifetime -= dt;
    });
    this.projectiles = this.projectiles.filter(p => p.lifetime > 0);

    this.updateAnimation(dt);
  }

  fireProjectile(player) {
    const dx = player.x + player.width / 2 - (this.x + this.width / 2);
    const dy = player.y + player.height / 2 - (this.y + this.height / 2 + this.floatOffset);
    const dist = Math.hypot(dx, dy) || 1;
    const speed = this.config.projectileSpeed;

    this.projectiles.push({
      x: this.x + this.width / 2,
      y: this.y + this.height / 2 + this.floatOffset,
      width: 12,
      height: 12,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      damage: this.damage,
      lifetime: 3.0,
    });

    this.attackCooldown = this.config.attackCooldown;
    this.attacking = true;
    this.attackTimer = 0.3;
  }
}

class DemonKnight extends BaseEnemy {
  constructor(x, y) {
    super(x, y, 'demon_knight');
    this.phase = 1;
    this.abilities = { charge: 3, slam: 5, barrage: 10, summon: 15, teleport: 8 };
    this.charging = false;
    this.chargeDir = 1;
    this.chargeTimer = 0;
    this.slamming = false;
    this.slamPhase = '';
    this.slamTimer = 0;
    this.shockwave = null;
    this.barraging = false;
    this.barrageTimer = 0;
    this.summoning = false;
    this.summonTimer = 0;
    this.shouldSpawnMinions = false;
    this.teleporting = false;
    this.teleportPhase = '';
    this.teleportTimer = 0;
    this.teleportTarget = null;
    this.visible = true;
    this.projectiles = [];
    this.phaseTransition = false;
    this.phaseTransitionTimer = 0;
  }

  update(dt, player, platforms) {
    if (!this.alive) { this.deathTimer -= dt; return; }
    this.updateTimers(dt);

    // Update projectiles
    this.projectiles.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.lifetime -= dt; });
    this.projectiles = this.projectiles.filter(p => p.lifetime > 0);

    // Phase check
    if (this.health / this.maxHealth <= 0.5 && this.phase === 1) {
      this.phase = 2;
      this.phaseTransition = true;
      this.phaseTransitionTimer = 1.0;
      this.invincibleTimer = 1.0;
      this.vx = 0;
    }

    if (this.phaseTransition) {
      this.phaseTransitionTimer -= dt;
      if (this.phaseTransitionTimer <= 0) this.phaseTransition = false;
      this.updateAnimation(dt);
      return;
    }

    if (this.charging) { this.updateCharge(dt, platforms); return; }
    if (this.slamming) { this.updateSlam(dt, platforms); return; }
    if (this.barraging) { this.updateBarrage(dt, player); return; }
    if (this.summoning) { this.updateSummon(dt); return; }
    if (this.teleporting) { this.updateTeleport(dt, player, platforms); return; }

    this.chooseAction(dt, player);
    applyGravity(this, dt);
    moveEntity(this, dt);
    resolveCollisions(this, platforms);
    this.updateAnimation(dt);
  }

  chooseAction(dt, player) {
    const dx = player.x - this.x;
    const dist = Math.abs(dx);
    this.facing = dx > 0 ? 1 : -1;
    for (const k in this.abilities) { if (this.abilities[k] > 0) this.abilities[k] -= dt; }
    if (!player.alive || this.hurtTimer > 0) { this.vx *= 0.9; return; }

    // Phase 2 abilities
    if (this.phase === 2) {
      if (this.abilities.teleport <= 0 && dist > 250) { this.startTeleport(player); return; }
      if (this.abilities.barrage <= 0 && dist > 120) { this.startBarrage(player); return; }
      if (this.abilities.summon <= 0) { this.startSummon(); return; }
    }
    // Shared abilities
    if (this.abilities.slam <= 0 && dist < 200) { this.startSlam(); return; }
    if (this.abilities.charge <= 0 && dist > 120 && dist < 500) { this.startCharge(player); return; }
    // Melee
    if (dist < this.config.attackRange + 15 && this.attackCooldown <= 0) {
      this.attacking = true;
      this.attackTimer = this.phase === 2 ? 0.25 : 0.35;
      this.attackCooldown = this.phase === 2 ? 0.6 : 1.0;
      this.vx = 0;
      this.state = 'attack';
      return;
    }
    this.state = 'chase';
    this.vx = this.facing * this.speed * (this.phase === 2 ? 1.4 : 1);
  }

  startCharge(player) {
    this.charging = true;
    this.chargeDir = player.x > this.x ? 1 : -1;
    this.facing = this.chargeDir;
    this.chargeTimer = 0.4;
    this.abilities.charge = this.phase === 2 ? 2.5 : 4;
    this.vx = 0;
    this.state = 'charge_windup';
  }

  updateCharge(dt, platforms) {
    this.chargeTimer -= dt;
    if (this.state === 'charge_windup') {
      if (this.chargeTimer <= 0) {
        this.state = 'charging';
        this.chargeTimer = 0.5;
        this.vx = this.chargeDir * (this.phase === 2 ? 750 : 550);
      }
    } else {
      applyGravity(this, dt);
      moveEntity(this, dt);
      resolveCollisions(this, platforms);
      if (this.chargeTimer <= 0) { this.charging = false; this.vx = 0; this.state = 'idle'; }
    }
    this.updateAnimation(dt);
  }

  startSlam() {
    this.slamming = true;
    this.slamPhase = 'jump';
    this.slamTimer = 0.35;
    this.vy = -650;
    this.abilities.slam = this.phase === 2 ? 3 : 5;
    this.vx = 0;
    this.state = 'slam_jump';
  }

  updateSlam(dt, platforms) {
    this.slamTimer -= dt;
    if (this.slamPhase === 'jump') {
      applyGravity(this, dt);
      moveEntity(this, dt);
      resolveCollisions(this, platforms);
      if (this.vy >= 0 || this.slamTimer <= 0) {
        this.slamPhase = 'fall';
        this.vy = 900;
        this.slamTimer = 1.2;
      }
    } else if (this.slamPhase === 'fall') {
      this.vy = 900;
      moveEntity(this, dt);
      resolveCollisions(this, platforms);
      if (this.onGround) {
        this.slamPhase = 'impact';
        this.slamTimer = 0.6;
        this.vy = 0; this.vx = 0;
        this.shockwave = {
          x: this.x + this.width / 2, y: this.y + this.height,
          radius: 0, maxRadius: 220,
          damage: this.phase === 2 ? 28 : 18,
          active: true, timer: 0.35, hit: false,
        };
        this.state = 'slam_impact';
      }
    } else if (this.slamPhase === 'impact') {
      if (this.shockwave && this.shockwave.active) {
        this.shockwave.radius += 600 * dt;
        this.shockwave.timer -= dt;
        if (this.shockwave.timer <= 0 || this.shockwave.radius >= this.shockwave.maxRadius) {
          this.shockwave.active = false;
        }
      }
      if (this.slamTimer <= 0) { this.slamming = false; this.shockwave = null; this.state = 'idle'; }
    }
    this.updateAnimation(dt);
  }

  startBarrage(player) {
    this.barraging = true;
    this.barrageTimer = 0.5;
    this.abilities.barrage = 6;
    this.vx = 0;
    this.state = 'barrage';
    this.facing = player.x > this.x ? 1 : -1;
  }

  updateBarrage(dt, player) {
    this.barrageTimer -= dt;
    if (this.barrageTimer <= 0) {
      const baseAngle = Math.atan2(player.y - this.y, player.x - this.x);
      for (let i = -2; i <= 2; i++) {
        const a = baseAngle + i * 0.22;
        this.projectiles.push({
          x: this.x + this.width / 2, y: this.y + this.height / 2,
          width: 10, height: 10,
          vx: Math.cos(a) * 300, vy: Math.sin(a) * 300,
          damage: 14, lifetime: 2.5,
        });
      }
      this.barraging = false;
      this.state = 'idle';
    }
    this.updateAnimation(dt);
  }

  startSummon() {
    this.summoning = true;
    this.summonTimer = 0.8;
    this.abilities.summon = 15;
    this.vx = 0;
    this.state = 'summoning';
    this.invincibleTimer = 0.8;
  }

  updateSummon(dt) {
    this.summonTimer -= dt;
    if (this.summonTimer <= 0) {
      this.summoning = false;
      this.shouldSpawnMinions = true;
      this.state = 'idle';
    }
    this.updateAnimation(dt);
  }

  startTeleport(player) {
    this.teleporting = true;
    this.teleportPhase = 'vanish';
    this.teleportTimer = 0.25;
    this.teleportTarget = { x: player.x + player.facing * -50, y: player.y };
    this.abilities.teleport = this.phase === 2 ? 4 : 6;
    this.vx = 0;
    this.state = 'teleport';
  }

  updateTeleport(dt, player, platforms) {
    this.teleportTimer -= dt;
    if (this.teleportPhase === 'vanish') {
      this.visible = this.teleportTimer > 0.12;
      if (this.teleportTimer <= 0) {
        this.x = this.teleportTarget.x;
        this.y = this.teleportTarget.y;
        this.facing = player.x > this.x ? 1 : -1;
        this.teleportPhase = 'appear';
        this.teleportTimer = 0.15;
        this.visible = true;
      }
    } else if (this.teleportPhase === 'appear') {
      if (this.teleportTimer <= 0) {
        this.teleportPhase = 'slash';
        this.teleportTimer = 0.3;
        this.attacking = true;
        this.attackTimer = 0.3;
        this.state = 'teleport_slash';
      }
    } else if (this.teleportPhase === 'slash') {
      if (this.teleportTimer <= 0) {
        this.teleporting = false;
        this.attacking = false;
        this.state = 'idle';
      }
    }
    applyGravity(this, dt);
    moveEntity(this, dt);
    resolveCollisions(this, platforms);
    this.updateAnimation(dt);
  }

  takeDamage(amount, fromDir) {
    if (this.invincibleTimer > 0 || !this.alive) return;
    const actualDamage = (this.charging || this.slamming) ? Math.floor(amount * 0.5) : amount;
    this.health -= actualDamage;
    this.hurtTimer = 0.15;
    this.invincibleTimer = 0.2;
    this.vx = fromDir * 60;
    this.vy = -40;
    if (this.health <= 0) { this.alive = false; this.deathTimer = 1.2; }
  }
}

export function createEnemy(spawnData) {
  if (spawnData.type === 'wraith') {
    return new Wraith(spawnData.x, spawnData.y);
  }
  if (spawnData.type === 'demon_knight') {
    return new DemonKnight(spawnData.x, spawnData.y);
  }
  return new BaseEnemy(spawnData.x, spawnData.y, spawnData.type);
}
