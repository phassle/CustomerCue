import type { Urgency } from './types';

const URGENCY_WEIGHT: Record<Urgency, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function urgencyWeight(urgency: Urgency): number {
  return URGENCY_WEIGHT[urgency];
}

export function arrWeight(arr: number): number {
  return Math.log10(arr + 1);
}

export function priorityScore(arr: number, urgency: Urgency): number {
  return arrWeight(arr) * urgencyWeight(urgency);
}
