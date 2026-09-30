// TypeScript shapes of the JSON your Spring API sends and receives.
// They mirror the Java records and enums, so the editor catches typos.

export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';

export interface Account {
  id: number;
  email: string;
  subscriptionStatus: SubscriptionStatus;
}

export type Gender = 'MALE' | 'FEMALE' | 'UNSPECIFIED';

export type SkillLevel = 'BEGINNER' | 'ADVANCED_BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface PlayerProfile {
  age: number;
  gender: Gender;
  skill: SkillLevel;
  drillsPerWeek: number;
  playsPerWeek: number;
  workoutsPerWeek: number;
}

/** Display text for each skill level, in the same order as the Java enum. */
export const SKILL_LEVELS: { value: SkillLevel; rating: string; label: string }[] = [
  { value: 'BEGINNER', rating: '2.5', label: 'Beginner' },
  { value: 'ADVANCED_BEGINNER', rating: '3.0', label: 'Advanced beginner' },
  { value: 'INTERMEDIATE', rating: '3.5', label: 'Intermediate' },
  { value: 'ADVANCED', rating: '4.0', label: 'Advanced' },
  { value: 'EXPERT', rating: '4.5+', label: 'Expert / tournament' },
];

export const GENDERS: { value: Gender; label: string }[] = [
  { value: 'FEMALE', label: 'Female' },
  { value: 'MALE', label: 'Male' },
  { value: 'UNSPECIFIED', label: 'Prefer not to say' },
];
