import { IStorage } from "../core/interfaces/IStorage";
import { BigNumber, BigNumberish, ethers } from "ethers";
import { FunctionDeprecatedError } from "../common/error";
import {
  PublicClaimCondition,
  SnapshotInfo,
} from "../types/claim-conditions/PublicClaimCondition";
import ClaimConditionPhase from "./claim-condition-phase";
import { createSnapshot } from "../common";
import { AddressZero } from "@ethersproject/constants";

class ClaimConditionFactory {
  private phases: ClaimConditionPhase[] = [];
  private storage: IStorage;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(storage: IStorage) {
    this.storage = storage;
  }

  /**
   * Used internally when creating a drop module/updating
   * the claim conditions of a drop module.
   *
   * @internal
   *
   * @returns - The claim conditions that will be used when validating a users claim transaction.
   */
  public async buildConditions(): Promise<PublicClaimCondition[]> {
    let sorted: PublicClaimCondition[] = [];
    await Promise.all(
      this.phases.map((c) => this.buildPublicClaimCondition(c)),
    ).then((publicClaimConditions) => {
      // TODO: write test to ensure they're sorted by start time, earliest first
      sorted = publicClaimConditions.sort((a, b) => {
        if (a.startTimestamp.eq(b.startTimestamp)) {
          return 0;
        } else if (a.startTimestamp.gt(b.startTimestamp)) {
          return 1;
        } else {
          return -1;
        }
      });
    });

    return sorted;
  }

  /**
   * Converts a set of generic `PublicClaimCondition`s into a `ClaimConditionFactory`
   *
   * @param conditions - The conditions to load, should be returned directly from the contract.
   * @returns - The loaded claim condition factory.
   */
  public fromPublicClaimConditions(conditions: PublicClaimCondition[]) {
    const phases = [];
    for (const condition of conditions) {
      const phase = new ClaimConditionPhase();

      // If there's a price, there must also be an associated currency
      if (condition.currency) {
        phase.setPrice(condition.pricePerToken, condition.currency);
      }

      if (condition.maxMintSupply) {
        phase.setMaxQuantity(condition.maxMintSupply);
      }

      phase.setConditionStartTime(
        new Date(condition.startTimestamp.toNumber() * 1000),
      );
      phases.push(phase);
    }
    this.phases = phases;
    return this;
  }

  /**
   * Creates a new claim 'phase' with its own set of claim conditions
   *
   * @param startTime - The start time of the phase in epoch seconds or a `Date` object.
   * @param maxQuantity - The max quantity of the phase. By default, this is set to be infinite. In most cases, if your drop only
   has a single phase, you don't need to override this value. If your drop has multiple phases, you should override this value and specify how many tokens are available for each specific phase.
    * @param maxQuantityPerTransaction - The maximum number of claims that can be made in a single transaction. By default, this is set to infinite which means that there is no limit.
   *
   * @returns - The claim condition builder.
   */
  public newClaimPhase({
    startTime,
    maxQuantity = ethers.constants.MaxUint256,
    maxQuantityPerTransaction = ethers.constants.MaxUint256,
  }: {
    startTime: Date | number;
    maxQuantity?: BigNumberish;
    maxQuantityPerTransaction?: BigNumberish;
  }): ClaimConditionPhase {
    const condition = new ClaimConditionPhase();

    condition.setConditionStartTime(startTime);
    condition.setMaxQuantity(BigNumber.from(maxQuantity));
    condition.setMaxQuantityPerTransaction(
      BigNumber.from(maxQuantityPerTransaction),
    );

    this.phases.push(condition);
    return condition;
  }

  /**
   * Removes a claim condition phase from the factory.
   *
   * @param phase - The phase to remove
   */
  public async deleteClaimPhase(index: number): Promise<void> {
    if (index < 0 || index >= this.phases.length) {
      return;
    }

    const sorted = await this.buildConditions();
    const cleared = sorted.splice(index - 1, 1);
    this.fromPublicClaimConditions(cleared);
  }

  /**
   * @deprecated - Use {@link ClaimConditionFactory.deleteClaimPhase} instead.
   */
  public removeClaimPhase(_index: number): void {
    throw new FunctionDeprecatedError("deleteClaimPhase");
  }

  /**
   * Helper method fetches all snapshots from a factory.
   *
   * @returns - All snapshots in the condition factory.
   */
  public allSnapshots(): SnapshotInfo[] {
    return this.phases
      .filter((p) => p.snaphsotInfo !== undefined)
      .map((p) => p.snaphsotInfo as SnapshotInfo);
  }

  /**
   * Helper method that provides defaults for each claim condition.
   * @internal
   */
  public async buildPublicClaimCondition(
    claimPhase: ClaimConditionPhase,
  ): Promise<PublicClaimCondition> {
    if (claimPhase.snapshot) {
      claimPhase.setSnaphsotInfo(
        await createSnapshot(claimPhase.snapshot, this.storage),
      );
    }

    return {
      startTimestamp: BigNumber.from(claimPhase.conditionStartTime.toString()),
      pricePerToken: claimPhase.price,
      currency: claimPhase.currencyAddress || AddressZero,
      maxMintSupply: claimPhase.maxQuantity,
      waitTimeSecondsLimitPerTransaction: claimPhase.waitInSeconds,
      quantityLimitPerTransaction: claimPhase.quantityLimitPerTransaction,
      currentMintSupply: 0,
      merkleRoot: claimPhase.snaphsotInfo?.merkleRoot
        ? claimPhase.snaphsotInfo.merkleRoot
        : claimPhase.merkleRootHash,
    };
  }
}

export default ClaimConditionFactory;
