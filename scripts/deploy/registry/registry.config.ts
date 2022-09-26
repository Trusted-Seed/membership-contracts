import { checkAddress } from '../../utils/utils'

interface RegistryInit {
  admins: string[]
  tokenContract: string
}

// ================ CHANGE THESE VALUES ================

// owner of registry and admin contract (and therefore of proxy)
const DEFAULT_OWNER = '0x000000000000000000000000000000000000dEaD'

export const DEFAULT_PARAMS: RegistryInit = {
  admins: [
    '0x000000000000000000000000000000000000dEaD',
    '0x000000000000000000000000000000000000dEaD'
  ],
  tokenContract: '0x000000000000000000000000000000000000dEaD'
}

// ================ /CHANGE THESE VALUES ================

export const checkInitParams = (p: RegistryInit): void => {
  p.admins.forEach((a, index) => {
    if (!checkAddress(a)) {
      throw new Error(`Admin address ${a} at index ${index} is invalid`)
    }
  })
  if (!checkAddress(p.tokenContract)) {
    throw new Error('TokenContract address invalid')
  }
}

export const getDefaultInitParams = (): RegistryInit => {
  checkInitParams(DEFAULT_PARAMS)
  return DEFAULT_PARAMS
}

export const getDefaultOwner = (): string => {
  if (!checkAddress(DEFAULT_OWNER)) {
    throw new Error('Owner address invalid')
  }
  return DEFAULT_OWNER
}
