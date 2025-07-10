import type { Question } from '@/components/types';

export function allCombos(min: number, max: number): Question[] {
  const out: Question[] = [];
  for (let table = min; table <= max; table++) {
    for (let multiplier = min; multiplier <= max; multiplier++) {
      out.push({ table, multiplier });
    }
  }
  return out;
}
