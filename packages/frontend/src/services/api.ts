import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:6970/api/v1";
console.log("API BaseURL:", baseURL);

const api = axios.create({
  baseURL,
});

export const getBalance = async (address: string) => {
  const response = await api.get(`/balance/${address}`);
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

export const getEvents = async () => {
  const response = await api.get("/events");
  return response.data;
};

export default api;
