import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router, RouterOutlet } from "@angular/router";
import { FuseAlertComponent } from "@fuse/components/alert";
import { FuseFullscreenComponent } from "@fuse/components/fullscreen";
import { FuseLoadingBarComponent } from "@fuse/components/loading-bar";
import {
  FuseNavigationService,
  FuseVerticalNavigationComponent,
} from "@fuse/components/navigation";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { NavigationService } from "app/core/navigation/navigation.service";
import { Navigation } from "app/core/navigation/navigation.types";
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { IClientRegistry } from "app/entities/operationsModuleCooperation/client-registry/client-registry.model";
import { IVehicleRegistry } from "app/entities/operationsModuleCooperation/vehicle-registry/vehicle-registry.model";
import { IUser } from "app/entities/user/user.model";
import { LanguagesComponent } from "app/layout/common/languages/languages.component";
import { MessagesComponent } from "app/layout/common/messages/messages.component";
import { NotificationsComponent } from "app/layout/common/notifications/notifications.component";
import { QuickChatComponent } from "app/layout/common/quick-chat/quick-chat.component";
import { SearchComponent } from "app/layout/common/search/search.component";
import { ShortcutsComponent } from "app/layout/common/shortcuts/shortcuts.component";
import { UserComponent } from "app/layout/common/user/user.component";
import { SelectedCardService } from "app/modules/admin/dashboard/services/selected-card.service";
import { environment } from "environments/environment";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "classy-layout",
  templateUrl: "./classy.component.html",
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FuseLoadingBarComponent,
    FuseVerticalNavigationComponent,
    NotificationsComponent,
    UserComponent,
    MatIconModule,
    MatButtonModule,
    LanguagesComponent,
    FuseFullscreenComponent,
    SearchComponent,
    ShortcutsComponent,
    MessagesComponent,
    RouterOutlet,
    QuickChatComponent,
    FuseAlertComponent,
  ],
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
  isScreenSmall: boolean;
  navigation: Navigation;
  user: User;
  selectedVehicle: IVehicleRegistry;
  selectedClient: IClientRegistry;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _navigationService: NavigationService,
    private _userService: UserService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseNavigationService: FuseNavigationService,
    private _selectedCardService: SelectedCardService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for current year
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._selectedCardService.selectedCard$.subscribe((selected) => {
      //   alert(
      //     "Selected Vehicle: " +
      //       JSON.stringify(selected?.vehicle) +
      //       "\nSelected Client: " +
      //       JSON.stringify(selected?.client)
      //   );
      if (selected) {
        this.selectedVehicle = selected.vehicle;
        this.selectedClient = selected.client;
      } else {
        this.selectedVehicle = null;
        this.selectedClient = null;
      }
    });

    // Subscribe to navigation data
    this._navigationService.navigation$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((navigation: Navigation) => {
        this.navigation = navigation;
      });

    // Subscribe to the user service
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.user = user;
      });

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes("md");
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
   * Toggle navigation
   *
   * @param name
   */
  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation =
      this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
        name
      );

    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
    }
  }

  clearSelectedVehicle(): void {
    this._selectedCardService.clearSelectedCard();
    this.selectedVehicle = null;
    this.selectedClient = null;
  }
}
