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

// ---------- The program (matches TrainingService.ProgramView in Spring) ----------

export type Category = 'LATERAL' | 'GLUTE_HIP' | 'SHOULDER' | 'POWER_CORE';

export const CATEGORY_NAMES: Record<Category, string> = {
  LATERAL: 'Lateral movement',
  GLUTE_HIP: 'Glute & hip strength',
  SHOULDER: 'Shoulder stability',
  POWER_CORE: 'Paddle power & core',
};

export interface Exercise {
  id: string;
  name: string;
  category: Category;
  minTier: number;
  unit: 'REPS' | 'SECONDS';
  perSide: boolean;
  plyometric: boolean;
  usesDumbbells: boolean;
  cue: string;
}

export interface Prescription {
  exercise: Exercise;
  sets: number;
  amount: number;
  dose: string;
  rpe: number;
  suggestedLoadLbs: number | null;
}

export interface WorkoutBlock {
  category: Category;
  focus: boolean;
  exercises: Prescription[];
}

export interface WorkoutDay {
  label: string;
  focus: Category;
  blocks: WorkoutBlock[];
}

export interface TrainingWeek {
  number: number;
  title: string;
  instructions: string;
  days: WorkoutDay[];
}

export interface Intensity {
  tier: number;
  label: string;
  jumpsAllowed: boolean;
}

export interface MonthlyProgram {
  month: number;
  profile: PlayerProfile;
  intensity: Intensity;
  weeks: TrainingWeek[];   // only the weeks this player has unlocked
  notes: string[];
}

export interface ProgramView {
  program: MonthlyProgram;
  unlockedWeeks: number;
  completed: string[];     // e.g. ["1A", "1B"]
  completedCount: number;
  totalWorkouts: number;
  percentComplete: number;
  canStartNextMonth: boolean;
}
