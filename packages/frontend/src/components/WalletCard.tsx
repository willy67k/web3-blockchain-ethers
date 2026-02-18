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
    <div className="card glass">
      <h3>Wallet Balance</h3>
      <div style={{ display: "flex", gap: "1rem" }}>
        <input type="text" placeholder="Enter Wallet Address (0x...)" value={address} onChange={(e) => setAddress(e.target.value)} />
        <button onClick={handleFetch} disabled={loading} style={{ alignSelf: "flex-start" }}>
          {loading ? "Fetching..." : "Check"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {data && (
        <div style={{ marginTop: "2rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ color: "var(--text-dim)", fontSize: "0.875rem" }}>Native Balance</p>
            <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {data.ethBalance} <span style={{ fontSize: "1rem", color: "var(--text-dim)" }}>ETH</span>
            </p>
          </div>

          <p style={{ color: "var(--text-dim)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Tokens</p>
          <ul className="token-list">
            {data.tokens.map((token: any, index: number) => (
              <li key={index} className="token-item">
                <span>{token.symbol}</span>
                <span style={{ fontWeight: "600" }}>{token.balance}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WalletCard;
