import { Injectable } from "@angular/core";
import { IClientRegistry } from "app/entities/operationsModuleCooperation/client-registry/client-registry.model";
import { IVehicleRegistry } from "app/entities/operationsModuleCooperation/vehicle-registry/vehicle-registry.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SelectedCardService {
  constructor() {}

  private selectedCardSubject = new BehaviorSubject<{
    vehicle: IVehicleRegistry;
    client: IClientRegistry;
  } | null>(null);

  selectedCard$ = this.selectedCardSubject.asObservable();

  setSelectedCard(vehicle: IVehicleRegistry, client: IClientRegistry): void {
    this.selectedCardSubject.next({ vehicle, client });
  }

  clearSelectedCard(): void {
    this.selectedCardSubject.next(null);
  }
}
