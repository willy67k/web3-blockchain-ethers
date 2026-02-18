export interface TokenBalance {
  symbol: string;
  balance: string;
}

export interface BalanceResponse {
  ethBalance: string;
  tokens: TokenBalance[];
}

export interface BlockchainEvent {
  event: string;
  from: string;
  to: string;
  value: string;
  txHash: string;
  timestamp: string;
}

export interface QueryResult {
  txHash: string;
  blockNumber: number;
  args: Record<string, string>;
}
