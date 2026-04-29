export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.smoothing = 5;
    this.bounds = { minX: 0, minY: -200, maxX: 6000, maxY: 1200 };
  }

  follow(player, viewW, viewH, dt) {
    this.targetX = player.x + player.width / 2 - viewW / 2;
    this.targetY = player.y + player.height / 2 - viewH / 2 - 50;

    this.x += (this.targetX - this.x) * this.smoothing * dt;
    this.y += (this.targetY - this.y) * this.smoothing * dt;

    this.x = Math.max(this.bounds.minX, Math.min(this.x, this.bounds.maxX - viewW));
    this.y = Math.max(this.bounds.minY, Math.min(this.y, this.bounds.maxY - viewH));
  }

  setBounds(maxX, maxY) {
    this.bounds.maxX = maxX;
    this.bounds.maxY = maxY;
  }
}
