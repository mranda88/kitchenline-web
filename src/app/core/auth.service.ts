import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Account } from './models';

/** Knows who is logged in, and talks to /api/auth on the server. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  /** The logged-in account, or null. Screens read this and update automatically. */
  readonly account = signal<Account | null>(null);

  private checked = false;

  /** Asks the server "who am I?" once per page load. Returns null if not logged in. */
  async loadCurrentUser(): Promise<Account | null> {
    if (!this.checked) {
      try {
        this.account.set(await firstValueFrom(this.http.get<Account>('/api/auth/me')));
      } catch {
        this.account.set(null); // 401 = not logged in, which is fine
      }
      this.checked = true;
    }
    return this.account();
  }

  async login(email: string, password: string): Promise<void> {
    const account = await firstValueFrom(
      this.http.post<Account>('/api/auth/login', { email, password }),
    );
    this.account.set(account);
    this.checked = true;
  }

  /** Creates the account, then logs straight in. */
  async signUp(email: string, password: string): Promise<void> {
    await firstValueFrom(this.http.post<Account>('/api/auth/signup', { email, password }));
    await this.login(email, password);
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post('/api/auth/logout', {}));
    } finally {
      this.account.set(null);
    }
  }
}
