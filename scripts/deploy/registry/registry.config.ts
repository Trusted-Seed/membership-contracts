import { checkAddress } from '../../utils/utils';

type RegistryInit = {
  admins: string[];
  tokenContract: string;
}

// ================ CHANGE THESE VALUES ================

// owner of registry and admin contract (and therefore of proxy)
const DEFAULT_OWNER = '0x1234';

export const DEFAULT_PARAMS: RegistryInit = {
  admins: [
    '0x1234',
    '0x1234',
  ],
  tokenContract: '0x1234',
};

// ================ /CHANGE THESE VALUES ================

export const checkInitParams = (p: RegistryInit) => {
    p.admins.forEach((a, index) => {
        if (!checkAddress(a)) {
            throw new Error(`Admin address ${a} at index ${index} is invalid`);
        }
    });
    if (!checkAddress(p.tokenContract)) {
      throw new Error('TokenContract address invalid');
    }
}

export const getDefaultInitParams = () => {
  checkInitParams(DEFAULT_PARAMS);
  return DEFAULT_PARAMS;
};

export const getDefaultOwner = () => {
  if (!checkAddress(DEFAULT_OWNER)) {
    throw new Error('Owner address invalid');
  }
  return DEFAULT_OWNER;
}