export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, count, config) {
    for (let i = 0; i < count; i++) {
      const spread = config.spread || 200;
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * spread,
        vy: (Math.random() - 0.5) * spread + (config.vy || 0),
        size: (config.size || 3) * (0.5 + Math.random() * 0.5),
        color: config.color || '#fff',
        lifetime: (config.lifetime || 0.5) * (0.7 + Math.random() * 0.3),
        maxLifetime: config.lifetime || 0.5,
        gravity: config.gravity || 0,
      });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.gravity * dt;
      p.lifetime -= dt;
      if (p.lifetime <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
}
