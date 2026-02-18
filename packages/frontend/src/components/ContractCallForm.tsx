import React, { useState } from "react";
import { callContract } from "../services/api";

const ContractCallForm: React.FC = () => {
  const [formData, setFormData] = useState({
    contractAddress: "",
    abi: "",
    method: "",
    args: "",
    privateKey: "",
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
        args: formData.args ? formData.args.split(",").map((s) => s.trim()) : [],
      };
      const res = await callContract(payload);
      setResult(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Contract call failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1e293b]/70 p-8 shadow-2xl backdrop-blur-xl">
      <h3 className="mb-6 bg-gradient-to-r from-[#818cf8] to-[#c084fc] bg-clip-text text-xl font-bold text-transparent">Contract Interaction</h3>
      <form onSubmit={handleSubmit}>
        <label className="text-sm text-slate-400">Contract Address</label>
        <input
          type="text"
          placeholder="0x..."
          value={formData.contractAddress}
          onChange={(e) => setFormData({ ...formData, contractAddress: e.target.value })}
          required
          className="mb-4 w-full rounded-lg border border-white/10 bg-[#0f172a]/50 px-4 py-3 text-white transition-colors focus:border-[#6366f1] focus:outline-none"
        />

        <label className="text-sm text-slate-400">ABI (JSON Array)</label>
        <input
          type="text"
          placeholder='[{"inputs":[],"name":"mint","outputs":[],"type":"function"}]'
          value={formData.abi}
          onChange={(e) => setFormData({ ...formData, abi: e.target.value })}
          required
          className="mb-4 w-full rounded-lg border border-white/10 bg-[#0f172a]/50 px-4 py-3 text-white transition-colors focus:border-[#6366f1] focus:outline-none"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400">Method Name</label>
            <input
              type="text"
              placeholder="mint"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              required
              className="mb-4 w-full rounded-lg border border-white/10 bg-[#0f172a]/50 px-4 py-3 text-white transition-colors focus:border-[#6366f1] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400">Args (Comma separated)</label>
            <input
              type="text"
              placeholder="0x..., 1000"
              value={formData.args}
              onChange={(e) => setFormData({ ...formData, args: e.target.value })}
              className="mb-4 w-full rounded-lg border border-white/10 bg-[#0f172a]/50 px-4 py-3 text-white transition-colors focus:border-[#6366f1] focus:outline-none"
            />
          </div>
        </div>

        <label className="text-sm text-slate-400">Signer Private Key</label>
        <input
          type="password"
          placeholder="0x..."
          value={formData.privateKey}
          onChange={(e) => setFormData({ ...formData, privateKey: e.target.value })}
          required
          className="mb-4 w-full rounded-lg border border-white/10 bg-[#0f172a]/50 px-4 py-3 text-white transition-colors focus:border-[#6366f1] focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full cursor-pointer rounded-lg bg-gradient-to-br from-[#a855f7] to-[#ec4899] px-6 py-3 font-semibold text-white shadow-md transition-all hover:translate-y-[-2px] hover:shadow-lg hover:brightness-110 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Executing..." : "Call Method"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {result && (
        <div className="mt-6 rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-4">
          <p className="font-bold text-indigo-400">Transaction Submitted</p>
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

export default ContractCallForm;
