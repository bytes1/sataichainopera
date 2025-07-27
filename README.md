# SatAI: The Conversational Layer for Bitcoin Finance

Welcome to the official repository for **SatAI**, an advanced AI agent designed to revolutionize how users interact with sBTC (Stacked Bitcoin) and the Stacks ecosystem.

## Vision: Why SatAI?

In the crypto space, most users have a technical background. However, blockchain is a technology with the potential for massive societal impact. To unlock this potential, we must make it accessible to everyone by removing technical barriers and making it easy to use.

SatAI's mission is to solve this problem. We are creating an AI-native experience where interacting with sBTC is as simple as chatting with a bot. Our goal is to ensure that even non-technical users can onboard to the blockchain seamlessly, making complex operations feel as simple as talking to a friend.

---

## How It Works in Practice

Using SatAI is designed to be intuitive and effortless.

1.  **Connect Your Wallet**: First, connect your preferred Stacks-compatible wallet (like Hiro or Xverse) to the SatAI application. This authorizes SatAI to prepare transactions on your behalf.
2.  **Chat with the AI**: Interact with the chatbot using plain English to access sBTC features and information.

**Examples:**

- **To send funds:** `Send 0.5 sBTC to wallet address [address]`
- **To get price data:** `What's the current price of BTC?`
- **To learn about the ecosystem:** `Explain how sBTC pegging works`
- **To perform a full conversion:** `Convert 1 BTC to sBTC`

---

## Core Features

- **Wallet Connection**: Easily connect your preferred wallet to start interacting with sBTC.
- **sBTC & STX Transfers**: Send and receive tokens through a simple chat interface.
- **Crypto Price Lookup**: Get real-time price updates for various cryptocurrencies.
- **sBTC Analysis**: Perform transaction analysis and gain insights into your sBTC activity.
- **Bitcoin Layer Integration**: Direct interaction with Bitcoin liquidity via Stacks smart contracts.
- **Secure & Trustless**: Leverages Stacks' decentralized architecture for secure, non-custodial transactions.

---

## Technical Architecture & Integrations

SatAI is built on a robust foundation that combines advanced AI models with secure blockchain technology.

- **AI Engine**: Powered by advanced language models to understand and process natural language inputs. We leverage the **Chain Opera AI Agent** for specialized Web3 queries and also integrate with models from **Google Gemini** and **TogetherAI**.

  - **Chain Opera Implementation Snippet:**

    ```javascript
    import { createOpenAI } from "@ai-sdk/openai";

    // This custom provider directs our AI requests to the Chain Opera network
    const myCustomOpenAIProvider = createOpenAI({
      baseURL: "https://api.tensoropera.ai/v1", // Chain Opera's custom endpoint
    });
    ```

- **Blockchain Interface**: Direct integration with Stacks blockchain and sBTC smart contracts.
- **Wallet Connectors**: Support for multiple wallet providers including Hiro Wallet, Xverse, and others.
- **API Layer**: Real-time data retrieval from cryptocurrency markets. We use the **CoinGecko MCP (Model Context Protocol) Server**, an open standard for AIs to securely fetch market data.
- **Security Layer**: End-to-end encryption and zero knowledge of private keys. You are always in control.

---

## Getting Started

### Prerequisites

- Node.js (latest recommended version)
- pnpm or npm
- A Stacks-compatible Wallet (e.g., Hiro Wallet)

### Installation

```bash
pnpm install
# or
npm install
```

### Running the Project

```bash
pnpm run dev
# or
npm run dev
```

---

## 🆕 New Features

### ✅ Full BTC-to-sBTC Conversion

- Fully implements and simplifies the process for converting native Bitcoin (BTC) into sBTC.
- Handles the entire multi-step procedure through a single, simple chat command.
- Makes bringing Bitcoin liquidity onto the Stacks layer easier than ever.

### ✅ STX Transfer Support

- Enables sending STX tokens to any valid Stacks address.
- Supports natural language command parsing (e.g., "Send 1 STX to address").
- Handles address validation, amount formatting, and transaction submission.

### ✅ SBTC Balance Fetching

- Allows fetching of sBTC token balances directly from the blockchain.
- Queries the sBTC smart contract and returns the correct on-chain balance for a given address.
- Can be used in dashboards, wallets, or automated agents.

---

## Project Roadmap

Our vision extends far beyond the current features. The SatAI roadmap is focused on creating a truly all-in-one platform for Bitcoin finance:

- **Inbuilt Smart Wallet**: Integrate a dedicated, user-friendly smart wallet to significantly streamline onboarding.
- **sBTC Application Hub**: Allow users to interact with multiple DeFi protocols and marketplaces directly through SatAI's chat interface.
- **DeFi Strategy Implementation**: Enable users to discover, understand, and execute DeFi strategies involving sBTC.
- **Expanded External Wallet Support**: Continue to add support for a wider range of popular Stacks and Bitcoin wallets.
- **Advanced Analytics & Portfolio Management**: Introduce tools for deeper transaction insights and portfolio performance tracking.
- **Mobile Accessibility**: Develop dedicated mobile applications for on-the-go access to SatAI.
