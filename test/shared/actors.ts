import { MockProvider } from 'ethereum-waffle'
import { Wallet } from 'ethers'

// User indexes:
export const WALLET_USER_INDEXES = {
  OWNER: 0,
  TOKEN_MANAGER: 1,
  ADMIN_FIRST: 2,
  ADMIN_SECOND: 3,
  ADMIN_THIRD: 4,
  ADMIN_FOURTH: 5,
  MEMEBER_FIRST: 6,
  MEMEBER_SECOND: 7,
  PENDING_MEMBER_FIRST: 8,
  PENDING_MEMBER_SECOND: 9,
  DRAIN_VAULT_RECEIVER: 0,
  ESCAPE_HATCH_CALLER: 0,
  ESCAPE_HATCH_DESTINATION: 0,
  OTHER: 10
}

export class ActorFixture {
  wallets: Wallet[]
  provider: MockProvider

  constructor (wallets: Wallet[], provider: MockProvider) {
    this.wallets = wallets
    this.provider = provider
  }

  owner (): Wallet {
    return this._getActor(WALLET_USER_INDEXES.OWNER)
  }

  tokenManager (): Wallet {
    return this._getActor(WALLET_USER_INDEXES.TOKEN_MANAGER)
  }

  deployer (): Wallet {
    return this.owner()
  }

  adminFirst (): Wallet {
    return this._getActor(WALLET_USER_INDEXES.ADMIN_FIRST)
  }

  adminSecond (): Wallet {
    return this._getActor(WALLET_USER_INDEXES.ADMIN_SECOND)
  }

  adminThird (): Wallet {
    return this._getActor(WALLET_USER_INDEXES.ADMIN_THIRD)
  }

  adminFourth (): Wallet {
    return this._getActor(WALLET_USER_INDEXES.ADMIN_FOURTH)
  }

  contributorFirst (): Wallet {
    return this._getActor(WALLET_USER_INDEXES.MEMEBER_FIRST)
  }

  contributorSecond (): Wallet {
    return this._getActor(WALLET_USER_INDEXES.MEMEBER_SECOND)
  }

  contributors (): Wallet[] {
    return [this.contributorFirst(), this.contributorSecond()]
  }

  pendingContributorFirst (): Wallet {
    return this._getActor(WALLET_USER_INDEXES.PENDING_MEMBER_FIRST)
  }

  pendingContributorSecond (): Wallet {
    return this._getActor(WALLET_USER_INDEXES.PENDING_MEMBER_SECOND)
  }

  pendingContributors (): Wallet[] {
    return [this.pendingContributorFirst(), this.pendingContributorSecond()]
  }

  drainVaultReceiver (): Wallet {
    return this._getActor(WALLET_USER_INDEXES.DRAIN_VAULT_RECEIVER)
  }

  escapeHatchCaller (): Wallet {
    return this._getActor(WALLET_USER_INDEXES.ESCAPE_HATCH_CALLER)
  }

  escapeHatchDestination (): Wallet {
    return this._getActor(WALLET_USER_INDEXES.ESCAPE_HATCH_DESTINATION)
  }

  other (): Wallet {
    return this._getActor(WALLET_USER_INDEXES.OTHER)
  }

  anyone (): Wallet {
    return this.other()
  }

  others (cnt: number): Wallet[] {
    if (cnt < 0) {
      throw new Error(`Invalid cnt: ${cnt}`)
    }
    return this.wallets.slice(WALLET_USER_INDEXES.OTHER, WALLET_USER_INDEXES.OTHER + cnt)
  }

  // Actual logic of fetching the wallet
  private _getActor (index: number): Wallet {
    if (index < 0) {
      throw new Error(`Invalid index: ${index}`)
    }
    const account = this.wallets[index]
    if (!account) {
      throw new Error(`Account ID ${index} could not be loaded`)
    }
    return account
  }
}
