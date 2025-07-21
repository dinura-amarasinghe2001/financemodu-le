import { inject, Injectable } from "@angular/core";
import Keycloak from "keycloak-js";
import { UserService } from "app/core/user/user.service";

@Injectable({ providedIn: "root" })
export class KeycloakService {
  // private keycloak: Keycloak;
  // private _userService = inject(UserService);

  // constructor() {
  //   this.keycloak = new Keycloak({
  //     url: "http://localhost:9080",
  //     realm: "jhipster",
  //     clientId: "macmi-nimeshMotors",
  //   });
    
  // }

  // async init(): Promise<boolean> {
  //   const authenticated = await this.keycloak
  //     .init({
  //       onLoad: "login-required",
  //       checkLoginIframe: false,
  //     });
  //   console.log("[Keycloak] Authenticated:", authenticated);
  //   if (authenticated) {
  //     const token = this.keycloak.tokenParsed;
  //     const user = {
  //       id: token?.sub,
  //       name: token?.name,
  //       email: token?.email,
  //       avatar: `https://api.dicebear.com/9.x/bottts/svg?seed=${token?.name}`,
  //     };

  //     // this._userService.user = user;
  //   }
  //   return authenticated;
  // }

  // login(): void {
  //   this.keycloak.login();
  // }

  // logout(): void {
  //   this.keycloak.logout();
  // }

  // getToken(): string {
  //   return this.keycloak.token || "";
  // }

  // isAuthenticated(): boolean {
  //   return !!this.keycloak.token;
  // }

  // getUsername(): string {
  //   return this.keycloak.tokenParsed?.preferred_username ?? "";
  // }
}
