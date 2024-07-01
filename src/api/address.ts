import { Address } from "./types/address";

const factory = (): Address => {
    return {
      address: "",
      address2: "",
      region: "",
      zipcode: "",
      countryId: -1
    };
}

export const address = { factory };