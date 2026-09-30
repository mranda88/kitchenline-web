import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { TrainingService } from '../../core/training.service';
import { PlayerProfile, SKILL_LEVELS } from '../../core/models';

/** Temporary home screen. Step 6d replaces it with the program screen. */
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

  /** undefined = still loading, null = no profile yet */
  protected readonly profile = signal<PlayerProfile | null | undefined>(undefined);

  constructor() {
    this.training
      .getProfile()
      .then((p) => this.profile.set(p))
      .catch(() => this.profile.set(null));
  }

  protected rating(p: PlayerProfile): string {
    return SKILL_LEVELS.find((s) => s.value === p.skill)?.rating ?? '';
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }
}
