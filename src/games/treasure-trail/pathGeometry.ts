import type { PathPoint } from './types';

interface CubicSegment {
  p0: { x: number; y: number };
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  p3: { x: number; y: number };
}

function cubicBezier(seg: CubicSegment, t: number): { x: number; y: number } {
  const u = 1 - t;
  return {
    x: u * u * u * seg.p0.x + 3 * u * u * t * seg.p1.x + 3 * u * t * t * seg.p2.x + t * t * t * seg.p3.x,
    y: u * u * u * seg.p0.y + 3 * u * u * t * seg.p1.y + 3 * u * t * t * seg.p2.y + t * t * t * seg.p3.y,
  };
}

function buildSerpentineSegments(rows: number): CubicSegment[] {
  const segments: CubicSegment[] = [];
  const marginX = 80;
  const marginY = 60;
  const width = 900 - 2 * marginX;
  const height = 500 - 2 * marginY;
  const rowHeight = height / (rows - 1);
  const curveRadius = rowHeight * 0.5;

  for (let r = 0; r < rows; r++) {
    const y = marginY + r * rowHeight;
    const leftToRight = r % 2 === 0;
    const x0 = leftToRight ? marginX : marginX + width;
    const x1 = leftToRight ? marginX + width : marginX;

    // Horizontal segment with slight curve
    segments.push({
      p0: { x: x0, y },
      p1: { x: x0 + (x1 - x0) * 0.33, y },
      p2: { x: x0 + (x1 - x0) * 0.66, y },
      p3: { x: x1, y },
    });

    // U-turn to next row
    if (r < rows - 1) {
      const nextY = marginY + (r + 1) * rowHeight;
      const midY = (y + nextY) / 2;
      const turnX = leftToRight ? marginX + width + curveRadius * 0.5 : marginX - curveRadius * 0.5;

      segments.push({
        p0: { x: x1, y },
        p1: { x: turnX, y: midY - curveRadius * 0.2 },
        p2: { x: turnX, y: midY + curveRadius * 0.2 },
        p3: { x: x1, y: nextY },
      });
    }
  }

  return segments;
}

function sampleSegments(segments: CubicSegment[], samplesPerSegment: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  for (let s = 0; s < segments.length; s++) {
    const numSamples = s === segments.length - 1 ? samplesPerSegment + 1 : samplesPerSegment;
    for (let i = 0; i < numSamples; i++) {
      const t = i / samplesPerSegment;
      points.push(cubicBezier(segments[s], t));
    }
  }
  return points;
}

function computeArcLengths(points: { x: number; y: number }[]): number[] {
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    lengths.push(lengths[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  return lengths;
}

function interpolateAtDistance(
  points: { x: number; y: number }[],
  arcLengths: number[],
  targetDist: number,
): { x: number; y: number } {
  const totalLength = arcLengths[arcLengths.length - 1];
  const dist = Math.max(0, Math.min(targetDist, totalLength));

  let lo = 0;
  let hi = arcLengths.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (arcLengths[mid] <= dist) lo = mid;
    else hi = mid;
  }

  const segLen = arcLengths[hi] - arcLengths[lo];
  const t = segLen > 0 ? (dist - arcLengths[lo]) / segLen : 0;
  return {
    x: points[lo].x + t * (points[hi].x - points[lo].x),
    y: points[lo].y + t * (points[hi].y - points[lo].y),
  };
}

export function generatePath(pathLength: number): { pathD: string; points: PathPoint[] } {
  const rows = pathLength <= 20 ? 3 : pathLength <= 30 ? 4 : 4;
  const segments = buildSerpentineSegments(rows);

  // Build SVG path string
  let pathD = `M ${segments[0].p0.x} ${segments[0].p0.y}`;
  for (const seg of segments) {
    pathD += ` C ${seg.p1.x} ${seg.p1.y}, ${seg.p2.x} ${seg.p2.y}, ${seg.p3.x} ${seg.p3.y}`;
  }

  // Sample fine points along path
  const sampledPoints = sampleSegments(segments, 50);
  const arcLengths = computeArcLengths(sampledPoints);
  const totalLength = arcLengths[arcLengths.length - 1];

  // Place pathLength evenly-spaced points
  const points: PathPoint[] = [];
  for (let i = 0; i < pathLength; i++) {
    const dist = (i / (pathLength - 1)) * totalLength;
    const pos = interpolateAtDistance(sampledPoints, arcLengths, dist);

    // Compute angle from nearby points for rotation
    const dBefore = interpolateAtDistance(sampledPoints, arcLengths, Math.max(0, dist - 1));
    const dAfter = interpolateAtDistance(sampledPoints, arcLengths, Math.min(totalLength, dist + 1));
    const angle = Math.atan2(dAfter.y - dBefore.y, dAfter.x - dBefore.x) * (180 / Math.PI);

    points.push({ x: pos.x, y: pos.y, angle });
  }

  return { pathD, points };
}
