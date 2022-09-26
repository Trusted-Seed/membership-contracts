import { HardhatUserConfig } from "hardhat/config";
import { SolcUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";
import "hardhat-contract-sizer";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";
import dotenv from "dotenv";

dotenv.config();

const deployKey = process.env.DEPLOYER_PRIVATE_KEY ?? "0x";
const infuraKey = process.env.INFURA_KEY ?? "abc";

const COMPILER_SETTINGS: SolcUserConfig = {
  version: "0.8.13",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false, // NOTE: you may need to turn this off!
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${infuraKey}`,
      accounts: [`${deployKey}`],
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${infuraKey}`,
      accounts: [`${deployKey}`],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infuraKey}`,
      accounts: [`${deployKey}`],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${infuraKey}`,
      accounts: [`${deployKey}`],
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${infuraKey}`,
      accounts: [`${deployKey}`],
    },
    arbitrumRinkeby: {
      url: `https://arbitrum-rinkeby.infura.io/v3/${infuraKey}`,
      accounts: [`${deployKey}`],
    },
    arbitrum: {
      url: `https://arbitrum-mainnet.infura.io/v3/${infuraKey}`,
      accounts: [`${deployKey}`],
    },
    optimismKovan: {
      url: `https://optimism-kovan.infura.io/v3/${infuraKey}`,
      accounts: [`${deployKey}`],
    },
    optimism: {
      url: `https://optimism-mainnet.infura.io/v3/${infuraKey}`,
      accounts: [`${deployKey}`],
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${infuraKey}`,
      accounts: [`${deployKey}`],
    },
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${infuraKey}`,
      accounts: [`${deployKey}`],
    },
    gnosis: {
      url: "https://rpc.gnosischain.com/",
      accounts: [`${deployKey}`],
    },
  },
  solidity: {
    compilers: [COMPILER_SETTINGS],
  },
  contractSizer: {
    alphaSort: false,
    disambiguatePaths: true,
    runOnCompile: false,
  },
};

if (process.env.ETHERSCAN_API_KEY) {
  config.etherscan = {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY ?? "",
  };
}

export default config;
