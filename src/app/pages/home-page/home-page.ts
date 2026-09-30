import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { TrainingService } from '../../core/training.service';
import { CATEGORY_NAMES, ProgramView, SKILL_LEVELS } from '../../core/models';
import { COOL_DOWN, suggestedWeek, warmUpFor } from '../../core/week-plan';
import { errorMessage } from '../../core/errors';

/** The main screen: this month's program, week by week. */
@Component({
  imports: [RouterLink],
  selector: 'app-home-page',
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
})
export class HomePage {
  protected readonly auth = inject(AuthService);
  private readonly training = inject(TrainingService);
  private readonly router = inject(Router);

  // Fixed display text
  protected readonly categoryNames = CATEGORY_NAMES;
  protected readonly weekTitles = ['Groove', 'Volume', 'Sets', 'Load'];
  protected readonly dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  protected readonly activityNames = { train: 'Train', drill: 'Drill', play: 'Play' };
  protected readonly coolDown = COOL_DOWN;

  // Page state
  protected readonly view = signal<ProgramView | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly selectedWeek = signal(1);
  protected readonly savingDay = signal<string | null>(null); // e.g. "2B" while saving
  protected readonly startingMonth = signal(false);

  // Values worked out from the state; they update automatically
  protected readonly program = computed(() => this.view()?.program);
  protected readonly profile = computed(() => this.program()?.profile);
  protected readonly isMember = computed(
    () => this.auth.account()?.subscriptionStatus === 'ACTIVE',
  );
  protected readonly locked = computed(
    () => this.selectedWeek() > (this.view()?.unlockedWeeks ?? 1),
  );
  protected readonly week = computed(
    () => this.program()?.weeks.find((w) => w.number === this.selectedWeek()) ?? null,
  );
  protected readonly schedule = computed(() => {
    const p = this.profile();
    return p ? suggestedWeek(p) : [];
  });
  protected readonly warmUp = computed(() => warmUpFor(this.program()?.intensity.tier ?? 1));
  protected readonly rating = computed(
    () => SKILL_LEVELS.find((s) => s.value === this.profile()?.skill)?.rating ?? '',
  );

  constructor() {
    this.load();
  }

  private async load(): Promise<void> {
    try {
      const view = await this.training.getCurrentProgram();
      if (!view) {
        // No profile yet: send new players to the form
        await this.router.navigateByUrl('/profile');
        return;
      }
      this.view.set(view);
      this.selectedWeek.set(this.firstUnfinishedWeek(view));
    } catch (err) {
      this.error.set(errorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }

  /** Open on the first unlocked week that still has workouts to do. */
  private firstUnfinishedWeek(view: ProgramView): number {
    const labels = this.dayLabels(view);
    for (let w = 1; w <= view.unlockedWeeks; w++) {
      if (labels.some((d) => !view.completed.includes(`${w}${d}`))) {
        return w;
      }
    }
    return view.unlockedWeeks;
  }

  private dayLabels(view: ProgramView): string[] {
    return Array.from({ length: view.program.profile.workoutsPerWeek }, (_, i) =>
      String.fromCharCode(65 + i),
    ); // A, B, C, ...
  }

  protected isDone(week: number, day: string): boolean {
    return this.view()?.completed.includes(`${week}${day}`) ?? false;
  }

  protected doneInWeek(week: number): number {
    return this.view()?.completed.filter((c) => c.startsWith(String(week))).length ?? 0;
  }

  /** Check or un-check a workout, then show the server's updated progress. */
  protected async toggle(week: number, day: string): Promise<void> {
    this.error.set(null);
    this.savingDay.set(`${week}${day}`);
    try {
      const updated = this.isDone(week, day)
        ? await this.training.uncompleteWorkout(week, day)
        : await this.training.completeWorkout(week, day);
      this.view.set(updated);
    } catch (err) {
      this.error.set(errorMessage(err));
    } finally {
      this.savingDay.set(null);
    }
  }

  protected async startNextMonth(): Promise<void> {
    this.error.set(null);
    this.startingMonth.set(true);
    try {
      this.view.set(await this.training.startNextMonth());
      this.selectedWeek.set(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      this.error.set(errorMessage(err));
    } finally {
      this.startingMonth.set(false);
    }
  }

  protected async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }
}
