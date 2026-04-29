import { PLAYER_CONFIG } from './constants';
import { applyGravity, moveEntity, resolveCollisions } from './Physics';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = PLAYER_CONFIG.WIDTH;
    this.height = PLAYER_CONFIG.HEIGHT;
    this.vx = 0;
    this.vy = 0;

    this.facing = 1;
    this.onGround = false;

    // Jump
    this.jumpCount = 0;
    this.maxJumps = 2;
    this.coyoteTimer = 0;
    this.wasOnGround = false;

    // Attack
    this.attacking = false;
    this.attackTimer = 0;
    this.comboIndex = 0;
    this.comboTimer = 0;
    this.attackCooldown = 0;
    this.attackHitEnemies = new Set();

    // Dash
    this.dashing = false;
    this.dashTimer = 0;
    this.dashCooldown = 0;
    this.dashDir = 1;

    // Special
    this.specialActive = false;
    this.specialTimer = 0;
    this.specialProjectile = null;

    // Stats
    this.health = PLAYER_CONFIG.MAX_HEALTH;
    this.maxHealth = PLAYER_CONFIG.MAX_HEALTH;
    this.mana = PLAYER_CONFIG.MAX_MANA;
    this.maxMana = PLAYER_CONFIG.MAX_MANA;
    this.baseAttackDamage = [...PLAYER_CONFIG.BASE_ATTACK_DAMAGE];
    this.attackRanges = [...PLAYER_CONFIG.ATTACK_RANGES];

    // Equipment bonuses
    this.bonusDamage = 0;
    this.bonusDefense = 0;
    this.bonusSpeed = 0;

    // Invincibility
    this.invincible = false;
    this.invincibleTimer = 0;
    this.hurtTimer = 0;

    // Animation
    this.state = 'idle';
    this.animFrame = 0;
    this.animTimer = 0;

    // Inventory & Equipment
    this.inventory = [];
    this.equipment = { weapon: null, armor: null, accessory: null };

    this.alive = true;
    this.score = 0;
  }

  update(dt, input, platforms) {
    if (!this.alive) return;

    this.updateTimers(dt);

    if (!this.dashing && !this.attacking) {
      this.handleMovement(input);
    }

    if (!this.dashing) {
      this.handleJump(input);
    }

    this.handleDash(dt, input);
    this.handleAttack(dt, input);
    this.handleSpecial(input);

    if (!this.dashing) {
      applyGravity(this, dt);
    }

    moveEntity(this, dt);
    resolveCollisions(this, platforms);

    // Coyote time
    if (this.onGround) {
      this.coyoteTimer = PLAYER_CONFIG.COYOTE_TIME;
      this.jumpCount = 0;
      this.wasOnGround = true;
    } else {
      if (this.wasOnGround) {
        this.coyoteTimer -= dt;
        if (this.coyoteTimer <= 0) {
          this.wasOnGround = false;
          if (this.jumpCount === 0) this.jumpCount = 1;
        }
      }
    }

    // Clamp left boundary
    if (this.x < 0) { this.x = 0; this.vx = 0; }

    // Mana regen
    this.mana = Math.min(this.maxMana, this.mana + 3 * dt);

    this.updateAnimState();
  }

  updateTimers(dt) {
    if (this.invincible) {
      this.invincibleTimer -= dt;
      if (this.invincibleTimer <= 0) this.invincible = false;
    }
    if (this.hurtTimer > 0) this.hurtTimer -= dt;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.dashCooldown > 0) this.dashCooldown -= dt;
    if (!this.attacking && this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) this.comboIndex = 0;
    }
    if (this.specialActive) {
      this.specialTimer -= dt;
      if (this.specialTimer <= 0) this.specialActive = false;
    }
  }

  handleMovement(input) {
    const speed = PLAYER_CONFIG.SPEED + this.bonusSpeed;
    if (input.left) {
      this.vx = -speed;
      this.facing = -1;
    } else if (input.right) {
      this.vx = speed;
      this.facing = 1;
    } else {
      this.vx *= 0.7;
    }
  }

  handleJump(input) {
    if (input.jump) {
      if (this.onGround || this.coyoteTimer > 0) {
        this.vy = PLAYER_CONFIG.JUMP_FORCE;
        this.jumpCount = 1;
        this.coyoteTimer = 0;
        this.wasOnGround = false;
      } else if (this.jumpCount < this.maxJumps) {
        this.vy = PLAYER_CONFIG.DOUBLE_JUMP_FORCE;
        this.jumpCount++;
      }
    }
  }

  handleDash(dt, input) {
    if (this.dashing) {
      this.dashTimer -= dt;
      this.vx = this.dashDir * PLAYER_CONFIG.DASH_SPEED;
      this.vy = 0;
      if (this.dashTimer <= 0) {
        this.dashing = false;
        this.vx = this.dashDir * PLAYER_CONFIG.SPEED * 0.5;
      }
      return;
    }

    if (input.dash && this.dashCooldown <= 0 && !this.attacking) {
      this.dashing = true;
      this.dashTimer = PLAYER_CONFIG.DASH_DURATION;
      this.dashCooldown = PLAYER_CONFIG.DASH_COOLDOWN;
      this.dashDir = this.facing;
      this.invincible = true;
      this.invincibleTimer = PLAYER_CONFIG.DASH_DURATION + 0.05;
    }
  }

  handleAttack(dt, input) {
    if (this.attacking) {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) {
        this.attacking = false;
        this.attackHitEnemies = new Set();
        this.comboIndex = (this.comboIndex + 1) % 3;
        this.comboTimer = PLAYER_CONFIG.COMBO_WINDOW;
      }
      return;
    }

    if (input.attack && this.attackCooldown <= 0 && !this.dashing) {
      if (this.comboTimer <= 0) this.comboIndex = 0;
      this.attacking = true;
      this.attackTimer = PLAYER_CONFIG.ATTACK_DURATIONS[this.comboIndex];
      this.attackCooldown = 0.05;
      this.attackHitEnemies = new Set();
    }
  }

  handleSpecial(input) {
    if (input.special && this.mana >= PLAYER_CONFIG.SPECIAL_MANA_COST && !this.attacking && !this.dashing) {
      this.mana -= PLAYER_CONFIG.SPECIAL_MANA_COST;
      this.specialActive = true;
      this.specialTimer = 0.4;
      this.specialProjectile = {
        x: this.x + (this.facing > 0 ? this.width : -20),
        y: this.y + this.height / 2 - 8,
        width: 20,
        height: 16,
        vx: this.facing * 400,
        vy: 0,
        damage: PLAYER_CONFIG.SPECIAL_DAMAGE + this.bonusDamage,
        lifetime: 1.5,
        active: true,
      };
    }
  }

  getAttackDamage() {
    return this.baseAttackDamage[this.comboIndex] + this.bonusDamage;
  }

  getAttackRange() {
    return this.attackRanges[this.comboIndex];
  }

  takeDamage(amount) {
    if (this.invincible || !this.alive) return;
    const reduced = Math.max(1, amount - this.bonusDefense);
    this.health -= reduced;
    this.invincible = true;
    this.invincibleTimer = PLAYER_CONFIG.INVINCIBLE_TIME;
    this.hurtTimer = 0.3;
    this.vy = -200;
    if (this.health <= 0) {
      this.health = 0;
      this.alive = false;
    }
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  restoreMana(amount) {
    this.mana = Math.min(this.maxMana, this.mana + amount);
  }

  equipItem(item) {
    const slot = item.slot;
    if (this.equipment[slot]) {
      this.removeEquipBonus(this.equipment[slot]);
      this.inventory.push(this.equipment[slot]);
    }
    this.equipment[slot] = item;
    this.applyEquipBonus(item);
    this.inventory = this.inventory.filter(i => i.id !== item.id);
  }

  unequipItem(slot) {
    if (this.equipment[slot]) {
      this.removeEquipBonus(this.equipment[slot]);
      this.inventory.push(this.equipment[slot]);
      this.equipment[slot] = null;
    }
  }

  applyEquipBonus(item) {
    if (item.bonusDamage) this.bonusDamage += item.bonusDamage;
    if (item.bonusDefense) this.bonusDefense += item.bonusDefense;
    if (item.bonusSpeed) this.bonusSpeed += item.bonusSpeed;
    if (item.bonusHealth) this.maxHealth += item.bonusHealth;
    if (item.bonusMana) this.maxMana += item.bonusMana;
  }

  removeEquipBonus(item) {
    if (item.bonusDamage) this.bonusDamage -= item.bonusDamage;
    if (item.bonusDefense) this.bonusDefense -= item.bonusDefense;
    if (item.bonusSpeed) this.bonusSpeed -= item.bonusSpeed;
    if (item.bonusHealth) {
      this.maxHealth -= item.bonusHealth;
      this.health = Math.min(this.health, this.maxHealth);
    }
    if (item.bonusMana) {
      this.maxMana -= item.bonusMana;
      this.mana = Math.min(this.mana, this.maxMana);
    }
  }

  updateAnimState() {
    if (!this.alive) { this.state = 'dead'; return; }
    if (this.hurtTimer > 0) { this.state = 'hurt'; return; }
    if (this.dashing) { this.state = 'dash'; return; }
    if (this.attacking) { this.state = 'attack'; return; }
    if (!this.onGround) {
      this.state = this.vy < 0 ? 'jump' : 'fall';
      return;
    }
    this.state = Math.abs(this.vx) > 20 ? 'run' : 'idle';
  }
}
