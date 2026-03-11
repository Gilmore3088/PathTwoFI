// FIRE (Financial Independence, Retire Early) Configuration
// These are the household targets for the Gilmore family

export const FIRE_CONFIG = {
  // Today's dollars
  todayGoal: 3_500_000,
  todayStretchGoal: 4_000_000,

  // Target date
  fireTargetDate: '2040-01-30',

  // Inflation assumptions
  inflationRate: 0.03,

  // Current snapshot (updated from wealth data when available)
  currentNetWorth: 816_457,
} as const;

/**
 * Calculate years remaining until FIRE target date
 */
export function getYearsToFire(fromDate: Date = new Date()): number {
  const target = new Date(FIRE_CONFIG.fireTargetDate);
  const diffMs = target.getTime() - fromDate.getTime();
  return Math.max(0, diffMs / (365.25 * 24 * 60 * 60 * 1000));
}

/**
 * Calculate the inflation multiplier for a given number of years
 */
export function getInflationMultiplier(years: number): number {
  return Math.pow(1 + FIRE_CONFIG.inflationRate, years);
}

/**
 * Calculate FIRE goal in future (inflation-adjusted) dollars
 */
export function getFutureFireGoal(fromDate: Date = new Date()): number {
  const years = getYearsToFire(fromDate);
  return FIRE_CONFIG.todayGoal * getInflationMultiplier(years);
}

/**
 * Calculate stretch FIRE goal in future dollars
 */
export function getFutureStretchGoal(fromDate: Date = new Date()): number {
  const years = getYearsToFire(fromDate);
  return FIRE_CONFIG.todayStretchGoal * getInflationMultiplier(years);
}

/**
 * Calculate progress toward the future-adjusted FIRE goal
 */
export function getFireProgress(currentNetWorth: number, fromDate: Date = new Date()) {
  const years = getYearsToFire(fromDate);
  const multiplier = getInflationMultiplier(years);
  const futureGoal = FIRE_CONFIG.todayGoal * multiplier;
  const futureStretchGoal = FIRE_CONFIG.todayStretchGoal * multiplier;

  return {
    currentNetWorth,
    todayGoal: FIRE_CONFIG.todayGoal,
    todayStretchGoal: FIRE_CONFIG.todayStretchGoal,
    fireTargetDate: FIRE_CONFIG.fireTargetDate,
    yearsToFire: Math.round(years * 100) / 100,
    inflationRate: FIRE_CONFIG.inflationRate,
    inflationMultiplier: Math.round(multiplier * 100) / 100,
    futureGoal: Math.round(futureGoal),
    futureStretchGoal: Math.round(futureStretchGoal),
    progressPercent: Math.round((currentNetWorth / futureGoal) * 100),
    stretchProgressPercent: Math.round((currentNetWorth / futureStretchGoal) * 100),
  };
}

/**
 * Format a number as USD currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as a percentage
 */
export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}
