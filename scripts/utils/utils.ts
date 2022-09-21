import { getAddress, isAddress } from "ethers/lib/utils";
import { ethers } from "hardhat";
const { AddressZero } = ethers.constants;
import { log } from "./logging";

export const pretty = (obj: any) => JSON.stringify(obj, null, 4);

export const mustMatchAddress = (name: string, expected: string, actual: string) => {
  log.info(`Checking ${name} address...`);
  if (getAddress(expected) !== getAddress(actual)) {
    throw Error(`Expected ${name} value ${expected}, got ${actual}`);
  }
};

export const checkAddress = (addr: string) => isAddress(addr) && addr !== AddressZero;
