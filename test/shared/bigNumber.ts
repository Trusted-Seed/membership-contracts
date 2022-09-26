import { BigNumber, BigNumberish } from "ethers";
import bn from "bignumber.js";

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

// BigNumber aliases:
export const BN = BigNumber.from;
export const BNe = (n: BigNumberish, exponent: BigNumberish): BigNumber =>
  BN(n).mul(BN(10).pow(exponent));
export const BNe18 = (n: BigNumberish): BigNumber => BNe(n, 18);

// Big number division/ratio math:
export const divE18 = (n: BigNumber): number => n.div(BNe18("1")).toNumber();
export const ratioE18 = (a: BigNumber, b: BigNumber): string =>
  (divE18(a) / divE18(b)).toFixed(2);

// Sum big numbers:
const bigNumberSum = (arr: BigNumber[]): BigNumber =>
  arr.reduce((acc, item) => acc.add(item), BN("0"));
export const bnSum = bigNumberSum;

export { BigNumber, BigNumberish } from "ethers";
