import { expect } from 'chai'
import { constants, Wallet } from 'ethers'
import { ActorFixture, BurnAddress, createFixtureLoader, provider, registryFixture, RegistryFixture, Contributor } from '../shared'
import { LoadFixtureFunction } from '../types'

const { AddressZero } = constants

let loadFixture: LoadFixtureFunction

describe('unit/Registry', () => {
  const actors = new ActorFixture(provider.getWallets(), provider)
  let context: RegistryFixture

  before('loader', async () => {
    loadFixture = createFixtureLoader(provider.getWallets(), provider)
  })

  beforeEach('create fixture loader', async () => {
    context = await loadFixture(registryFixture)
  })

  describe('#registerContributor', () => {
    const testContributor: Contributor = {
      account: actors.anyone().address,
      maxTrust: 1000,
      balance: 1000
    }
    let subject: (
      _contributor: Contributor,
      _sender: Wallet
    ) => Promise<any>
    let check: (_address: Wallet | string) => Promise<any>

    beforeEach(() => {
      subject = async (_contributor: Contributor, _sender: Wallet) =>
        await context.registry
          .connect(_sender)
          .registerContributor(_contributor)
      check = async (_addr: Wallet | string) =>
        await context.registry.getMaxTrust(typeof _addr === 'string' ? _addr : _addr.address)
    })

    describe('works and', () => {
      it('emits the contributor added event', async () => {
        await expect(subject(testContributor, actors.adminFirst()))
          .to.emit(context.registry, 'ContributorAdded')
          .withArgs(actors.anyone().address)
      })

      it('sets the max trust of the contributor', async () => {
        await subject(testContributor, actors.adminFirst())
        expect(await check(actors.anyone())).to.be.eq(1000)
      })
    })

    describe('fails when', () => {
      it('not called by an admin', async () => {
        await expect(subject(testContributor, actors.anyone())).to.be.reverted
      })

      it('trying to register address zero', async () => {
        await expect(subject({ account: AddressZero, maxTrust: 1000, balance: 1000 }, actors.adminFirst())).to.be.reverted
      })

      it('trying to set max trust to zero', async () => {
        await expect(subject({ account: actors.anyone().address, maxTrust: 0, balance: 1000 }, actors.adminFirst())).to.be.reverted
      })

      it('trying to register an existing contributor', async () => {
        const existing = context.state.contributors[0].account
        await expect(subject({ account: existing, maxTrust: 1000, balance: 1000 }, actors.adminFirst())).to.be.reverted
      })
    })
  })

  describe('#removeContributor', () => {
    let subject: (_addr: Wallet | string, _sender: Wallet) => Promise<any>
    let check: (_addr: Wallet | string) => Promise<any>

    beforeEach(() => {
      subject = async (_addr: Wallet | string, _sender: Wallet) =>
        await context.registry.connect(_sender).removeContributor(typeof _addr === 'string' ? _addr : _addr.address)
      check = async (_addr: Wallet | string) =>
        await context.registry.getMaxTrust(typeof _addr === 'string' ? _addr : _addr.address)
    })

    describe('works and', () => {
      it('emits the contributor removed event', async () => {
        await expect(subject(actors.contributorFirst(), actors.adminFirst()))
          .to.emit(context.registry, 'ContributorRemoved')
          .withArgs(actors.contributorFirst().address)
      })

      it('sets the maxTrust to zero', async () => {
        await expect(subject(actors.contributorFirst(), actors.adminFirst()))
        expect(await check(actors.contributorFirst())).to.be.eq(1000)
      })
    })

    describe('fails when', () => {
      it('not called by an admin', async () => {
        await expect(subject(actors.anyone(), actors.other())).to.be.reverted
      })

      it('trying to remove address zero', async () => {
        await expect(subject(AddressZero, actors.adminFirst())).to.be.reverted
      })

      it('trying to remove a non-contributor', async () => {
        await expect(subject(actors.anyone(), actors.adminFirst())).to.be.reverted
      })
    })
  })

  describe('#registerContributors', () => {
    let subject: (
      _contributors: Contributor[],
      _sender: Wallet
    ) => Promise<any>
    let check: (_account: string) => Promise<any>

    const contributors: Contributor[] = []

    before(() => {
      subject = async (
        _contributors: Contributor[],
        _sender: Wallet
      ) => await context.registry.connect(_sender).registerContributors(_contributors)

      check = async (_account: string) => await context.registry.getMaxTrust(_account)

      actors.others(2).map((c, index) => (
        contributors.push({
          account: c.address,
          maxTrust: 1000 * (index + 1),
          balance: 1000 * (index + 1)
        })
      ))
    })

    describe('works and', () => {
      it('registers contributors', async () => {
        await subject(contributors, actors.adminFirst())
        expect(await check(contributors[0].account)).to.be.eq('1000')
        expect(await check(contributors[1].account)).to.be.eq('2000')
      })
    })

    describe('fails when', () => {
      it('not called by an admin address', async () => {
        await expect(subject(contributors, actors.anyone())).to.be.reverted
      })
    })
  })

  describe('#getContributors', () => {
    let subject: () => Promise<string[]>

    beforeEach(() => {
      subject = async () => await context.registry.getContributors()
    })

    describe('works and', () => {
      it('returns all contributors', async () => {
        expect(await subject()).to.have.same.members(context.state.everyone.map((c) => c.account))
      })
    })
  })

  describe('#getContributorInfo', () => {
    let subject: () => Promise<any>

    beforeEach(() => {
      subject = async () => await context.registry.getContributorInfo()
    })

    describe('works and', () => {
      it('returns info for all contributors', async () => {
        const res = await subject()

        const normalized: Contributor[] = []

        res.map((r: any) => (
          normalized.push({
            account: r.account,
            maxTrust: r.maxTrust.toString(),
            balance: r.balance.toString()
          })
        ))

        expect(normalized).to.eql(context.state.everyone)
      })
    })
  })

  describe('#getMaxTrust', () => {
    let subject: (_address: Wallet | string) => Promise<any>

    beforeEach(() => {
      subject = async (_address: Wallet | string) =>
        await context.registry.getMaxTrust(typeof _address === 'string' ? _address : _address.address)
    })

    describe('works and', () => {
      it('returns max trust for a registered contributor', async () => {
        for (const c of context.state.contributors) {
          expect(await subject(c.account)).to.be.eq(c.maxTrust)
        }
      })
    })
  })

  describe('#getPendingBalance', () => {
    let subject: (_adr: Wallet | string) => Promise<any>

    beforeEach(() => {
      subject = async (_adr: Wallet | string) =>
        await context.registry.getPendingBalance(typeof _adr === 'string' ? _adr : _adr.address)
    })

    describe('works and', () => {
      it('returns pending balance for a registered contributor', async () => {
        for (const c of context.state.contributors) {
          expect(await subject(c.account)).to.be.eq(c.balance)
        }
      })
    })
  })

  describe('#setMinterContract', () => {
    let subject: (_minterContract: string, _sender: Wallet) => Promise<any>

    beforeEach(() => {
      subject = async (_minterContract: string, _sender: Wallet) =>
        await context.registry.connect(_sender).setMinterContract(_minterContract)
    })

    describe('works and', () => {
      it('emits the minter contract set event', async () => {
        await expect(subject(AddressZero, actors.adminFirst()))
          .to.emit(context.registry, 'MinterContractSet')
          .withArgs(AddressZero)
      })

      it('sets the minter contract address', async () => {
        const testAddress = BurnAddress
        await subject(testAddress, actors.adminFirst())
        expect(await context.registry.minterContract()).to.be.eq(testAddress)
      })
    })

    describe('fails when', () => {
      it('not called by an admin address', async () => {
        await expect(subject(AddressZero, actors.anyone())).to.be.reverted
      })
    })
  })

  describe('#setTokenContract', () => {
    let subject: (_tokenContract: string, _sender: Wallet) => Promise<any>

    beforeEach(() => {
      subject = async (_tokenContract: string, _sender: Wallet) =>
        await context.registry.connect(_sender).setTokenContract(_tokenContract)
    })

    describe('works and', () => {
      it('sets the token contract address', async () => {
        const testAddress = BurnAddress
        await subject(testAddress, actors.adminFirst())
        expect(await context.registry.tokenContract()).to.be.eq(testAddress)
      })
    })

    describe('fails when', () => {
      it('not called by an admin address', async () => {
        await expect(subject(AddressZero, actors.anyone())).to.be.reverted
      })
      it('zero address is passed', async () => {
        await expect(subject(AddressZero, actors.adminFirst())).to.be.reverted
      })
    })
  })
})
