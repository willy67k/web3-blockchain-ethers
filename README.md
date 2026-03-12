# Blockchain Ethers Manager (Full-stack Web3 Wallet)

A modern, high-performance monorepo application for blockchain interaction, built with **Nest.js**, **React**, and **Ethers.js**. It provides a comprehensive suite of tools for querying balances, sending transactions, and monitoring smart contract events on EVM-compatible networks.

基於 **Nest.js**、**React** 與 **Ethers.js** 構建的現代化高性能 Monorepo 應用程式。提供完整的工具集，用於在 EVM 兼容鏈上查詢餘額、發送交易及監控智能合約事件。

---

## 🚀 Features (核心功能)

- **Balance Tracking**: Query ETH and ERC-20 token balances for any address. (餘額追蹤：查詢任意地址的 ETH 及 ERC-20 代幣餘額。)
- **Token Transfers**: Securely send ETH or ERC-20 tokens via REST API. (代幣轉帳：透過 REST API 安全發送 ETH 或 ERC-20 代幣。)
- **Event Monitoring**: Real-time listening for smart contract events (e.g., Transfer) with logging. (事件監控：即時監聽智能合約事件並記錄日誌。)
- **Contract Interaction**: Programmatic interaction with custom contract methods (mint, swap, etc.). (合約互動：以程式化方式調用自訂合約方法。)

---

## 🛠 Tech Stack (技術棧)

### Monorepo & Infrastructure

- **[Turborepo](https://turbo.build/repo)**: High-performance build system.
- **TypeScript**: Type-safe development throughout the stack.
- **Yarn Workspaces**: Efficient package management.

### Backend (packages/backend)

- **[Nest.js](https://nestjs.com/)**: Progressive Node.js framework.
- **[Ethers.js (v6)](https://docs.ethers.org/v6/)**: For blockchain communication.
- **Logging**: Pino & Pino-pretty for structured logging.

### Frontend (packages/frontend)

- **[React (v19)](https://react.dev/)**: For building a dynamic user interface.
- **[Vite](https://vitejs.dev/)**: Lightning-fast build tool.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for modern design.
- **Axios**: HTTP client for API communication.

---

## 🏁 Getting Started (如何啟動)

### 1. Prerequisites (先決條件)

- Node.js (v18+)
- Yarn or NPM

### 2. Installation (安裝)

Clone the repository and install dependencies from the root:

```bash
yarn install
```

### 3. Configuration (配置)

Set up environment variables in both packages:

**Backend (`packages/backend/.env`):**

```env
PORT=6970
RPC_URL=your_rpc_endpoint (e.g., Alchemy / Infura)
FRONTEND_URL=http://localhost:6969
```

**Frontend (`packages/frontend/.env`):**

```env
VITE_API_URL=http://localhost:6970
```

### 4. Running the Project (運行專案)

Start both backend and frontend in development mode using Turborepo:

```bash
npm run dev
```

- Frontend will be available at: `http://localhost:6969`
- Backend API will be available at: `http://localhost:6970`

---

## 📂 Project Structure (專案結構)

```text
blockchain-ethers/
├── packages/
│   ├── backend/      # Nest.js API (Blockchain logic, Signers, Events)
│   └── frontend/     # React Application (Wallet UI, Dashboard)
├── package.json      # Monorepo root scripts
├── turbo.json        # Turborepo configuration
└── Story.md          # User stories and requirements
```

---

## 📝 License

MIT
