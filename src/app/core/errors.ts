import { HttpErrorResponse } from '@angular/common/http';

/** Turns any failed request into a sentence we can show the player. */
export function errorMessage(
  err: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) {
      return "Can't reach the server. Check that the backend is running.";
    }
    // Our Spring ApiExceptionHandler always answers with {"error": "..."}
    return err.error?.error ?? fallback;
  }
  return fallback;
}
