import dotenv from 'dotenv';
import { ethers, network, upgrades } from 'hardhat';
import { log } from '../../utils/logging';
import { promptForConfirmation } from '../../utils/prompt';
import { getDefaultInitParams, getDefaultOwner, getDefaultRatio, MinterRatio } from './minter.config';
import { formatEther, isAddress } from 'ethers/lib/utils';
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
  const owner = getDefaultOwner();

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
    [deployer.address, params.bridge, params.tokenManager, params.registry, params.tokenContract]
  );
  const { deployTransaction } = minter;

  log.info(`Deployment tx hash: ${deployTransaction.hash}`);

  await minter.deployed();

  log.info('\n');
  log.info('Deployment OK');
  log.info('\n');

  log.info('\nSetting initial ratio');
  log.info('=====================\n');

  const setRatioTx = await minter.setRatio(ratio.numerator, ratio.denominator);

  log.info(`Transaction hash '${setRatioTx.hash}'`);
  log.info('Waiting for confirmations...');

  if (network.name !== 'hardhat') await setRatioTx.wait(2);

  log.info('\n');
  log.info('Ratio set');
  log.info('\n');

  const proxyAdminAddress = await upgrades.erc1967.getAdminAddress(minter.address);
  const logic = await upgrades.erc1967.getImplementationAddress(minter.address);

  if (owner !== deployer.address) {
    log.info(`Transferring ownership to ${owner}`);
    log.info('\n');

    if (owner !== (await minter.owner())) {
      log.info(`Set Minter owner to ${owner}`);
      let tx = await minter.transferOwnership(owner);
      await tx.wait();
    }

    if (owner !== (await upgrades.erc1967.getAdminAddress(minter.address))) {
      log.info(`Set ProxyAdmin owner to ${owner}`);
      await upgrades.admin.changeProxyAdmin(minter.address, owner);
    }
  }

  log.info('\n');
  log.info('Checking deployed contract state:');
  log.info('\n');

  await mustMatchRatio(minter, ratio);

  mustMatchAddress('Owner', params.owner, await minter.owner());
  mustMatchAddress('Bridge', params.bridge, await minter.bridgeAddress());
  mustMatchAddress('TokenManager', params.tokenManager, await minter.tokenManager());
  mustMatchAddress('Registry', params.registry, await minter.registry());
  mustMatchAddress('TokenContract', params.tokenContract, await minter.token());

  mustMatchAddress('MinterOwner', owner, await minter.owner());
  mustMatchAddress('ProxyAdminOwner', owner, await upgrades.erc1967.getAdminAddress(minter.address));

  log.info('\n');
  log.info("Minter proxy deployed to:", minter.address);
  log.info("Minter logic deployed to:", logic);
  log.info("Minter admin deployed to:", proxyAdminAddress);

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