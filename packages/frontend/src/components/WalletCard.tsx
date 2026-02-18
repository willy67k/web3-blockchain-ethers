import React, { useState } from "react";
import { getBalance } from "../services/api";

const WalletCard: React.FC = () => {
  const [address, setAddress] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    if (!address) return;
    setLoading(true);
    setError("");
    try {
      const result = await getBalance(address);
      setData(result);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1e293b]/70 p-8 shadow-2xl backdrop-blur-xl">
      <h3 className="mb-6 bg-gradient-to-r from-[#818cf8] to-[#c084fc] bg-clip-text text-xl font-bold text-transparent">Wallet Balance</h3>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Enter Wallet Address (0x...)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-[#0f172a]/50 px-4 py-3 text-white transition-colors focus:border-[#6366f1] focus:outline-none"
        />
        <button
          onClick={handleFetch}
          disabled={loading}
          className="cursor-pointer self-start rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a855f7] px-6 py-3 font-semibold text-white shadow-md transition-all hover:translate-y-[-2px] hover:shadow-lg hover:brightness-110 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Fetching..." : "Check"}
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {data && (
        <div className="mt-8">
          <div className="mb-6">
            <p className="text-sm text-slate-400">Native Balance</p>
            <p className="text-[2rem] font-bold">
              {data.ethBalance} <span className="text-base text-slate-400">ETH</span>
            </p>
          </div>

          <p className="mb-2 text-sm text-slate-400">Tokens</p>
          <ul className="list-none">
            {data.tokens.map((token: any, index: number) => (
              <li key={index} className="flex justify-between border-b border-white/10 py-4 last:border-0">
                <span>{token.symbol}</span>
                <span className="font-semibold">{token.balance}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WalletCard;
