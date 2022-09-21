import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

const { AddressZero } = ethers.constants;
const { isAddress } = ethers.utils;

type MinterInit = {
  owner: string;
  bridge: string;
  tokenManager: string;
  registry: string;
  tokenContract: string;
}

export const DEFAULT_PARAMS: MinterInit = {
  owner: '0x185880E979FDEbFa1fab7e281510A01417681d55',
  bridge: '0x185880E979FDEbFa1fab7e281510A01417681d55',
  tokenManager: '0x185880E979FDEbFa1fab7e281510A01417681d55',
  registry: '0x185880E979FDEbFa1fab7e281510A01417681d55',
  tokenContract: '0x185880E979FDEbFa1fab7e281510A01417681d55',
};

export type MinterRatio = {
  numerator: BigNumber;
  denominator: BigNumber;
};

export const DEFAULT_RATIO = {
  numerator: BigNumber.from('5'),
  denominator: BigNumber.from('2000000000000000000'),
};

const checkAddress = (addr: string) => isAddress(addr) && addr !== AddressZero;

export const checkInitParams = (p: MinterInit) => {
  if (!checkAddress(p.owner)) {
    throw new Error('Owner address invalid');
  }
  if (!checkAddress(p.bridge)) {
    throw new Error('Bridge address invalid');
  }
  if (!checkAddress(p.tokenManager)) {
    throw new Error('TokenManager address invalid');
  }
  if (!checkAddress(p.registry)) {
    throw new Error('Registry address invalid');
  }
  if (!checkAddress(p.tokenContract)) {
    throw new Error('TokenContract address invalid');
  }
};

export const checkRatio = (ratio: MinterRatio) => {
  if (!ratio.numerator.gt('0')) {
    throw new Error('Invalid numerator');
  }
  if (!ratio.denominator.gt('0')) {
    throw new Error('Invalid denominator');
  }
};

export const getDefaultInitParams = () => {
  checkInitParams(DEFAULT_PARAMS);
  return DEFAULT_PARAMS;
};

export const getDefaultRatio = () => {
  checkRatio(DEFAULT_RATIO);
  return DEFAULT_RATIO;
};
