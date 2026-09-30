import { PlayerProfile } from './models';

export type Activity = 'train' | 'drill' | 'play';

/**
 * Spreads workouts evenly across Mon-Sun, then fills in court sessions,
 * preferring days without a workout. Returns 7 lists, one per day.
 */
export function suggestedWeek(p: PlayerProfile): Activity[][] {
  const days: Activity[][] = Array.from({ length: 7 }, () => []);

  for (let i = 0; i < p.workoutsPerWeek; i++) {
    days[Math.round((i * 7) / p.workoutsPerWeek) % 7].push('train');
  }

  const court: Activity[] = [
    ...Array<Activity>(p.playsPerWeek).fill('play'),
    ...Array<Activity>(p.drillsPerWeek).fill('drill'),
  ];
  for (const session of court) {
    let best = 0;
    let lowest = Infinity;
    for (let i = 0; i < 7; i++) {
      const busy = days[i].length * 2 + (days[i].includes('train') ? 1 : 0);
      if (busy < lowest) {
        lowest = busy;
        best = i;
      }
    }
    days[best].push(session);
  }
  return days;
}

/** Warm-up gets more dynamic as intensity goes up. */
export function warmUpFor(tier: number): string {
  if (tier >= 4) {
    return "Jog 2 min · leg swings · world's greatest stretch · band pull-aparts · 3 × 10 s fast feet · 2 split-step hops";
  }
  if (tier >= 2) {
    return 'Brisk walk or light jog 3 min · leg swings · hip circles · arm circles · band pull-aparts · 10 split-steps';
  }
  return 'March in place 3 min · hip circles · arm circles · 10 wall push-ups · 10 slow split-steps';
}

export const COOL_DOWN =
  '90/90 hip switches · half-kneeling hip flexor stretch · doorway chest stretch · 5 slow breaths lying down';
