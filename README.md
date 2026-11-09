# StrataFlow Web 💻

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38B2AC.svg)](https://tailwindcss.com/)
[![Freighter](https://img.shields.io/badge/Stellar-Freighter%20Ready-blueviolet.svg)](https://www.freighter.app/)

> **Part of the [StrataFlow Protocol](https://github.com/StrataFlow-Org) suite.**  
> Next.js non-custodial interface for managing programmable milestone escrows on Stellar. Built for Stellar Drips Wave.

---

## 🌟 Overview

`strataflow-web` provides a production-grade Web3 application for trustless milestone escrow management on Stellar:
- **Freighter API & Multi-Wallet Support**: Live Freighter extension connectivity with network detection, mismatch banners, and demo wallet testing.
- **Soroban Transaction Pipeline**: Automatic RPC simulation (`simulateTransaction`), minimum resource fee assembly, wallet XDR signing, and ledger inclusion polling (`submitAndPoll`).
- **3-Step Escrow Creation Wizard**: Interactive stepper for defining participants, milestone breakdowns, token presets (Native XLM and Circle USDC SAC), dry-run gas previews, and local draft auto-saving.
- **Role-Based Agreement Console**: Dynamic action gating based on connected wallet role:
  - **Client**: Release milestones, claim post-deadline timeout refunds, or cancel unfunded drafts.
  - **Provider**: Submit deliverable proofs (IPFS / HTTPS links).
  - **Arbiter**: Review dispute evidence and execute on-chain balance splits.
- **Transaction Feedback & Explorer Integration**: Non-intrusive Toast notifications with direct Stellar Expert explorer links and ErrorBoundary fallback views.
- **Cryptographic SEP-10 WebAuth**: Authenticate session tokens directly with the backend indexer.

---

## 🚀 Quick Start

### Connected Stellar Testnet Contract

| Parameter | Value |
|---|---|
| **Contract ID** | `CDXVD3AA43SE2D52ZBJSH3RDKAPOYG6OCDAZGSQD6M5TCBQIG3HTLY6J` |
| **Network** | Stellar Testnet (`https://soroban-testnet.stellar.org`) |
| **Admin Address** | `GBWFZHBYEKF5MR2MHW7JAZX6ZRI2PKKBL6IALEMJSBMU4JMDSIB34KP5` |
| **StellarExpert** | [View On-Chain Contract](https://stellar.expert/explorer/testnet/contract/CDXVD3AA43SE2D52ZBJSH3RDKAPOYG6OCDAZGSQD6M5TCBQIG3HTLY6J) |

### 1. Install Dependencies
```bash
npm install --ignore-scripts
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dApp.

---

## 🧪 Testing & Production Build

Run the comprehensive automated unit and integration test suite (139 tests, 100% pass):

```bash
npm test
```

Execute TypeScript typecheck & lint verification:

```bash
npm run lint
```

Compile the optimized Next.js production bundle:

```bash
npm run build
```

---

## 🎨 Color Palette & Design System

- **Background**: `#0A0E17` (Deep Space Slate)
- **Primary Gradient**: From `#2563EB` to `#4F46E5` (Blue to Indigo)
- **Success / Release**: `#10B981` (Emerald)
- **Dispute Warning**: `#F59E0B` (Amber)
- **Danger / Exception**: `#EF4444` (Rose)

---

## 📄 License

This repository is licensed under the [MIT License](LICENSE).
