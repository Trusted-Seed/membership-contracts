import { getAddress, isAddress } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { log } from './logging'
const { AddressZero } = ethers.constants

export const pretty = (obj: any): any => JSON.stringify(obj, null, 4)

export const mustMatchAddress = (name: string, expected: string, actual: string): void => {
  log.info(`Checking ${name} address...`)
  if (getAddress(expected) !== getAddress(actual)) {
    throw Error(`Expected ${name} value ${expected}, got ${actual}`)
  }
}

export const checkAddress = (addr: string): boolean => isAddress(addr) && addr !== AddressZero
