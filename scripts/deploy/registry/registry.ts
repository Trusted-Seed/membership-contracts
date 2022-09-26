import dotenv from "dotenv";
import { ethers, network, upgrades } from "hardhat";
import { log } from "../../utils/logging";
import { promptForConfirmation } from "../../utils/prompt";
import { getDefaultInitParams, getDefaultOwner } from "./registry.config";
import { formatEther } from "ethers/lib/utils";
import { mustMatchAddress, pretty } from "../../utils/utils";

dotenv.config();

async function main(): Promise<void> {
  const deployer = (await ethers.getSigners())[0];
  const balanceETH = await deployer.getBalance();
  const deployerAddress: string = deployer.address;

  const params = getDefaultInitParams();
  const owner = getDefaultOwner();

  log.info("\n");
  log.info("=================================");
  log.info("== Deploying Registry contract ==");
  log.info("=================================");
  log.info("\n");

  const networkName: string = network.name;

  log.info(`Deploying to network: ${networkName}`);

  log.info("\n");
  log.info("Deploying from address:");
  log.info(`===> ${deployerAddress}`);
  log.info(`Balance: ${formatEther(balanceETH)} ETH`);
  log.info("\n");

  log.info("Initialization parameters:");
  log.info(pretty(params));
  log.info("\n");

  await promptForConfirmation();
  const registryFactory = await ethers.getContractFactory("Registry");
  const registry = await upgrades.deployProxy(registryFactory, [
    params.admins,
    params.tokenContract,
  ]);
  const { deployTransaction } = registry;

  log.info(`Deployment tx hash: ${deployTransaction.hash}`);

  await registry.deployed();

  log.info("\n");
  log.info("Deployment OK");
  log.info("\n");

  const proxyAdminAddress = await upgrades.erc1967.getAdminAddress(
    registry.address
  );
  const logic = await upgrades.erc1967.getImplementationAddress(
    registry.address
  );

  if (owner !== deployer.address) {
    log.info(`Transferring ownership to ${owner}`);
    log.info("\n");

    if (owner !== (await registry.owner())) {
      log.info(`Set Registry owner to ${owner}`);
      const tx = await registry.transferOwnership(owner);
      await tx.wait();
    }

    if (owner !== (await upgrades.erc1967.getAdminAddress(registry.address))) {
      log.info(`Set ProxyAdmin owner to ${owner}`);
      await upgrades.admin.changeProxyAdmin(registry.address, owner);
    }
  }

  log.info("\n");
  log.info("Checking deployed contract state:");
  log.info("\n");

  for (let i = 0; i < params.admins.length; i++) {
    const admin = params.admins[i];
    const isAdmin = Boolean(await registry.isAdmin(admin));
    log.info(`Checking admin address at index ${i}...`);
    if (!isAdmin) {
      throw Error(`Expected isAdmin value ${admin}, is true but got false`);
    }
  }

  mustMatchAddress(
    "Token",
    params.tokenContract,
    await registry.tokenContract()
  );
  mustMatchAddress("RegistryOwner", owner, await registry.owner());
  mustMatchAddress(
    "ProxyAdminOwner",
    owner,
    await upgrades.erc1967.getAdminAddress(registry.address)
  );

  log.info("\n");
  log.info("Registry proxy deployed to:", registry.address);
  log.info("Registry logic deployed to:", logic);
  log.info("Registry admin deployed to:", proxyAdminAddress);

  log.info("\n");
  log.info("Deployment completed, GM!!");
  log.info("\n");
  log.info("To verify, please run:");
  log.info(`npx hardhat verify --network ${network.name} ${logic}`);
}

main().catch((e) => {
  log.error(e);
  process.exit(1);
});
