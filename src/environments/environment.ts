import { User } from "app/core/user/user.types";
import { IClientRegistry } from "app/entities/operationsModuleCooperation/client-registry/client-registry.model";
import { IVehicleRegistry } from "app/entities/operationsModuleCooperation/vehicle-registry/vehicle-registry.model";

export const environment = {
  user: {} as User,
  selectedCard: {
    vehicle: {} as IVehicleRegistry,
    client: {} as IClientRegistry,
  },
  preEstimateID: "",
  sso: "https://sso.nimeshmotors.lk/realms/jhipster/protocol/openid-connect/token",
  // sso: "http://localhost:9080/realms/jhipster/protocol/openid-connect/token",

  apiBaseUrl: "https://api.nimeshmotors.lk",
  imgUrl: "/services/operationsmodule/api/fileDetails/",
  // apiBaseUrl: "http://localhost:8080",
};
