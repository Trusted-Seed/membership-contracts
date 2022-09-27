# Membership Contracts
Solidity contracts to manage the Trusted Seed membership.

# Table of Content

- [Membership Contracts](#membership-contracts)
- [Table of Content](#table-of-content)
  - [Installation](#installation)
    - [Setting up](#setting-up)
    - [Dependencies](#dependencies)
    - [Compile contracts](#compile-contracts)
  - [Testing and auditing](#testing-and-auditing)
    - [Local tests](#local-tests)
    - [Coverage report](#coverage-report)
    - [Contract sizes](#contract-sizes)
  - [Deploying](#deploying)
    - [Before deploying](#before-deploying)
    - [Deployment](#deployment)
    - [Upgrade](#upgrade)

## Installation

### Setting up
You can create a `.env` file in the root directory. Please use the `.env.example` as template.
You *should* set the `INFURA_API_KEY` env variable to a valid Infura API key.

### Dependencies
Run `yarn install` to install all needed dependencies.

### Compile contracts
Run `yarn compile` to compile contracts using Hardhat 👷

## Testing and auditing

### Local tests

Run `yarn test` to run the full test suite.

### Coverage report

Run `yarn coverage` to generate a code coverage report using `hardhat coverage`

### Contract sizes

Run `yarn size-contracts` to compute the size of each compiled contract.

## Deploying
Note: When using the deploy scripts, in addition to the actual contracts, a proxy contract and an admin contract to manage the proxy are deployed.

### Before deploying
Before deploying, you **MUST** set the `DEPLOYER_PRIVATE_KEY` to the private key of the account you want to deploy from.

Please make sure to specify the correct deployment parameters in `./scripts/deploy/minter/minter.config.ts` and `./scripts/deploy/registry/registry.config.ts`.

### Deployment
You can deploy to the appropriate network by running the `yarn deploy:<contract>:<network>` command.

Please make sure to confirm all parameters before confirming via interactive prompt!

Available contracts:
- `minter`
- `registry`

Available networks:
- `void` - dry run against a local Hardhat instance
- `goerli` - testnet
- `gnosis` - mainnet on Gnosis chain

Examples:
`yarn deploy:registry:goerli`
`yarn deploy:minter:goerli`

### Upgrade
The deploy scripts are using [hardhat-upgrades](https://docs.openzeppelin.com/upgrades-plugins/1.x/hardhat-upgrades) for the deployment. 
Please do not delete the content of **.openzeppelin**. 
Please follow the steps of openzeppelin to securely update the contracts in future.