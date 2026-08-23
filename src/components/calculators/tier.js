// Map a multiplier to a visual tier (1 = weakest, 5 = strongest).
export function tierClass(mult) {
  if (mult >= 2.75) return 'tier-5';
  if (mult >= 2.2) return 'tier-4';
  if (mult >= 1.8) return 'tier-3';
  if (mult >= 1.4) return 'tier-2';
  return 'tier-1';
}
