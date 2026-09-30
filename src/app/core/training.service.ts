import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PlayerProfile } from './models';

/** Talks to /api/profile (and, in 6d, /api/program) on the server. */
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
}
