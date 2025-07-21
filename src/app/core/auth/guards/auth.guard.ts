import { inject } from "@angular/core";
import { CanActivateChildFn, CanActivateFn, Router } from "@angular/router";
import { AuthService } from "app/core/auth/auth.service";
import { of, switchMap } from "rxjs";
import { CookieService } from "ngx-cookie-service";

// import { KeycloakService } from "../keycloak.service";

// export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
//   const router: Router = inject(Router);
//   const keycloak = inject(KeycloakService);

//   if (keycloak.isAuthenticated()) {
//     return of(true);
//   } else {
//     keycloak.login();
//     return of(false);
//   }

//   // Check the authentication status
//   // return inject(AuthService)
//   //     .check()
//   //     .pipe(
//   //         switchMap((authenticated) => {
//   //             // If the user is not authenticated...
//   //             if (!authenticated) {
//   //                 // Redirect to the sign-in page with a redirectUrl param
//   //                 const redirectURL =
//   //                     state.url === '/sign-out'
//   //                         ? ''
//   //                         : `redirectURL=${state.url}`;
//   //                 const urlTree = router.parseUrl(`sign-in?${redirectURL}`);

//   //                 return of(urlTree);
//   //             }

//   //             // Allow the access
//   //             return of(true);
//   //         })
//   //     );
// };
export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  const router: Router = inject(Router);
  const cookieService = inject(CookieService);
  // Check the authentication status
  return inject(AuthService)
    .check()
    .pipe(
      switchMap((authenticated) => {
        // If the user is not authenticated...
        if (!authenticated) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          cookieService.deleteAll();
          cookieService.delete("XSRF-TOKEN");
          // Redirect to the sign-in page with a redirectUrl param
          const redirectURL =
            state.url === "/sign-out" ? "" : `redirectURL=${state.url}`;
          const urlTree = router.parseUrl(`sign-in?${redirectURL}`);

          return of(urlTree);
        }

        // Allow the access
        return of(true);
      })
    );
};
