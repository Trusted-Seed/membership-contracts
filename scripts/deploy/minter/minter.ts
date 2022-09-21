import dotenv from 'dotenv';
import { ethers, network, upgrades } from 'hardhat';
import { log } from '../../utils/logging';
import { promptForConfirmation } from '../../utils/prompt';
import { getDefaultInitParams, getDefaultRatio, MinterRatio } from './minter.config';
import { formatEther } from 'ethers/lib/utils';
import { Contract } from 'ethers';
import { mustMatchAddress, pretty } from '../../utils/utils';

dotenv.config();

const mustMatchRatio = async (minter: Contract, expected: MinterRatio) => {
  log.info('Checking minter ratio');
  const num = await minter.numerator();
  const den = await minter.denominator();

  if (!expected.numerator.eq(num)) {
    throw Error(`Expected numerator to be eq ${expected.numerator}, got ${num}`);
  }
  if (!expected.denominator.eq(den)) {
    throw Error(`Expected denominator to be eq ${expected.denominator}, got ${den}`);
  }
};

async function main() {
  const deployer = (await ethers.getSigners())[0];
  const balanceETH = await deployer.getBalance();

  const params = getDefaultInitParams();
  const ratio = getDefaultRatio();

  log.info('\n');
  log.info('===============================');
  log.info('== Deploying Minter contract ==');
  log.info('===============================');
  log.info('\n');

  log.info(`Deploying to network: ${network.name}`);

  log.info(`\n`);
  log.info('Deploying from address:');
  log.info(`===> ${deployer.address}`);
  log.info(`Balance: ${formatEther(balanceETH)} ETH`);
  log.info(`\n`);

  log.info('Initialization parameters:');
  log.info(pretty(params));
  log.info('\n');

  log.info('Initial ratio:');
  log.info(`numerator: ${ratio.numerator.toString()}`);
  log.info(`denominator: ${ratio.denominator.toString()}`);
  log.info('\n');

  log.info('Contract owner:');
  log.info(`===> ${params.owner}`);
  log.info('\n');

  await promptForConfirmation();
  const minterFactory = await ethers.getContractFactory("Minter");
  const minter = await upgrades.deployProxy(
    minterFactory,
    [params.owner, params.bridge, params.tokenManager, params.registry, params.tokenContract]
  );
  const { deployTransaction } = minter;

  log.info(`Deployment tx hash: ${deployTransaction.hash}`);

  await minter.deployed();

  log.info('\n');
  log.info('Deployment OK');
  log.info('\n');

  log.info('\n');
  log.info('Checking deployed contract state:');
  log.info('\n');

  mustMatchAddress('Owner', params.owner, await minter.owner());
  mustMatchAddress('Bridge', params.bridge, await minter.bridgeAddress());
  mustMatchAddress('TokenManager', params.tokenManager, await minter.tokenManager());
  mustMatchAddress('Registry', params.registry, await minter.registry());
  mustMatchAddress('TokenContract', params.tokenContract, await minter.token());

  log.info('\nSetting initial ratio');
  log.info('====================\n');

  const setRatioTx = await minter.setRatio(ratio.numerator, ratio.denominator);
 
  log.info(`Transaction hash '${setRatioTx.hash}'`);
  log.info('Waiting for confirmations...');

  if (network.name !== 'hardhat') await setRatioTx.wait(2);

  await mustMatchRatio(minter, ratio);

  log.info('\n');
  log.info('Ratio set OK');
  log.info('\n');

  let logic = await upgrades.erc1967.getImplementationAddress(minter.address);
 
  console.log("Minter proxy deployed to:", minter.address);
  console.log("Minter logic deployed to:", logic);
  console.log("Minter admin deployed to:", await upgrades.erc1967.getAdminAddress(minter.address));
 
  log.info('\n');
  log.info('Deployment completed, GM!!');
  log.info('\n');
  log.info('To verify, please run:');
  log.info(`npx hardhat verify --network ${network.name} ${logic}`);
}

main().catch((e) => {
  log.error(e);
  process.exit(1);
});