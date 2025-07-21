import { BooleanInput } from "@angular/cdk/coercion";
import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { Router } from "@angular/router";
import { AuthService } from "app/core/auth/auth.service";
// import { KeycloakService } from 'app/core/auth/keycloak.service';
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { Logout } from "app/login/logout.model";
import Keycloak from "keycloak-js";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "user",
  templateUrl: "./user.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: "user",
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    NgClass,
    MatDividerModule,
  ],
})
export class UserComponent implements OnInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_showAvatar: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() showAvatar: boolean = true;
  user: User;

  // keycloakService=inject(KeycloakService)

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _userService: UserService
    // private _authService:
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to user changes
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.user = user;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Update the user status
   *
   * @param status
   */
  updateUserStatus(status: string): void {
    // Return if user is not available
    if (!this.user) {
      return;
    }

    // Update the user
    this._userService
      .update({
        ...this.user,
        status,
      })
      .subscribe();
  }

  private _authService = inject(AuthService);

  /**
   * Sign out
   */
  //   signOut(): void {
  //     this._authService.signOut();
  //     // this.keycloakService.logout();
  //     // this._router.navigate(['/sign-out']);
  //   }

  signOut(): void {
    // alert("Helloooooo");
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");
    // localStorage.removeItem("user");
    // sessionStorage.clear();
    // window.location.href = "/sign-in";
    this._router.navigate(["/sign-out"]);
    // this._authService.signOut().subscribe((logout: Logout) => {
    //   window.location.href = logout.logoutUrl;
    //   //   this._router.navigate(["/sign-in"]);
    // });
  }
}
