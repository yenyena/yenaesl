import { useRef, useCallback, useEffect } from 'react';
import type { BubblePhysics } from './types';

const MIN_SPEED = 40;
const MAX_SPEED = 80;
const BUBBLE_SIZE = 160;
const REPULSION_DIST = BUBBLE_SIZE + 20;
const REPULSION_FORCE = 60;
const MAX_DT = 0.05; // 50ms cap to prevent teleporting

function randomSpeed(): number {
  const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
  return Math.random() < 0.5 ? speed : -speed;
}

function clampSpeed(v: number, multiplier: number): number {
  const sign = v >= 0 ? 1 : -1;
  const abs = Math.abs(v);
  const min = MIN_SPEED * multiplier;
  const max = MAX_SPEED * multiplier;
  if (abs < min) return sign * min;
  if (abs > max) return sign * max;
  return v;
}

export function useBubblePhysics(
  containerRef: React.RefObject<HTMLDivElement | null>,
  bubbleCount: number,
  frozen: boolean,
  speed: number,
) {
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const physicsRef = useRef<BubblePhysics[]>([]);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const initPositions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const padding = BUBBLE_SIZE / 2 + 10;

    const positions: BubblePhysics[] = [];

    for (let i = 0; i < bubbleCount; i++) {
      let placed = false;
      for (let attempt = 0; attempt < 100; attempt++) {
        const x = padding + Math.random() * (w - 2 * padding);
        const y = padding + Math.random() * (h - 2 * padding);
        const tooClose = positions.some((p) => {
          const dx = p.x - x;
          const dy = p.y - y;
          return Math.sqrt(dx * dx + dy * dy) < REPULSION_DIST;
        });
        if (!tooClose) {
          positions.push({ x, y, vx: randomSpeed(), vy: randomSpeed() });
          placed = true;
          break;
        }
      }
      if (!placed) {
        positions.push({
          x: padding + Math.random() * (w - 2 * padding),
          y: padding + Math.random() * (h - 2 * padding),
          vx: randomSpeed(),
          vy: randomSpeed(),
        });
      }
    }

    physicsRef.current = positions;

    // Apply initial positions to DOM
    positions.forEach((p, i) => {
      const el = bubbleRefs.current[i];
      if (el) {
        el.style.transform = `translate(${p.x - BUBBLE_SIZE / 2}px, ${p.y - BUBBLE_SIZE / 2}px)`;
      }
    });
  }, [containerRef, bubbleCount]);

  useEffect(() => {
    if (frozen) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    // Re-clamp all positions to current container bounds on resume
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const half = BUBBLE_SIZE / 2;
      for (const p of physicsRef.current) {
        p.x = Math.max(half, Math.min(p.x, rect.width - half));
        p.y = Math.max(half, Math.min(p.y, rect.height - half));
      }
      // Apply clamped positions to DOM immediately
      physicsRef.current.forEach((p, i) => {
        const el = bubbleRefs.current[i];
        if (el) {
          el.style.transform = `translate(${p.x - half}px, ${p.y - half}px)`;
        }
      });
    }

    lastTimeRef.current = 0;

    const loop = (time: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const rawDt = Math.min((time - lastTimeRef.current) / 1000, MAX_DT);
      lastTimeRef.current = time;
      const dt = rawDt * speedRef.current;

      const container = containerRef.current;
      if (!container) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const half = BUBBLE_SIZE / 2;

      const physics = physicsRef.current;

      // Update positions
      for (let i = 0; i < physics.length; i++) {
        const p = physics[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Bounce off edges
        if (p.x < half) {
          p.x = half;
          p.vx = Math.abs(p.vx) * (0.9 + Math.random() * 0.2);
        } else if (p.x > w - half) {
          p.x = w - half;
          p.vx = -Math.abs(p.vx) * (0.9 + Math.random() * 0.2);
        }

        if (p.y < half) {
          p.y = half;
          p.vy = Math.abs(p.vy) * (0.9 + Math.random() * 0.2);
        } else if (p.y > h - half) {
          p.y = h - half;
          p.vy = -Math.abs(p.vy) * (0.9 + Math.random() * 0.2);
        }

        // Pairwise repulsion
        for (let j = i + 1; j < physics.length; j++) {
          const q = physics[j];
          const dx = q.x - p.x;
          const dy = q.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPULSION_DIST && dist > 0) {
            const force = (REPULSION_FORCE * dt) / dist;
            const fx = dx * force;
            const fy = dy * force;
            p.vx -= fx;
            p.vy -= fy;
            q.vx += fx;
            q.vy += fy;
          }
        }

        // Clamp speed
        p.vx = clampSpeed(p.vx, speedRef.current);
        p.vy = clampSpeed(p.vy, speedRef.current);
      }

      // Apply to DOM
      for (let i = 0; i < physics.length; i++) {
        const el = bubbleRefs.current[i];
        if (el) {
          el.style.transform = `translate(${physics[i].x - half}px, ${physics[i].y - half}px)`;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafRef.current);
  }, [frozen, containerRef]);

  return { bubbleRefs, physicsRef, initPositions };
}
