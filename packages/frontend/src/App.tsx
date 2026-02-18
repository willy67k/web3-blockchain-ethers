import React from "react";
import WalletCard from "./components/WalletCard";
import TransactionForm from "./components/TransactionForm";
import ContractCallForm from "./components/ContractCallForm";
import ActivityFeed from "./components/ActivityFeed";
import "./index.css";

const App: React.FC = () => {
  return (
    <div className="container">
      <header style={{ textAlign: "center", marginBottom: "4rem", marginTop: "2rem" }}>
        <h1 style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>Ethers Explorer</h1>
        <p style={{ color: "var(--text-dim)", fontSize: "1.2rem" }}>Interact with Ethereum Sepolia Testnet seamlessly</p>
      </header>

      <main>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
          <WalletCard />
          <TransactionForm />
          <ContractCallForm />
          <ActivityFeed />
        </div>
      </main>

      <footer style={{ textAlign: "center", marginTop: "6rem", padding: "2rem", color: "var(--text-dim)", fontSize: "0.875rem", borderTop: "1px solid var(--border)" }}>
        <p>&copy; 2024 Blockchain Developer Playground. Built with NestJS, React, and Ethers.js</p>
      </footer>
    </div>
  );
};

export default App;
