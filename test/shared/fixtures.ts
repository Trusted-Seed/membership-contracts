import { BigNumberish } from 'ethers';
import { ethers, waffle } from 'hardhat';
import { Fixture } from 'ethereum-waffle';

import {
  AdminRoleMock,
  Registry,
  AdminRoleMock__factory,
  ERC20Mock__factory,
  MintableMock__factory,
  Registry__factory,
  IERC20Upgradeable,
  NoopMinterMock__factory,
  IMintable,
  IMinter,
  ERC20Mock,
} from '../../typechain-types';

import { ActorFixture } from './actors';
import { provider } from './provider';
import { toAddr } from './toAddr';

const { parseEther } = ethers.utils;

const { abi: AdminRoleMockABI, bytecode: AdminRoleMockBytecode } = AdminRoleMock__factory;
const { abi: RegistryABI, bytecode: RegistryBytecode } = Registry__factory;
const { abi: MintableMockABI, bytecode: MintableMockBytecode } = MintableMock__factory;
const { abi: ERC20MockABI, bytecode: ERC20MockBytecode } = ERC20Mock__factory;
const { abi: MinterMockABI, bytecode: MinterMockBytecode } = NoopMinterMock__factory;

export type AdminRoleMockFixture = {
  adminRole: AdminRoleMock;
  admins: string[];
};

export const adminRoleMockFixture: Fixture<AdminRoleMockFixture> = async ([wallet]) => {
  const actors = new ActorFixture(provider.getWallets(), provider);
  const admins = [actors.adminFirst().address, actors.adminSecond().address];
  const adminRole = (await waffle.deployContract(
    wallet,
    {
      bytecode: AdminRoleMockBytecode,
      abi: AdminRoleMockABI,
    }
  )) as AdminRoleMock;

  await adminRole.initialize(admins);
  return {
    adminRole,
    admins,
  };
};

export type TokenFixture = {
  token: ERC20Mock;
  params: {
    amountToMint: BigNumberish;
  };
  state: {
    totalSupply: BigNumberish;
  };
};

export const tokenFixture: Fixture<TokenFixture> = async ([wallet]) => {
  const amountToMint = parseEther('100000000'); // 100B
  const token = (await waffle.deployContract(
    wallet,
    {
      bytecode: ERC20MockBytecode,
      abi: ERC20MockABI,
    },
  )) as ERC20Mock;
    await token.initialize(amountToMint);
  return {
    token,
    params: {
      amountToMint,
    },
    state: {
      totalSupply: amountToMint,
    },
  };
};

export type Contributor = {
  account: string;
  maxTrust: BigNumberish;
  balance: BigNumberish;
};

export type RegistryFixture = {
  registry: Registry;
  token: IERC20Upgradeable;
  params: {
    admins: string[];
    tokenAddress: string;
  };
  state: {
    pendingContributors: Contributor[];
    contributors: Contributor[];
    everyone: Contributor[];
  };
};

export const registryFixture: Fixture<RegistryFixture> = async ([wallet]) => {
  const registerContributors = async (_contributors: Contributor[], _registry: Registry) => {
    await _registry.connect(actors.adminFirst()).registerContributors(_contributors);
  };
  const actors = new ActorFixture(provider.getWallets(), provider);
  const admins = [actors.adminFirst().address, actors.adminSecond().address];

  const { token } = await tokenFixture([wallet], provider);

  const registry = (await waffle.deployContract(
    wallet,
    {
      bytecode: RegistryBytecode,
      abi: RegistryABI,
    }
  )) as Registry;

  await registry.initialize(admins, token.address);

  const contributors = <Contributor[]>[
    {
      account: toAddr(actors.contributorFirst()),
      maxTrust: '1000',
      balance: '0',
    },
    {
      account: toAddr(actors.contributorSecond()),
      maxTrust: '2000',
      balance: '0',
    },
  ];
  await registerContributors(contributors, registry);

  const pendingContributors = <Contributor[]>[
    {
      account: toAddr(actors.pendingContributorFirst()),
      maxTrust: '1000',
      balance: '1000',
    },
    {
      account: toAddr(actors.pendingContributorSecond()),
      maxTrust: '2000',
      balance: '2000',
    },
  ];
  await registerContributors(pendingContributors, registry);

  const everyone = contributors.concat(pendingContributors);

  return {
    registry,
    token,
    params: {
      admins,
      tokenAddress: token.address,
    },
    state: {
      contributors,
      pendingContributors,
      everyone,
    },
  };
};

export type MinterFixture = {
  minter: IMinter;
  token: IERC20Upgradeable;
  tokenManager: IMintable;
  params: {
    owner: string;
    bridge: string;
    tokenManagerAddress: string;
    registryAddress: string;
    tokenAddress: string;
  };
  state: {
    numerator: BigNumberish;
    denominator: BigNumberish;
  };
};

export const minterFixture: Fixture<MinterFixture> = async ([wallet]) => {
  const actors = new ActorFixture(provider.getWallets(), provider);
  const owner = actors.adminFirst();
  const bridge = actors.adminSecond();

  const { registry, token } = await registryFixture([wallet], provider);

  const tokenManager = (await waffle.deployContract(wallet, {
    abi: MintableMockABI,
    bytecode: MintableMockBytecode,
  })) as IMintable;

  const minter = (await waffle.deployContract(
    wallet,
    {
      abi: MinterMockABI,
      bytecode: MinterMockBytecode,
    },
    [owner.address, bridge.address, tokenManager.address, registry.address, token.address]
  )) as IMinter;

  const numerator = 500;
  const denominator = 1000;
  await minter.connect(owner).setRatio(numerator, denominator);
  
  const membershupDues = parseEther('450');
  await minter.connect(owner).setMembershipDues(membershupDues);

  return {
    minter,
    token,
    tokenManager: tokenManager,
    params: {
      owner: owner.address,
      bridge: bridge.address,
      tokenManagerAddress: tokenManager.address,
      registryAddress: registry.address,
      tokenAddress: token.address,
    },
    state: {
      numerator,
      denominator,
    },
  };
};
