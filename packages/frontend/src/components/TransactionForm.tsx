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
    <div className="card glass">
      <h3>Send Transaction</h3>
      <form onSubmit={handleSubmit}>
        <label style={{ fontSize: "0.875rem", color: "var(--text-dim)" }}>Sender Private Key</label>
        <input type="password" placeholder="0x..." value={formData.fromPrivateKey} onChange={(e) => setFormData({ ...formData, fromPrivateKey: e.target.value })} required />

        <label style={{ fontSize: "0.875rem", color: "var(--text-dim)" }}>Recipient Address</label>
        <input type="text" placeholder="0x..." value={formData.to} onChange={(e) => setFormData({ ...formData, to: e.target.value })} required />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.875rem", color: "var(--text-dim)" }}>Amount</label>
            <input type="text" placeholder="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
          </div>
          <div>
            <label style={{ fontSize: "0.875rem", color: "var(--text-dim)" }}>Token Address (Optional)</label>
            <input type="text" placeholder="Leave empty for ETH" value={formData.tokenAddress} onChange={(e) => setFormData({ ...formData, tokenAddress: e.target.value })} />
          </div>
        </div>

        <button type="submit" disabled={loading} style={{ width: "100%", marginTop: "1rem" }}>
          {loading ? "Sending..." : "Send Transaction"}
        </button>
      </form>

      {error && (
        <p className="error" style={{ marginTop: "1rem" }}>
          {error}
        </p>
      )}

      {result && (
        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(16, 185, 129, 0.1)", borderRadius: "0.5rem", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
          <p className="status-submitted" style={{ fontWeight: "bold" }}>
            Success!
          </p>
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

export default TransactionForm;
