import axios from "axios";
import type { BalanceResponse, BlockchainEvent, QueryResult, TokenBalance } from "../types/blockchain";
export type { BalanceResponse, BlockchainEvent, QueryResult, TokenBalance };

const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:6970/api/v1";

const api = axios.create({
  baseURL,
});

export const getBalance = async (address: string): Promise<BalanceResponse> => {
  const response = await api.get<BalanceResponse>(`/balance/${address}`);
  return response.data;
};

export const transfer = async (data: { fromPrivateKey: string; to: string; amount: string; tokenAddress?: string }) => {
  const response = await api.post("/transfer", data);
  return response.data;
};

export const callContract = async (data: { contractAddress: string; abi: string; method: string; args: any[]; privateKey: string }) => {
  const response = await api.post("/contract/call", data);
  return response.data;
};

export const getEvents = async (): Promise<BlockchainEvent[]> => {
  const response = await api.get<BlockchainEvent[]>("/events");
  return response.data;
};

export const queryEvents = async (data: {
  address: string;
  eventName: string;
  abi: string;
  fromBlock?: string | number;
  toBlock?: string | number;
}): Promise<QueryResult[]> => {
  const response = await api.post<QueryResult[]>("/events/query", data);
  return response.data;
};

export default api;
