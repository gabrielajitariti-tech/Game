export class InputManager {
  constructor() {
    this.keys = {};
    this.justPressed = {};
    this.prevKeys = {};

    this.handleKeyDown = (e) => {
      const blocked = [
        'Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown',
        'ShiftLeft','ShiftRight','KeyW','KeyA','KeyS','KeyD',
        'KeyJ','KeyK','Escape','KeyI','KeyE'
      ];
      if (blocked.includes(e.code)) e.preventDefault();
      this.keys[e.code] = true;
    };

    this.handleKeyUp = (e) => {
      this.keys[e.code] = false;
    };

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  update() {
    for (const key in this.keys) {
      this.justPressed[key] = this.keys[key] && !this.prevKeys[key];
    }
    this.prevKeys = { ...this.keys };
  }

  isDown(key) { return !!this.keys[key]; }
  isJustPressed(key) { return !!this.justPressed[key]; }

  get left() { return this.isDown('ArrowLeft') || this.isDown('KeyA'); }
  get right() { return this.isDown('ArrowRight') || this.isDown('KeyD'); }
  get jump() { return this.isJustPressed('Space') || this.isJustPressed('ArrowUp') || this.isJustPressed('KeyW'); }
  get attack() { return this.isJustPressed('KeyJ'); }
  get special() { return this.isJustPressed('KeyK'); }
  get dash() { return this.isJustPressed('ShiftLeft') || this.isJustPressed('ShiftRight'); }
  get pause() { return this.isJustPressed('Escape'); }
  get inventory() { return this.isJustPressed('KeyI') || this.isJustPressed('KeyE'); }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}
