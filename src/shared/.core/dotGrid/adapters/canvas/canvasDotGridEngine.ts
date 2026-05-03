import type { IDotGridEngine, DotGridConfig, DotGridConfigOverrides } from '../../core';

interface Dot {
  col: number;
  row: number;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  baseAlpha: number;
  pulseOffset: number;
  pulseSpeed: number;
  baseSize: number;
  sparkAlpha: number;
  sparkPrevCol: number;
  sparkPrevRow: number;
}

interface Spark {
  trail: { col: number; row: number }[];
  col: number;
  row: number;
  mainDirCol: number;
  mainDirRow: number;
  stepsLeft: number;
  nextStepAt: number;
  stepInterval: number;
}

const MAIN_DIRS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export class CanvasDotGridEngine implements IDotGridEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: DotGridConfig;

  private dots: Dot[][] = [];
  private sparks: Spark[] = [];
  private cols = 0;
  private rows = 0;
  private w = 0;
  private h = 0;
  private animId = 0;
  private running = false;
  private mouse = { x: -1000, y: -1000 };

  private handleResize: () => void;
  private handleMouseMove: (e: MouseEvent) => void;

  constructor(canvas: HTMLCanvasElement, config: DotGridConfig) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');

    this.canvas = canvas;
    this.ctx = ctx;
    this.config = config;

    this.handleResize = () => this.rebuild();
    this.handleMouseMove = (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inBounds = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      this.mouse = inBounds ? { x, y } : { x: -1000, y: -1000 };
    };
  }

  start(): void {
    if (this.running) return;
    this.running = true;

    this.rebuild();
    this.animId = requestAnimationFrame((t) => this.draw(t));
    window.addEventListener('resize', this.handleResize);

    if (this.config.physics.enabled) {
      document.addEventListener('mousemove', this.handleMouseMove);
    }
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.animId);
  }

  destroy(): void {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.dots = [];
    this.sparks = [];
  }

  updateConfig(overrides: DotGridConfigOverrides): void {
    const prev = this.config;
    this.config = {
      grid: { ...prev.grid, ...overrides.grid },
      sparks: { ...prev.sparks, ...overrides.sparks },
      physics: { ...prev.physics, ...overrides.physics },
      glow: { ...prev.glow, ...overrides.glow },
    };
    this.rebuild();
  }

  resize(): void {
    this.rebuild();
  }

  private rebuild(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.buildDots();
  }

  private buildDots(): void {
    const { gap, dotSize, perspective } = this.config.grid;
    const { pulseSpeed } = this.config.glow;

    this.cols = Math.ceil(this.w / gap) + 2;
    this.rows = Math.ceil(this.h / gap) + 2;
    this.dots = [];

    for (let row = 0; row < this.rows; row++) {
      this.dots[row] = [];
      for (let col = 0; col < this.cols; col++) {
        const bx = ((this.w - (this.cols - 1) * gap) / 2) + col * gap;
        const by = ((this.h - (this.rows - 1) * gap) / 2) + row * gap;

        let baseAlpha = 0.5 + Math.random() * 0.2;
        if (perspective) {
          const cy = this.h / 2;
          const dist = Math.abs(by - cy) / (this.h / 2);
          baseAlpha *= Math.max(0.15, 1 - dist * 0.5);
        }

        this.dots[row][col] = {
          col, row,
          baseX: bx, baseY: by, x: bx, y: by,
          baseAlpha,
          pulseOffset: Math.random() * Math.PI * 2,
          pulseSpeed: pulseSpeed * (0.6 + Math.random() * 0.8),
          baseSize: dotSize * (0.8 + Math.random() * 0.4),
          sparkAlpha: 0,
          sparkPrevCol: -1,
          sparkPrevRow: -1,
        };
      }
    }
  }

  private spawnSpark(time: number): void {
    const { pathLength, stepInterval, diagonalChance } = this.config.sparks;
    const [mainDirCol, mainDirRow] = MAIN_DIRS[Math.floor(Math.random() * 4)];
    const isHoriz = mainDirRow === 0;
    const totalSteps = pathLength[0] + Math.floor(Math.random() * (pathLength[1] - pathLength[0]));

    let startCol: number, startRow: number;
    if (isHoriz) {
      startRow = 1 + Math.floor(Math.random() * (this.rows - 2));
      startCol = mainDirCol === 1
        ? Math.floor(Math.random() * Math.max(1, this.cols - totalSteps))
        : totalSteps + Math.floor(Math.random() * Math.max(1, this.cols - totalSteps));
    } else {
      startCol = 1 + Math.floor(Math.random() * (this.cols - 2));
      startRow = mainDirRow === 1
        ? Math.floor(Math.random() * Math.max(1, this.rows - totalSteps))
        : totalSteps + Math.floor(Math.random() * Math.max(1, this.rows - totalSteps));
    }

    startCol = Math.max(0, Math.min(this.cols - 1, startCol));
    startRow = Math.max(0, Math.min(this.rows - 1, startRow));

    const dot = this.dots[startRow]?.[startCol];
    if (dot) {
      dot.sparkAlpha = 0.9;
      dot.sparkPrevCol = -1;
      dot.sparkPrevRow = -1;
    }

    const interval = stepInterval[0] + Math.random() * (stepInterval[1] - stepInterval[0]);

    this.sparks.push({
      trail: [{ col: startCol, row: startRow }],
      col: startCol,
      row: startRow,
      mainDirCol,
      mainDirRow,
      stepsLeft: totalSteps,
      nextStepAt: time + 60,
      stepInterval: interval,
    });

    void diagonalChance;
  }

  private stepSparks(time: number): void {
    const { trailLength, diagonalChance } = this.config.sparks;

    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];

      if (s.stepsLeft <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }

      if (time < s.nextStepAt) continue;
      s.nextStepAt = time + s.stepInterval;

      const prevCol = s.col;
      const prevRow = s.row;

      if (Math.random() < diagonalChance) {
        const perpCol = s.mainDirRow === 0 ? 0 : (Math.random() > 0.5 ? 1 : -1);
        const perpRow = s.mainDirCol === 0 ? 0 : (Math.random() > 0.5 ? 1 : -1);
        s.col += s.mainDirCol + perpCol;
        s.row += s.mainDirRow + perpRow;
      } else {
        s.col += s.mainDirCol;
        s.row += s.mainDirRow;
      }

      s.col = Math.max(0, Math.min(this.cols - 1, s.col));
      s.row = Math.max(0, Math.min(this.rows - 1, s.row));

      if (s.col < 0 || s.col >= this.cols || s.row < 0 || s.row >= this.rows) {
        this.sparks.splice(i, 1);
        continue;
      }

      s.trail.push({ col: s.col, row: s.row });
      s.stepsLeft--;

      const dot = this.dots[s.row][s.col];
      dot.sparkAlpha = Math.max(dot.sparkAlpha, 0.9);
      dot.sparkPrevCol = prevCol;
      dot.sparkPrevRow = prevRow;

      for (let ti = 0; ti < s.trail.length; ti++) {
        const age = s.trail.length - 1 - ti;
        if (age > trailLength) continue;
        const { col: tc, row: tr } = s.trail[ti];
        if (tr >= 0 && tr < this.rows && tc >= 0 && tc < this.cols) {
          const fadeAlpha = (1 - age / trailLength) * 0.8;
          const trailDot = this.dots[tr][tc];
          trailDot.sparkAlpha = Math.max(trailDot.sparkAlpha, fadeAlpha);
        }
      }
    }
  }

  private draw = (time: number): void => {
    if (!this.running) return;

    const { ctx } = this;
    const { grid, sparks: sparkCfg, physics, glow } = this.config;
    const { gap, dotColor } = grid;
    const { decay, glowIntensity } = sparkCfg;
    const maxShift = gap * physics.maxShiftFactor;

    ctx.clearRect(0, 0, this.w, this.h);
    const t = time * 0.001;
    const mx = this.mouse.x;
    const my = this.mouse.y;

    if (sparkCfg.enabled && this.sparks.length < sparkCfg.targetCount) {
      this.spawnSpark(time);
    }
    if (sparkCfg.enabled) this.stepSparks(time);

    // Spark lines
    if (sparkCfg.enabled) {
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          const dot = this.dots[row][col];
          if (dot.sparkAlpha < 0.1 || dot.sparkPrevCol < 0) continue;

          const pRow = dot.sparkPrevRow;
          const pCol = dot.sparkPrevCol;
          if (pRow < 0 || pRow >= this.rows || pCol < 0 || pCol >= this.cols) continue;

          const prev = this.dots[pRow][pCol];
          if (prev.sparkAlpha < 0.05) continue;

          const lineAlpha = Math.min(dot.sparkAlpha, prev.sparkAlpha) * 0.6;
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(dot.x, dot.y);
          ctx.strokeStyle = `rgba(${sparkCfg.color}, ${lineAlpha})`;
          ctx.lineWidth = 1 + lineAlpha * 1.5;
          ctx.shadowBlur = 8 + lineAlpha * 10;
          ctx.shadowColor = `rgba(${sparkCfg.color}, ${lineAlpha * 0.5})`;
          ctx.stroke();
        }
      }
      ctx.shadowBlur = 0;
    }

    // Dots
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const dot = this.dots[row][col];

        // Mouse physics
        if (physics.enabled) {
          const dxM = mx - dot.baseX;
          const dyM = my - dot.baseY;
          const distM = Math.sqrt(dxM * dxM + dyM * dyM);

          if (distM < physics.mouseRadius && distM > 1) {
            const influence = 1 - distM / physics.mouseRadius;
            const smooth = influence * influence * (3 - 2 * influence);
            const shiftX = dxM * smooth * physics.mouseForce;
            const shiftY = (dyM * smooth * physics.mouseForce) - (smooth * maxShift * 0.3);

            const len = Math.sqrt(shiftX * shiftX + shiftY * shiftY);
            if (len > maxShift) {
              const sc = maxShift / len;
              dot.x = dot.baseX + shiftX * sc;
              dot.y = dot.baseY + shiftY * sc;
            } else {
              dot.x = dot.baseX + shiftX;
              dot.y = dot.baseY + shiftY;
            }
          } else {
            dot.x += (dot.baseX - dot.x) * physics.returnSpeed;
            dot.y += (dot.baseY - dot.y) * physics.returnSpeed;
          }
        }

        const pulse = Math.sin(t * dot.pulseSpeed + dot.pulseOffset);
        let alpha = dot.baseAlpha + pulse * 0.04;
        let size = dot.baseSize;

        // Mouse proximity glow
        if (physics.enabled) {
          const dx = mx - dot.x;
          const dy = my - dot.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < physics.mouseRadius) {
            const prox = 1 - dist / physics.mouseRadius;
            alpha += prox * prox * 0.4;
            size += prox * 1.2;
          }
        }

        const hasSpark = dot.sparkAlpha > 0.02;
        if (hasSpark) {
          alpha = Math.max(alpha, dot.sparkAlpha);
          size = Math.max(size, dot.baseSize + dot.sparkAlpha * 2.5);
        }

        alpha = Math.max(0, Math.min(1, alpha));

        if (hasSpark && dot.sparkAlpha > 0.15) {
          ctx.shadowBlur = 10 + dot.sparkAlpha * 12;
          ctx.shadowColor = `rgba(${sparkCfg.color}, ${dot.sparkAlpha * glowIntensity})`;
        } else if (alpha > 0.3) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = `rgba(${glow.color}, ${alpha * 0.4})`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
        ctx.fillStyle = hasSpark && dot.sparkAlpha > 0.15
          ? `rgba(${sparkCfg.color}, ${alpha})`
          : `rgba(${dotColor}, ${alpha})`;
        ctx.fill();

        if (hasSpark) {
          dot.sparkAlpha *= decay;
          if (dot.sparkAlpha < 0.02) {
            dot.sparkAlpha = 0;
            dot.sparkPrevCol = -1;
            dot.sparkPrevRow = -1;
          }
        }
      }
    }

    ctx.shadowBlur = 0;
    this.animId = requestAnimationFrame(this.draw);
  };
}
