import { COLORS } from './constants';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  render(state) {
    const { player, enemies, platforms, pickups, projectiles, particles, camera } = state;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.drawBackground(camera, w, h);
    this.drawPlatforms(platforms, camera, w, h);
    this.drawPickups(pickups, camera, w);
    enemies.forEach(e => this.drawEnemy(e, camera, w));
    if (projectiles) projectiles.forEach(p => this.drawProjectile(p, camera));
    if (player) this.drawPlayer(player, camera);
    this.drawParticles(particles, camera);
  }

  drawBackground(camera, w, h) {
    const ctx = this.ctx;

    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, COLORS.SKY_TOP);
    sky.addColorStop(0.5, COLORS.SKY_MID);
    sky.addColorStop(1, COLORS.SKY_BOT);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Moon
    ctx.save();
    const mx = w * 0.78 - camera.x * 0.02;
    const my = h * 0.14;
    ctx.fillStyle = '#1a1520';
    ctx.shadowColor = '#3a2050';
    ctx.shadowBlur = 80;
    ctx.beginPath();
    ctx.arc(mx, my, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#252030';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(mx, my, 33, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Far mountains
    this.drawMountainLayer(camera.x * 0.05, h * 0.35, h, '#08050f', w);
    // Castle silhouettes
    this.drawCastles(camera.x * 0.12, h * 0.38, h, '#0c0815', w);
    // Near trees
    this.drawTrees(camera.x * 0.25, h * 0.5, h, '#100c18', w);
    // Ground fog
    const fog = ctx.createLinearGradient(0, h * 0.75, 0, h);
    fog.addColorStop(0, 'rgba(8,5,15,0)');
    fog.addColorStop(1, 'rgba(8,5,15,0.5)');
    ctx.fillStyle = fog;
    ctx.fillRect(0, h * 0.75, w, h * 0.25);
  }

  drawMountainLayer(ox, baseY, h, color, w) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 80; x += 50) {
      const y = baseY + Math.sin((x + ox) * 0.003) * 80 + Math.sin((x + ox) * 0.008) * 40;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  }

  drawCastles(ox, baseY, h, color, w) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    for (let i = 0; i < 4; i++) {
      const bx = ((i * 450 - ox) % 1800 + 1800) % 1800 - 100;
      ctx.fillRect(bx, baseY - 90, 35, 90 + (h - baseY));
      ctx.fillRect(bx - 4, baseY - 100, 43, 14);
      ctx.fillRect(bx - 25, baseY - 35, 85, 35 + (h - baseY));
      ctx.fillRect(bx + 70, baseY - 55, 22, 55 + (h - baseY));
      ctx.fillRect(bx + 67, baseY - 62, 28, 10);
    }
  }

  drawTrees(ox, baseY, h, color, w) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 40; x += 25) {
      const ty = baseY + Math.sin((x + ox) * 0.012) * 25 + Math.cos((x + ox) * 0.028) * 15;
      if (x % 50 < 25) {
        ctx.lineTo(x, ty - 25);
        ctx.lineTo(x + 12, ty);
      } else {
        ctx.lineTo(x, ty);
      }
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  }

  drawPlatforms(platforms, camera, canvasW, canvasH) {
    const ctx = this.ctx;
    for (const p of platforms) {
      const x = p.x - camera.x;
      const y = p.y - camera.y;
      if (x + p.width < -20 || x > canvasW + 20 || y + p.height < -20 || y > canvasH + 20) continue;

      ctx.fillStyle = COLORS.PLATFORM_FILL;
      ctx.fillRect(x, y, p.width, p.height);

      ctx.fillStyle = COLORS.PLATFORM_TOP;
      ctx.fillRect(x, y, p.width, 3);

      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let tx = x + 40; tx < x + p.width; tx += 40) {
        ctx.beginPath(); ctx.moveTo(tx, y + 3); ctx.lineTo(tx, y + p.height); ctx.stroke();
      }
      for (let ty2 = y + 20; ty2 < y + p.height; ty2 += 20) {
        ctx.beginPath(); ctx.moveTo(x, ty2); ctx.lineTo(x + p.width, ty2); ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.strokeRect(x, y, p.width, p.height);
    }
  }

  drawPlayer(player, camera) {
    const ctx = this.ctx;
    const px = player.x - camera.x;
    const py = player.y - camera.y;
    const f = player.facing;

    if (player.invincible && Math.floor(performance.now() / 80) % 2) return;

    ctx.save();
    ctx.translate(px + player.width / 2, py + player.height / 2);
    ctx.scale(f, 1);

    const hw = player.width / 2;
    const hh = player.height / 2;

    // Cape
    const capeFlutter = Math.sin(performance.now() / 200) * 4;
    ctx.fillStyle = COLORS.PLAYER_CAPE;
    ctx.beginPath();
    ctx.moveTo(-3, -hh + 10);
    ctx.lineTo(-hw - 10 + capeFlutter, hh + 2);
    ctx.lineTo(-hw - 4 + capeFlutter, hh + 8);
    ctx.lineTo(3, hh - 6);
    ctx.closePath();
    ctx.fill();

    // Body
    ctx.fillStyle = COLORS.PLAYER_BODY;
    ctx.fillRect(-hw + 2, -hh + 6, player.width - 4, player.height - 10);

    // Shoulder armor
    ctx.fillStyle = COLORS.PLAYER_OUTLINE;
    ctx.fillRect(-hw, -hh + 8, 7, 10);
    ctx.fillRect(hw - 7, -hh + 8, 7, 10);

    // Helmet
    ctx.fillStyle = COLORS.PLAYER_OUTLINE;
    ctx.beginPath();
    ctx.moveTo(-hw + 2, -hh + 6);
    ctx.lineTo(hw - 2, -hh + 6);
    ctx.lineTo(hw - 2, -hh);
    ctx.lineTo(hw - 5, -hh - 5);
    ctx.lineTo(-hw + 5, -hh - 5);
    ctx.lineTo(-hw + 2, -hh);
    ctx.closePath();
    ctx.fill();

    // Visor
    ctx.fillStyle = '#000';
    ctx.fillRect(-hw + 6, -hh - 1, player.width - 12, 4);

    // Glowing eyes
    ctx.fillStyle = COLORS.PLAYER_EYES;
    ctx.shadowColor = COLORS.PLAYER_EYES;
    ctx.shadowBlur = 8;
    ctx.fillRect(-5, -hh, 3, 2);
    ctx.fillRect(2, -hh, 3, 2);
    ctx.shadowBlur = 0;

    // Legs
    ctx.fillStyle = COLORS.PLAYER_BODY;
    const legAnim = player.state === 'run' ? Math.sin(performance.now() / 80) * 6 : 0;
    ctx.fillRect(-hw + 3, hh - 4, 8, 8 + legAnim);
    ctx.fillRect(hw - 11, hh - 4, 8, 8 - legAnim);

    // Sword / Attack
    if (player.attacking) {
      this.drawAttackSwing(player, hw, hh);
    } else {
      ctx.fillStyle = COLORS.PLAYER_SWORD;
      ctx.fillRect(hw + 2, -2, 3, 20);
      ctx.fillRect(hw, 0, 7, 3);
    }

    ctx.restore();

    // Dash trail
    if (player.dashing) {
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = COLORS.PLAYER_CAPE;
      ctx.fillRect(px - player.facing * 15, py + 5, player.width, player.height - 10);
      ctx.fillRect(px - player.facing * 30, py + 8, player.width - 4, player.height - 16);
      ctx.globalAlpha = 1;
    }
  }

  drawAttackSwing(player, hw, hh) {
    const ctx = this.ctx;
    const dur = [0.2, 0.2, 0.3][player.comboIndex];
    const progress = 1 - (player.attackTimer / dur);
    const range = player.getAttackRange();

    ctx.lineWidth = 3;
    ctx.shadowColor = COLORS.PLAYER_SWORD_GLOW;
    ctx.shadowBlur = 15;

    if (player.comboIndex === 0) {
      ctx.strokeStyle = COLORS.SLASH_COLOR;
      ctx.beginPath();
      ctx.arc(hw, 0, range, -Math.PI * 0.4, -Math.PI * 0.4 + progress * Math.PI * 0.8);
      ctx.stroke();
    } else if (player.comboIndex === 1) {
      ctx.strokeStyle = 'rgba(200, 220, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(hw, 0, range, Math.PI * 0.4, Math.PI * 0.4 - progress * Math.PI * 0.8, true);
      ctx.stroke();
    } else {
      ctx.strokeStyle = 'rgba(255, 200, 200, 0.7)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(hw, 0, range * 1.15, -Math.PI * 0.5, -Math.PI * 0.5 + progress * Math.PI * 1.1);
      ctx.stroke();
    }

    // Sword along arc
    ctx.fillStyle = COLORS.PLAYER_SWORD;
    const angle = player.comboIndex === 1
      ? (Math.PI * 0.4 - progress * Math.PI * 0.8)
      : (-Math.PI * 0.4 + progress * Math.PI * 0.8);
    const sx = Math.cos(angle) * range + hw;
    const sy = Math.sin(angle) * range;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(angle + Math.PI / 4);
    ctx.fillRect(-2, -14, 4, 28);
    ctx.restore();

    ctx.shadowBlur = 0;
  }

  drawEnemy(enemy, camera, canvasW) {
    if (!enemy.alive && enemy.deathTimer <= 0) return;

    const ctx = this.ctx;
    const ex = enemy.x - camera.x;
    const ey = enemy.y - camera.y + (enemy.floatOffset || 0);
    if (ex + enemy.width < -50 || ex > canvasW + 50) return;

    if (!enemy.alive) ctx.globalAlpha = Math.max(0, enemy.deathTimer * 2);
    if (enemy.hurtTimer > 0 && Math.floor(performance.now() / 60) % 2) ctx.globalAlpha = 0.5;

    ctx.save();
    ctx.translate(ex + enemy.width / 2, ey + enemy.height / 2);
    ctx.scale(enemy.facing, 1);

    if (enemy.type === 'skeleton') this.drawSkeleton(enemy);
    else if (enemy.type === 'wraith') this.drawWraith(enemy);
    else if (enemy.type === 'demon_knight') this.drawDemonKnight(enemy);

    ctx.restore();
    ctx.globalAlpha = 1;

    // Health bar
    if (enemy.alive && enemy.health < enemy.maxHealth) {
      const bw = enemy.width + 12;
      const bx = ex + enemy.width / 2 - bw / 2;
      const by = ey - 10;
      ctx.fillStyle = '#0a0000';
      ctx.fillRect(bx, by, bw, 3);
      ctx.fillStyle = '#ff3333';
      ctx.fillRect(bx, by, bw * (enemy.health / enemy.maxHealth), 3);
    }

    // Wraith projectiles
    if (enemy.projectiles) {
      enemy.projectiles.forEach(p => {
        const ppx = p.x - camera.x;
        const ppy = p.y - camera.y;
        ctx.fillStyle = enemy.config.eyeColor;
        ctx.shadowColor = enemy.config.eyeColor;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(ppx, ppy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }
  }

  drawSkeleton(enemy) {
    const ctx = this.ctx;
    const hw = enemy.width / 2;
    const hh = enemy.height / 2;

    ctx.fillStyle = enemy.config.color;
    ctx.fillRect(-hw + 3, -hh + 12, enemy.width - 6, enemy.height - 16);

    // Skull
    ctx.fillStyle = '#4a5a4a';
    ctx.beginPath();
    ctx.arc(0, -hh + 7, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = enemy.config.eyeColor;
    ctx.shadowColor = enemy.config.eyeColor;
    ctx.shadowBlur = 6;
    ctx.fillRect(-5, -hh + 4, 3, 3);
    ctx.fillRect(2, -hh + 4, 3, 3);
    ctx.shadowBlur = 0;

    // Weapon
    ctx.fillStyle = '#666';
    if (enemy.attacking) {
      ctx.save();
      const a = -Math.PI * 0.3 + (1 - enemy.attackTimer / 0.3) * Math.PI * 0.9;
      ctx.rotate(a);
      ctx.fillRect(hw - 2, -2, 24, 3);
      ctx.restore();
    } else {
      ctx.fillRect(hw + 2, -4, 3, 20);
    }

    // Legs
    ctx.fillStyle = enemy.config.color;
    const la = enemy.state === 'chase' ? Math.sin(performance.now() / 120) * 4 : 0;
    ctx.fillRect(-hw + 4, hh - 4, 6, 6 + la);
    ctx.fillRect(hw - 10, hh - 4, 6, 6 - la);
  }

  drawWraith(enemy) {
    const ctx = this.ctx;
    const hw = enemy.width / 2;
    const hh = enemy.height / 2;

    ctx.globalAlpha = Math.min(ctx.globalAlpha, 0.7);
    ctx.fillStyle = enemy.config.color;
    ctx.beginPath();
    ctx.moveTo(-hw, -hh + 6);
    ctx.quadraticCurveTo(0, -hh - 6, hw, -hh + 6);
    const w = Math.sin(performance.now() / 300) * 5;
    ctx.lineTo(hw + w, hh);
    ctx.quadraticCurveTo(hw / 2, hh - 12, 0, hh + 6);
    ctx.quadraticCurveTo(-hw / 2, hh - 12, -hw + w, hh);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.fillStyle = enemy.config.eyeColor;
    ctx.shadowColor = enemy.config.eyeColor;
    ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.arc(-4, -hh + 11, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(5, -hh + 11, 3, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  }

  drawDemonKnight(enemy) {
    const ctx = this.ctx;
    const hw = enemy.width / 2;
    const hh = enemy.height / 2;

    ctx.fillStyle = enemy.config.color;
    ctx.fillRect(-hw + 3, -hh + 16, enemy.width - 6, enemy.height - 20);

    // Shoulders
    ctx.fillStyle = '#3a1010';
    ctx.fillRect(-hw - 5, -hh + 16, 13, 16);
    ctx.fillRect(hw - 8, -hh + 16, 13, 16);

    // Head
    ctx.fillStyle = '#2a0a0a';
    ctx.beginPath();
    ctx.arc(0, -hh + 10, 15, 0, Math.PI * 2);
    ctx.fill();

    // Horns
    ctx.fillStyle = '#4a1a1a';
    ctx.beginPath();
    ctx.moveTo(-10, -hh + 5); ctx.lineTo(-17, -hh - 18); ctx.lineTo(-5, -hh); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(10, -hh + 5); ctx.lineTo(17, -hh - 18); ctx.lineTo(5, -hh); ctx.closePath(); ctx.fill();

    // Eyes
    ctx.fillStyle = enemy.config.eyeColor;
    ctx.shadowColor = enemy.config.eyeColor;
    ctx.shadowBlur = 12;
    ctx.fillRect(-8, -hh + 6, 6, 4);
    ctx.fillRect(2, -hh + 6, 6, 4);
    ctx.shadowBlur = 0;

    // Weapon
    ctx.fillStyle = '#555';
    if (enemy.attacking) {
      ctx.save();
      const a = -Math.PI * 0.35 + (1 - enemy.attackTimer / 0.3) * Math.PI;
      ctx.rotate(a);
      ctx.fillRect(hw, -3, 38, 5);
      ctx.restore();
    } else {
      ctx.fillRect(hw + 3, -12, 5, 38);
      ctx.fillRect(hw, -4, 12, 5);
    }

    // Legs
    ctx.fillStyle = enemy.config.color;
    const la = enemy.state === 'chase' ? Math.sin(performance.now() / 100) * 5 : 0;
    ctx.fillRect(-hw + 5, hh - 4, 10, 8 + la);
    ctx.fillRect(hw - 15, hh - 4, 10, 8 - la);
  }

  drawPickups(pickups, camera, canvasW) {
    const ctx = this.ctx;
    for (const p of pickups) {
      if (p.collected) continue;
      const px = p.x - camera.x;
      const py = p.y - camera.y + Math.sin(performance.now() / 500 + p.x) * 5;
      if (px < -30 || px > canvasW + 30) continue;

      let color;
      if (p.type === 'health') color = COLORS.PICKUP_HEALTH;
      else if (p.type === 'mana') color = COLORS.PICKUP_MANA;
      else color = COLORS.PICKUP_ITEM;

      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(px, py - 9);
      ctx.lineTo(px + 9, py);
      ctx.lineTo(px, py + 9);
      ctx.lineTo(px - 9, py);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  drawProjectile(proj, camera) {
    const ctx = this.ctx;
    const px = proj.x - camera.x;
    const py = proj.y - camera.y;
    ctx.fillStyle = COLORS.SOUL_BLAST;
    ctx.shadowColor = COLORS.SOUL_BLAST;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(px + proj.width / 2, py + proj.height / 2, 9, 0, Math.PI * 2);
    ctx.fill();
    // Trail
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(px + proj.width / 2 - proj.vx * 0.02, py + proj.height / 2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  drawParticles(particleSystem, camera) {
    const ctx = this.ctx;
    for (const p of particleSystem.particles) {
      const px = p.x - camera.x;
      const py = p.y - camera.y;
      const alpha = Math.max(0, p.lifetime / p.maxLifetime);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(px - p.size / 2, py - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }
}
