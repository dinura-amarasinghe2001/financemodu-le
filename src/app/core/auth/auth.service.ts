import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { AuthUtils } from "app/core/auth/auth.utils";
import { UserService } from "app/core/user/user.service";
import { environment } from "environments/environment";
import {
  catchError,
  mapTo,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from "rxjs";
import { User } from "../user/user.types";
import { Logout } from "app/login/logout.model";
import { ApplicationConfigService } from "../config/application-config.service";
import { MatDialog } from "@angular/material/dialog";
import { ActiveConfirmationWizardComponent } from "app/modules/admin/activ-confirm-wizard/active-confirmation-wizard.component";

@Injectable({ providedIn: "root" })
export class AuthService {
  private _authenticated: boolean = false;
  private _httpClient = inject(HttpClient);
  private _userService = inject(UserService);
  private cookieService = inject(CookieService);
  private _refreshTokenTimer: any;
  private _dialogService = inject(MatDialog);

  private _inactivityTimer: any;

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    localStorage.setItem("accessToken", token);
  }

  get accessToken(): string {
    return localStorage.getItem("accessToken") ?? "";
  }
  // -----------------------------------------------------------------------------------------------------
  set refreshToken(token: string) {
    localStorage.setItem("refreshToken", token);
  }

  get refreshToken(): string {
    return localStorage.getItem("refreshToken") ?? "";
  }

  set expireTime(time: string) {
    localStorage.setItem("expireTime", time) ?? "";
  }

  get expireTime(): string {
    return localStorage.getItem("expireTime") ?? "";
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Forgot password
   *
   * @param email
   */
  forgotPassword(email: string): Observable<any> {
    return this._httpClient.post("api/auth/forgot-password", email);
  }

  /**
   * Reset password
   *
   * @param password
   */
  resetPassword(password: string): Observable<any> {
    return this._httpClient.post("api/auth/reset-password", password);
  }

  /**
   * Sign in
   *
   * @param credentials
   */
  signIn(credentials: { username: string; password: string }): Observable<any> {
    // Throw error, if the user is already logged in
    if (this._authenticated) {
      return throwError("User is already logged in.");
    }

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const body = new URLSearchParams();
    body.set("grant_type", "password");
    body.set("client_id", "macmi_nimeshMotors");
    body.set("username", credentials.username);
    body.set("password", credentials.password);
    body.set("client_secret", "enSW3YuTLFtCFfvvivMjh8toVC4XAy8J");
    // body.set("client_secret", "SX2wGiLaPhyTAFQWeGkzLp683VkaMOj0");
    body.set("scope", "openid offline_access");

    return this._httpClient
      .post(environment.sso, body.toString(), { headers })
      .pipe(
        // return this._httpClient.post('realms/if/protocol/openid-connect/token', body.toString(), { headers }).pipe(
        switchMap((response: any) => {
          console.log(response);
          this._authenticated = true;

          // Store the access token in the local storage
          // Set the authenticated flag to true
          this.accessToken = response.access_token;
          this.refreshToken = response.refresh_token;
          // this.startTokenRefreshTimer(response.expires_in);

          // this.startTokenRefreshTimerTest();

          // Store the expire time in the local storage
          this.expireTime = response.expires_in;
          // this.startTokenRefreshTimer();

          // Return a new observable with the response
          return this._httpClient
            .get(`${environment.apiBaseUrl}/api/account`, {
              headers: { Authorization: "Bearer " + this.accessToken },
            })
            .pipe(
              switchMap((response2: any) => {
                environment.user = {
                  ...response2,
                  name: response2.firstName + " " + response2.lastName,
                  avatar:
                    "https://api.dicebear.com/9.x/shapes/svg?seed=" +
                    response2.id,
                };
                // Store the user on the user service
                this._userService.user = {
                  ...response2,
                  name: response2.firstName + " " + response2.lastName,
                  avatar:
                    "https://api.dicebear.com/9.x/shapes/svg?seed=" +
                    response2.id,
                };

                this._authenticated = true;
                this.startActivityMonitoring();
                return of(response);
              })
            );

          return of(response);
        })
      );
  }

  startActivityMonitoring(): void {
    this.resetInactivityTimer(); // Start once at login
  }

  resetInactivityTimer(): void {
    clearTimeout(this._inactivityTimer);

    // minutes = 240000 ms
    this._inactivityTimer = setTimeout(() => {
      if (!this._authenticated) return;
      // Show alert or log out
      // alert("Session expired due to inactivity. Please log in again.");
      // this.openActiveDialog();
      this.refreshTokenIfActive();
    }, 10000); // 4 minutes
  }

  /**
   * Open Active dialog
   */
  openActiveDialog(): void {
    const dialogRef = this._dialogService.open(
      ActiveConfirmationWizardComponent,
      {
        width: "60vh",
        maxHeight: "90vh",
      }
    );

    dialogRef.afterClosed().subscribe(() => {
      this.signOut();
      location.reload();
    });
  }

  refreshTokenIfActive(): void {
    this.refreshAccessToken().subscribe({
      next: () => console.log("[Token Refresh] Success"),
      error: () => {
        console.error("[Token Refresh] Failed");
        this.signOut();
        location.reload();
      },
    });
  }

  refreshAccessToken(): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const body = new URLSearchParams();
    body.set("grant_type", "refresh_token");
    body.set("client_id", "macmi_nimeshMotors");
    body.set("client_secret", "enSW3YuTLFtCFfvvivMjh8toVC4XAy8J");
    // body.set("client_secret", "SX2wGiLaPhyTAFQWeGkzLp683VkaMOj0");
    body.set("refresh_token", this.refreshToken);

    return this._httpClient
      .post(environment.sso, body.toString(), { headers })
      .pipe(
        tap((response: any) => {
          this.accessToken = response.access_token;
          console.log("Access Token", this.accessToken);
          this.refreshToken = response.refresh_token;
          console.log("Refresh Token", this.refreshToken);
        })
      );
  }

  // private startTokenRefreshTimer(expiresIn = 300): void {
  //   console.log("Attempting to refresh token...");
  //   const refreshTime = (expiresIn - 30) * 1000;
  //   clearTimeout(this._refreshTokenTimer);

  //   this._refreshTokenTimer = setTimeout(() => {
  //     this.refreshAccessToken().subscribe({
  //       next: () => {},
  //       error: () => this.signOut(),
  //     });
  //   }, refreshTime);
  // }

  signOut(): void {
    this._authenticated = false;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    this.cookieService.deleteAll();
    // window.location.href = "/sign-in";
    // const xsrfToken = this.cookieService.get("XSRF-TOKEN");

    // const headers = new HttpHeaders({
    //   Accept: "*/*",
    //   "X-XSRF-TOKEN": xsrfToken,
    // });

    // // If the backend expects a body, send it. Otherwise, keep this as {}
    // const body = {}; // Assuming backend doesn't require extra details

    // this._httpClient.post("/api/logout", body, { headers }).subscribe({
    //   next: (res) => {
    //     console.log("Logout successful", res);
    //     this._authenticated = false;
    //     localStorage.removeItem("accessToken");
    //     localStorage.removeItem("refreshToken");
    //     this.cookieService.deleteAll();
    //     window.location.href = "/sign-in"; // or wherever your login is
    //   },
    //   error: (err) => {
    //     console.error("Logout failed", err);
    //   },
    // });
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {
    if (!this.refreshToken) {
      return of(false);
    }
    if (this._authenticated) return of(true);

    if (!this.accessToken || AuthUtils.isTokenExpired(this.accessToken)) {
      this.signOut();
      return of(false);
    }

    return this._httpClient
      .get<User>(`${environment.apiBaseUrl}/api/account`)
      .pipe(
        tap((user) => {
          this._authenticated = true;
          const formattedUser = {
            ...user,
            name: `${user.firstName} ${user.lastName}`,
            avatar: `https://api.dicebear.com/9.x/shapes/svg?seed=${user.id}`,
          };

          environment.user = formattedUser;
          this._userService.user = formattedUser;

          // this.startTokenRefreshTimer(Number(this.expireTime));
        }),
        mapTo(true),
        catchError(() => {
          this.signOut();
          return of(false);
        })
      );
  }

  private handleLogout(): void {
    clearTimeout(this._refreshTokenTimer);
    this._authenticated = false;
    this.accessToken = null;
    this.refreshToken = null;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    this.cookieService.deleteAll();
    this.cookieService.delete("XSRF-TOKEN");
    this._authenticated = false;
    // this.signOut().subscribe();
  }
}
