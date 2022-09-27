import { Wallet } from "ethers";

export const toAddr = (_account: Wallet | string): string =>
  typeof _account === "string" ? _account : _account.address;
