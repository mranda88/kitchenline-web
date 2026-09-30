import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { errorMessage } from '../../core/errors';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-auth-page',
  styleUrl: './auth-page.css',
  templateUrl: './auth-page.html',
})
export class AuthPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** 'login' or 'signup', filled in from the route's data (see app.routes.ts). */
  readonly mode = input<'login' | 'signup'>('login');

  email = '';
  password = '';
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  async submit(): Promise<void> {
    this.error.set(null);
    this.busy.set(true);
    try {
      if (this.mode() === 'signup') {
        await this.auth.signUp(this.email, this.password);
      } else {
        await this.auth.login(this.email, this.password);
      }
      await this.router.navigateByUrl(this.mode() === 'signup' ? '/profile' : '/');
    } catch (err) {
      this.error.set(errorMessage(err));
    } finally {
      this.busy.set(false);
    }
  }
}
