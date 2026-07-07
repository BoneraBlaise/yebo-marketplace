import { WALLET_TRANSACTION_TYPE } from "./CommerceTypes";
import { logCommerceDiagnostics } from "./CommerceDiagnostics";

/** AI Credits Wallet — Phase 8D */
export class CreditsWallet {
  constructor({ monthlyAllocation = 0, billingCycleDays = 30 } = {}) {
    this.monthlyAllocation = monthlyAllocation;
    this.billingCycleDays = billingCycleDays;
    this.currentCredits = monthlyAllocation;
    this.consumedCredits = 0;
    this.transactions = [];
    this.cycleStartedAt = new Date().toISOString();
    this.nextResetAt = this._computeNextReset();
  }

  _computeNextReset() {
    const start = new Date(this.cycleStartedAt);
    start.setDate(start.getDate() + this.billingCycleDays);
    return start.toISOString();
  }

  getSnapshot() {
    return {
      currentCredits: this.currentCredits,
      monthlyAllocation: this.monthlyAllocation,
      consumedCredits: this.consumedCredits,
      remainingCredits: this.currentCredits,
      cycleStartedAt: this.cycleStartedAt,
      nextResetAt: this.nextResetAt,
      transactionCount: this.transactions.length,
    };
  }

  _record(type, amount, metadata = {}) {
    const entry = {
      id: `tx-${Date.now()}-${this.transactions.length}`,
      type,
      amount,
      balanceAfter: this.currentCredits,
      timestamp: new Date().toISOString(),
      metadata,
    };
    this.transactions.push(entry);
    return entry;
  }

  allocate(amount, metadata = {}) {
    this.monthlyAllocation = amount;
    this.currentCredits = amount;
    this.consumedCredits = 0;
    this.cycleStartedAt = new Date().toISOString();
    this.nextResetAt = this._computeNextReset();
    this._record(WALLET_TRANSACTION_TYPE.ALLOCATION, amount, metadata);
    logCommerceDiagnostics("wallet", { action: "allocate", amount, remaining: this.currentCredits });
    return this.getSnapshot();
  }

  consume(amount, metadata = {}) {
    const cost = Number(amount) || 0;
    if (cost > this.currentCredits) {
      return { ok: false, error: "insufficient_credits", ...this.getSnapshot() };
    }
    this.currentCredits -= cost;
    this.consumedCredits += cost;
    this._record(WALLET_TRANSACTION_TYPE.CONSUMPTION, cost, metadata);
    logCommerceDiagnostics("wallet", { action: "consume", amount: cost, remaining: this.currentCredits });
    return { ok: true, ...this.getSnapshot() };
  }

  reset(allocation = this.monthlyAllocation) {
    this.currentCredits = allocation;
    this.consumedCredits = 0;
    this.cycleStartedAt = new Date().toISOString();
    this.nextResetAt = this._computeNextReset();
    this._record(WALLET_TRANSACTION_TYPE.RESET, allocation);
    logCommerceDiagnostics("wallet", { action: "reset", allocation });
    return this.getSnapshot();
  }

  topUp(amount, metadata = {}) {
    const added = Number(amount) || 0;
    this.currentCredits += added;
    this._record(WALLET_TRANSACTION_TYPE.TOP_UP, added, metadata);
    return this.getSnapshot();
  }

  getTransactionHistory(limit = 50) {
    return this.transactions.slice(-limit);
  }
}

export const createCreditsWallet = (options) => new CreditsWallet(options);

export default CreditsWallet;
