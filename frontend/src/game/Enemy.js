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

export function createEnemy(spawnData) {
  if (spawnData.type === 'wraith') {
    return new Wraith(spawnData.x, spawnData.y);
  }
  return new BaseEnemy(spawnData.x, spawnData.y, spawnData.type);
}
