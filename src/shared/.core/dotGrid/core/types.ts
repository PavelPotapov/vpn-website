/** RGB string format: "r, g, b" */
export type RGBColor = string;

/** Grid layout configuration */
export interface GridConfig {
  gap: number;
  dotSize: number;
  dotColor: RGBColor;
  perspective: boolean;
}

/** Spark (electric pulse) configuration */
export interface SparkConfig {
  enabled: boolean;
  color: RGBColor;
  targetCount: number;
  stepInterval: [min: number, max: number];
  pathLength: [min: number, max: number];
  trailLength: number;
  diagonalChance: number;
  decay: number;
  glowIntensity: number;
}

/** Mouse physics configuration */
export interface PhysicsConfig {
  enabled: boolean;
  mouseRadius: number;
  mouseForce: number;
  maxShiftFactor: number;
  returnSpeed: number;
}

/** Dot glow configuration */
export interface GlowConfig {
  color: RGBColor;
  pulseSpeed: number;
}

/** Complete engine configuration */
export interface DotGridConfig {
  grid: GridConfig;
  sparks: SparkConfig;
  physics: PhysicsConfig;
  glow: GlowConfig;
}

/** Partial config for overrides */
export type DotGridConfigOverrides = {
  grid?: Partial<GridConfig>;
  sparks?: Partial<SparkConfig>;
  physics?: Partial<PhysicsConfig>;
  glow?: Partial<GlowConfig>;
};
