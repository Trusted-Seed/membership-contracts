import { MockProvider } from "ethereum-waffle";
import { BigNumber, Wallet } from "ethers";
import { TestERC20 } from "../../typechain";
import { ActorFixture, arrayWrap } from "../shared";

/**
 * HelperCommands is a utility that abstracts away lower-level ethereum details
 * so that we can focus on core business logic.
 *
 * Each helper function should be a `HelperTypes.CommandFunction`
 */
export class HelperCommands {
  actors: ActorFixture;
  provider: MockProvider;

  constructor(provider, actors) {
    this.provider = provider;
    this.actors = actors;
  }
}

export class ERC20Helper {
  ensureBalancesAndApprovals = async (
    actor: Wallet,
    tokens: TestERC20 | TestERC20[],
    balance: BigNumber,
    spender?: string
  ): Promise<any> => {
    for (const token of arrayWrap(tokens)) {
      await this.ensureBalance(actor, token, balance);
      if (spender) {
        await this.ensureApproval(actor, token, balance, spender);
      }
    }
  };

  ensureBalance = async (
    actor: Wallet,
    token: TestERC20,
    balance: BigNumber
  ): Promise<any> => {
    const currentBalance = await token.balanceOf(actor.address);
    if (currentBalance.lt(balance)) {
      await token
        // .connect(this.actors.tokensOwner())
        .transfer(actor.address, balance.sub(currentBalance));
    }
    return token.balanceOf(actor.address);
  };

  ensureApproval = async (
    actor: Wallet,
    token: TestERC20,
    balance: BigNumber,
    spender: string
  ): Promise<void> => {
    const currentAllowance = await token.allowance(
      actor.address,
      actor.address
    );
    if (currentAllowance.lt(balance)) {
      await token.connect(actor).approve(spender, balance);
    }
  };
}
