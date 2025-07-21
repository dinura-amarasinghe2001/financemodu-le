import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "app/core/auth/auth.service";
import { AuthUtils } from "app/core/auth/auth.utils";
import { Observable, catchError, tap, throwError } from "rxjs";

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // Log API activity
  console.log("[Interceptor] API Call Detected:", req.url);

  // Reset inactivity timer on every request
  authService.resetInactivityTimer();

  // refresh every 4 mins
  const lastRefresh = Number(localStorage.getItem("lastTokenRefresh") ?? "0");
  const now = Date.now();

  // 4 minutes = 240000 ms
  if (now - lastRefresh > 240000) {
    localStorage.setItem("lastTokenRefresh", now.toString());
    authService.refreshTokenIfActive();
  }

  let newReq = req.clone();

  if (
    authService.accessToken &&
    !AuthUtils.isTokenExpired(authService.accessToken)
  ) {
    newReq = newReq.clone({
      headers: req.headers
        .delete("Cookie")
        .set("Authorization", `Bearer ${authService.accessToken}`),
    });
  }

  return next(newReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.signOut();
        // location.reload();
      }
      return throwError(error);
    })
  );
};
