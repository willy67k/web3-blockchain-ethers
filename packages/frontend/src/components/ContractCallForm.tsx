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
    <div className="card glass">
      <h3>Contract Interaction</h3>
      <form onSubmit={handleSubmit}>
        <label style={{ fontSize: "0.875rem", color: "var(--text-dim)" }}>Contract Address</label>
        <input type="text" placeholder="0x..." value={formData.contractAddress} onChange={(e) => setFormData({ ...formData, contractAddress: e.target.value })} required />

        <label style={{ fontSize: "0.875rem", color: "var(--text-dim)" }}>ABI (JSON Array)</label>
        <input type="text" placeholder='[{"inputs":[],"name":"mint","outputs":[],"type":"function"}]' value={formData.abi} onChange={(e) => setFormData({ ...formData, abi: e.target.value })} required />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.875rem", color: "var(--text-dim)" }}>Method Name</label>
            <input type="text" placeholder="mint" value={formData.method} onChange={(e) => setFormData({ ...formData, method: e.target.value })} required />
          </div>
          <div>
            <label style={{ fontSize: "0.875rem", color: "var(--text-dim)" }}>Args (Comma separated)</label>
            <input type="text" placeholder="0x..., 1000" value={formData.args} onChange={(e) => setFormData({ ...formData, args: e.target.value })} />
          </div>
        </div>

        <label style={{ fontSize: "0.875rem", color: "var(--text-dim)" }}>Signer Private Key</label>
        <input type="password" placeholder="0x..." value={formData.privateKey} onChange={(e) => setFormData({ ...formData, privateKey: e.target.value })} required />

        <button type="submit" disabled={loading} style={{ width: "100%", marginTop: "1rem", background: "linear-gradient(135deg, var(--secondary), var(--accent))" }}>
          {loading ? "Executing..." : "Call Method"}
        </button>
      </form>

      {error && (
        <p className="error" style={{ marginTop: "1rem" }}>
          {error}
        </p>
      )}

      {result && (
        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(99, 102, 241, 0.1)", borderRadius: "0.5rem", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
          <p style={{ color: "#818cf8", fontWeight: "bold" }}>Transaction Submitted</p>
          <p style={{ fontSize: "0.75rem", wordBreak: "break-all", marginTop: "0.5rem" }}>
            Hash:{" "}
            <a href={`https://sepolia.etherscan.io/tx/${result.txHash}`} target="_blank" rel="noreferrer" style={{ color: "#6366f1" }}>
              {result.txHash}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ContractCallForm;
