const MAX_TOKENS = 50_000;
let used = 0;

export function tryReserve(n: number): void {
  if (used + n > MAX_TOKENS) {
    throw new TokenBudgetExhaustedError(used, n, MAX_TOKENS);
  }
  used += n;
}

export function getUsed(): number {
  return used;
}

export function getRemaining(): number {
  return MAX_TOKENS - used;
}

export function reset(): void {
  used = 0;
}

export class TokenBudgetExhaustedError extends Error {
  constructor(
    public readonly used: number,
    public readonly requested: number,
    public readonly max: number,
  ) {
    super(`Token budget exhausted: ${used} used + ${requested} requested > ${max} max`);
    this.name = 'TokenBudgetExhaustedError';
  }
}
