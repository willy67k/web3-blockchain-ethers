import React, { useState } from "react";
import { transfer } from "../services/api";

const TransactionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fromPrivateKey: "",
    to: "",
    amount: "",
    tokenAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const payload = {
        ...formData,
        tokenAddress: formData.tokenAddress || undefined,
      };
      const res = await transfer(payload);
      setResult(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1e293b]/70 p-8 shadow-2xl backdrop-blur-xl">
      <h3 className="mb-6 bg-gradient-to-r from-[#818cf8] to-[#c084fc] bg-clip-text text-xl font-bold text-transparent">Send Transaction</h3>
      <form onSubmit={handleSubmit}>
        <label className="text-sm text-slate-400">Sender Private Key</label>
        <input
          type="password"
          placeholder="0x..."
          value={formData.fromPrivateKey}
          onChange={(e) => setFormData({ ...formData, fromPrivateKey: e.target.value })}
          required
          className="mb-4 w-full rounded-lg border border-white/10 bg-[#0f172a]/50 px-4 py-3 text-white transition-colors focus:border-[#6366f1] focus:outline-none"
        />

        <label className="text-sm text-slate-400">Recipient Address</label>
        <input
          type="text"
          placeholder="0x..."
          value={formData.to}
          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
          required
          className="mb-4 w-full rounded-lg border border-white/10 bg-[#0f172a]/50 px-4 py-3 text-white transition-colors focus:border-[#6366f1] focus:outline-none"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400">Amount</label>
            <input
              type="text"
              placeholder="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className="mb-4 w-full rounded-lg border border-white/10 bg-[#0f172a]/50 px-4 py-3 text-white transition-colors focus:border-[#6366f1] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400">Token Address (Optional)</label>
            <input
              type="text"
              placeholder="Leave empty for ETH"
              value={formData.tokenAddress}
              onChange={(e) => setFormData({ ...formData, tokenAddress: e.target.value })}
              className="mb-4 w-full rounded-lg border border-white/10 bg-[#0f172a]/50 px-4 py-3 text-white transition-colors focus:border-[#6366f1] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full cursor-pointer rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a855f7] px-6 py-3 font-semibold text-white shadow-md transition-all hover:translate-y-[-2px] hover:shadow-lg hover:brightness-110 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Transaction"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {result && (
        <div className="mt-6 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="font-bold text-emerald-500">Success!</p>
          <p className="mt-2 break-all text-xs">
            Hash:{" "}
            <a href={`https://sepolia.etherscan.io/tx/${result.txHash}`} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
              {result.txHash}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionForm;
