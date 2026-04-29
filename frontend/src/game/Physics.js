import { GRAVITY, MAX_FALL_SPEED } from './constants';

export function applyGravity(entity, dt) {
  entity.vy += GRAVITY * dt;
  if (entity.vy > MAX_FALL_SPEED) entity.vy = MAX_FALL_SPEED;
}

export function moveEntity(entity, dt) {
  entity.x += entity.vx * dt;
  entity.y += entity.vy * dt;
}

export function resolveCollisions(entity, platforms) {
  entity.onGround = false;

  for (const p of platforms) {
    if (!aabb(entity, p)) continue;

    const overlapLeft = (entity.x + entity.width) - p.x;
    const overlapRight = (p.x + p.width) - entity.x;
    const overlapTop = (entity.y + entity.height) - p.y;
    const overlapBottom = (p.y + p.height) - entity.y;
    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    if (minOverlap === overlapTop && entity.vy >= 0) {
      entity.y = p.y - entity.height;
      entity.vy = 0;
      entity.onGround = true;
    } else if (minOverlap === overlapBottom && entity.vy < 0) {
      entity.y = p.y + p.height;
      entity.vy = 0;
    } else if (minOverlap === overlapLeft) {
      entity.x = p.x - entity.width;
      if (entity.vx > 0) entity.vx = 0;
    } else if (minOverlap === overlapRight) {
      entity.x = p.x + p.width;
      if (entity.vx < 0) entity.vx = 0;
    }
  }
}

export function aabb(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function hitboxCheck(attacker, target, range, facing) {
  const hx = facing > 0 ? attacker.x + attacker.width : attacker.x - range;
  const hy = attacker.y - 4;
  const hw = range;
  const hh = attacker.height + 8;

  return (
    hx < target.x + target.width &&
    hx + hw > target.x &&
    hy < target.y + target.height &&
    hy + hh > target.y
  );
}
