import { Component, WritableSignal, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TrainingService } from '../../core/training.service';
import { GENDERS, Gender, SKILL_LEVELS, SkillLevel } from '../../core/models';
import { errorMessage } from '../../core/errors';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-profile-page',
  styleUrl: './profile-page.css',
  templateUrl: './profile-page.html',
})
export class ProfilePage {
  private readonly training = inject(TrainingService);
  private readonly router = inject(Router);

  // Options for the choice buttons
  protected readonly genders = GENDERS;
  protected readonly skillLevels = SKILL_LEVELS;

  // The six answers (with sensible starting values for new players)
  protected readonly age = signal<number | null>(null);
  protected readonly gender = signal<Gender>('UNSPECIFIED');
  protected readonly skill = signal<SkillLevel>('INTERMEDIATE');
  protected readonly drills = signal(2);
  protected readonly plays = signal(3);
  protected readonly workouts = signal(3);

  // Page state
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isNew = signal(true);

  /** Recalculates automatically whenever drills or plays change. */
  protected readonly courtSessions = computed(() => this.drills() + this.plays());

  protected readonly skillDescription = computed(
    () => SKILL_LEVELS.find((s) => s.value === this.skill())?.label ?? '',
  );

  constructor() {
    this.load();
  }

  /** If the player already has a profile, fill the form with their saved answers. */
  private async load(): Promise<void> {
    try {
      const saved = await this.training.getProfile();
      if (saved) {
        this.isNew.set(false);
        this.age.set(saved.age);
        this.gender.set(saved.gender);
        this.skill.set(saved.skill);
        this.drills.set(saved.drillsPerWeek);
        this.plays.set(saved.playsPerWeek);
        this.workouts.set(saved.workoutsPerWeek);
      }
    } catch (err) {
      this.error.set(errorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }

  /** The − / + buttons: change a count, staying within min and max. */
  protected bump(counter: WritableSignal<number>, change: number, min: number, max: number): void {
    counter.set(Math.min(max, Math.max(min, counter() + change)));
  }

  protected async save(): Promise<void> {
    const age = this.age();
    if (age === null || age < 16 || age > 90) {
      this.error.set('Enter an age between 16 and 90.');
      return;
    }

    this.error.set(null);
    this.saving.set(true);
    try {
      await this.training.saveProfile({
        age,
        gender: this.gender(),
        skill: this.skill(),
        drillsPerWeek: this.drills(),
        playsPerWeek: this.plays(),
        workoutsPerWeek: this.workouts(),
      });
      await this.router.navigateByUrl('/');
    } catch (err) {
      this.error.set(errorMessage(err));
    } finally {
      this.saving.set(false);
    }
  }
}
