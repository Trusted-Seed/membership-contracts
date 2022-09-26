import { BigNumber } from "ethers";
import { checkAddress } from "../../utils/utils";

interface MinterInit {
  owner: string;
  bridge: string;
  tokenManager: string;
  registry: string;
  tokenContract: string;
}

export interface MinterRatio {
  numerator: BigNumber;
  denominator: BigNumber;
}

// ================ CHANGE THESE VALUES ================

// owner of minter and admin contract (and therefore of proxy)
const DEFAULT_OWNER = "0x000000000000000000000000000000000000dEaD";

export const DEFAULT_PARAMS: MinterInit = {
  owner: DEFAULT_OWNER,
  bridge: "0x000000000000000000000000000000000000dEaD",
  tokenManager: "0x000000000000000000000000000000000000dEaD",
  registry: "0x000000000000000000000000000000000000dEaD",
  tokenContract: "0x000000000000000000000000000000000000dEaD",
};

export const DEFAULT_RATIO: MinterRatio = {
  numerator: BigNumber.from("5"),
  denominator: BigNumber.from("2000000000000000000"),
};

// ================ /CHANGE THESE VALUES ================

export const checkInitParams = (p: MinterInit): void => {
  if (!checkAddress(p.owner)) {
    throw new Error("Owner address invalid");
  }
  if (!checkAddress(p.bridge)) {
    throw new Error("Bridge address invalid");
  }
  if (!checkAddress(p.tokenManager)) {
    throw new Error("TokenManager address invalid");
  }
  if (!checkAddress(p.registry)) {
    throw new Error("Registry address invalid");
  }
  if (!checkAddress(p.tokenContract)) {
    throw new Error("TokenContract address invalid");
  }
};

export const checkRatio = (ratio: MinterRatio): void => {
  if (!ratio.numerator.gt("0")) {
    throw new Error("Invalid numerator");
  }
  if (!ratio.denominator.gt("0")) {
    throw new Error("Invalid denominator");
  }
};

export const getDefaultInitParams = (): MinterInit => {
  checkInitParams(DEFAULT_PARAMS);
  return DEFAULT_PARAMS;
};

export const getDefaultRatio = (): MinterRatio => {
  checkRatio(DEFAULT_RATIO);
  return DEFAULT_RATIO;
};

export const getDefaultOwner = (): string => {
  if (!checkAddress(DEFAULT_OWNER)) {
    throw new Error("Owner address invalid");
  }
  return DEFAULT_OWNER;
};
