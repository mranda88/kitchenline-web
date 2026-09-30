import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PlayerProfile, ProgramView } from './models';

/** Talks to /api/profile and /api/program on the server. */
@Injectable({ providedIn: 'root' })
export class TrainingService {
  private readonly http = inject(HttpClient);

  /** The saved answers, or null if the player hasn't filled in the profile yet. */
  async getProfile(): Promise<PlayerProfile | null> {
    try {
      return await firstValueFrom(this.http.get<PlayerProfile>('/api/profile'));
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status === 404) {
        return null; // 404 = no profile yet, which is normal for new players
      }
      throw err;
    }
  }

  /** Saves the six answers. The first save also starts Month 1 on the server. */
  saveProfile(profile: PlayerProfile): Promise<PlayerProfile> {
    return firstValueFrom(this.http.put<PlayerProfile>('/api/profile', profile));
  }

  /** This month's program and progress, or null if there's no profile yet (the server answers 409). */
  async getCurrentProgram(): Promise<ProgramView | null> {
    try {
      return await firstValueFrom(this.http.get<ProgramView>('/api/program/current'));
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status === 409) {
        return null;
      }
      throw err;
    }
  }

  /** Check off a workout. The server answers with the updated program and progress. */
  completeWorkout(week: number, day: string): Promise<ProgramView> {
    return firstValueFrom(this.http.post<ProgramView>(`/api/program/workouts/${week}/${day}`, {}));
  }

  /** Un-check a workout. */
  uncompleteWorkout(week: number, day: string): Promise<ProgramView> {
    return firstValueFrom(this.http.delete<ProgramView>(`/api/program/workouts/${week}/${day}`));
  }

  /** Start the next month (members who finished 75%). */
  startNextMonth(): Promise<ProgramView> {
    return firstValueFrom(this.http.post<ProgramView>('/api/program/next-month', {}));
  }
}
