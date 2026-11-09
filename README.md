# StrataFlow Web 🌐

[![Stellar Soroban](https://img.shields.io/badge/Stellar-Soroban%20Native-blueviolet?style=for-the-badge&logo=stellar)](https://stellar.org)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![SEP-0001](https://img.shields.io/badge/SEP--0001-stellar.toml%20Verified-blueviolet?style=for-the-badge)](https://stellar.org)
[![Freighter Ready](https://img.shields.io/badge/Freighter-v2.0-orange?style=for-the-badge)](https://www.freighter.app/)
[![Tests Passing](https://img.shields.io/badge/Tests-143%2F143%20Passed-brightgreen?style=for-the-badge)](https://github.com/StrataFlow-Org/strataflow-web)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![CI Status](https://img.shields.io/github/actions/workflow/status/StrataFlow-Org/strataflow-web/ci.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/StrataFlow-Org/strataflow-web/actions)

> **Non-Custodial Decentralized Application for Trustless Milestone Escrows on Stellar & Soroban.**  
> Empowers contractors, clients, and arbiters to govern programmable escrow payments with zero custody risk, automated timeout refunds, and real-time on-chain arbitration.

---

## 🌟 Executive Summary

**StrataFlow Web** delivers a modern, high-performance Web3 user interface for orchestrating multi-party milestone agreements on the Stellar network. Operating exclusively client-side with non-custodial wallet signatures via **Freighter**, StrataFlow eliminates counterparty default risk by holding escrow capital within autonomous Soroban smart contracts.

```
+---------------------------------------------------------------------------------------+
|                                  STRATAFLOW DAPP                                      |
|                                                                                       |
|   +-------------------+    +----------------------+    +--------------------------+   |
|   |  CLIENT CONSOLE   |    |   PROVIDER CONSOLE   |    |    ARBITER CONSOLE       |   |
|   |                   |    |                      |    |                          |   |
|   | - Create Escrow   |    | - Review Milestones  |    | - Inspect Evidence       |   |
|   | - Fund with SAC   |    | - Submit IPFS Proofs |    | - Apportion Remaining    |   |
|   | - Release Payouts |    | - Track Deliverables |    |   Balance Minus Fees     |   |
|   | - Claim Refunds   |    | - Request Dispute    |    | - Settle Disputed Escrow |   |
|   +---------+---------+    +----------+-----------+    +------------+-------------+   |
|             |                         |                             |                 |
|             +-------------------------+-----------------------------+                 |
|                                       |                                               |
|                    +------------------v-------------------+                           |
|                    |   Soroban Transaction Pipeline       |                           |
|                    |   - simulateTransaction (RPC)        |                           |
|                    |   - Freighter Wallet Signer (XDR)    |                           |
|                    |   - sendTransaction & Poll Loop      |                           |
|                    +------------------+-------------------+                           |
+---------------------------------------|-----------------------------------------------+
                                        |
                 +----------------------v-----------------------+
                 |          Stellar Testnet / Soroban           |
                 |  Contract: CDXVD3AA43SE2D52...HTLY6J         |
                 +----------------------------------------------+
```

---

## 🚀 Live Stellar Testnet Deployment

The application interacts directly with the verified StrataFlow core contract deployed on Stellar Testnet:

| Parameter | Value | Explorer Link |
|---|---|---|
| **Contract ID** | `CDXVD3AA43SE2D52ZBJSH3RDKAPOYG6OCDAZGSQD6M5TCBQIG3HTLY6J` | [View on StellarExpert](https://stellar.expert/explorer/testnet/contract/CDXVD3AA43SE2D52ZBJSH3RDKAPOYG6OCDAZGSQD6M5TCBQIG3HTLY6J) |
| **Network** | Stellar Testnet (`Test SDF Network ; September 2015`) | [Network Status](https://soroban-testnet.stellar.org) |
| **RPC Endpoint** | `https://soroban-testnet.stellar.org` | [Stellar Lab Inspector](https://lab.stellar.org/r/testnet/contract/CDXVD3AA43SE2D52ZBJSH3RDKAPOYG6OCDAZGSQD6M5TCBQIG3HTLY6J) |
| **Protocol Admin** | `GBWFZHBYEKF5MR2MHW7JAZX6ZRI2PKKBL6IALEMJSBMU4JMDSIB34KP5` | [View Admin Account](https://stellar.expert/explorer/testnet/account/GBWFZHBYEKF5MR2MHW7JAZX6ZRI2PKKBL6IALEMJSBMU4JMDSIB34KP5) |
| **WASM Hash** | `3cf260524d911a16c0012bf650f5d1453793ddf4362710d602e869956e5147fb` | [Verified Bytecode](https://stellar.expert/explorer/testnet/contract/CDXVD3AA43SE2D52ZBJSH3RDKAPOYG6OCDAZGSQD6M5TCBQIG3HTLY6J) |

---

## 🖥️ UI Architecture & Screenshots Preview

### 1. Escrow Creation Wizard
An interactive 3-step wizard with built-in parameter validation, dry-run gas estimation, and dynamic milestone weight breakdowns.

```
┌────────────────────────────────────────────────────────────────────────┐
│  Create Agreement > Step 1: Parties > Step 2: Milestones > Step 3: Fund│
├────────────────────────────────────────────────────────────────────────┤
│  Client:   GBWFZHBYEKF5MR2MHW7JAZX6ZRI2PKKBL6IALEMJSBMU4JMDSIB34KP5    │
│  Provider: GCKNFX...890  [✓ Valid Ed25519 Public Key]                  │
│  Arbiter:  GA998B...332  [✓ Valid Ed25519 Public Key]                  │
│  Token:    [ Native XLM ]  [ Circle USDC (SAC) ]                       │
│                                                                        │
│  Milestone #1: Initial Architecture Draft (500 XLM / 25%)              │
│  Milestone #2: Smart Contract Core Deployment (1,000 XLM / 50%)        │
│  Milestone #3: End-to-End Security Audit Verification (500 XLM / 25%) │
│                                                                        │
│  Total Escrow Budget: 2,000 XLM  | Estimated Network Fee: ~0.00005 XLM │
│  [ Save Draft ]                            [ Simulate & Deploy Escrow ]│
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Agreement Detail & Multi-Role Console
The agreement detail view automatically evaluates the connected wallet public key against the contract's `client`, `provider`, and `arbiter` roles to reveal role-specific actions:

```
┌────────────────────────────────────────────────────────────────────────┐
│  Agreement #42 · In Progress · Active on Testnet                       │
├────────────────────────────────────────────────────────────────────────┤
│  Total Funded: 2,000.00 XLM | Remaining Balance: 1,500.00 XLM         │
│  Participants: Client (You) · Provider (GCKN...) · Arbiter (GA99...)   │
│                                                                        │
│  [■■■■■■■■■■■■■■■■□□□□□□□□□□□□□□□□□□□□] 25% Completed                 │
│                                                                        │
│  Milestone 1: Architecture Draft  [ APPROVED ] - 500 XLM Released      │
│  Milestone 2: Soroban Contracts   [ SUBMITTED ]                        │
│    Proof: ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy5 │
│    Actions: [ Approve & Release (1,000 XLM) ]  [ Reject Deliverable ]  │
│  Milestone 3: Audit Verification  [ PENDING ]                          │
│                                                                        │
│  Safety Rails: [ Raise Dispute ]  [ Claim Timeout Refund (Expired) ]  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Key Technical Capabilities

1. **Native Freighter Wallet Integration**:
   - Seamlessly queries Freighter extension state via `@stellar/freighter-api`.
   - Real-time network mismatch detection: alerts users if their wallet is pointing to Mainnet while the dApp is configured for Testnet.
   - Built-in fallback demo-wallet switcher for instant automated testing.

2. **Full Soroban Transaction Pipeline**:
   - **Simulation First**: Calls `simulateTransaction` on Soroban RPC before asking the user for a signature, catching logic errors, authorization mismatches, and insufficient balances upfront.
   - **Resource Calculation**: Automatically parses resource limits, storage footprint, and calculates the optimal minimum network fee in stroops.
   - **Transaction Assembly & Polling**: Uses `@stellar/stellar-sdk` to assemble `Operation.invokeContractFunction`, passes the XDR to Freighter for signing, and polls transaction status via `getTransaction` with exponential backoff.

3. **Defensive Security & XSS Entity Encoding**:
   - Comprehensive sanitization of user milestone text and deliverable URLs.
   - Strict escaping of HTML entities (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#x27;`) to neutralize cross-site scripting attacks from malicious milestone descriptions.
   - Disallows dangerous URL schemes (`javascript:`, `data:`, `file:`) and restricts proofs strictly to `ipfs://` CIDs or trusted `https://` URLs.

4. **Reliable Off-Chain Sync & Error Boundaries**:
   - Dual-mode data fetching: queries the StrataFlow off-chain event indexer for instant loading and falls back seamlessly to direct on-chain Soroban RPC reading.
   - React Error Boundary container preserves component crash context and provides retry controls without full page reload.
   - Accessible Toast notification queue with direct deep-links to StellarExpert for every submitted transaction hash.

---

## 🧪 Automated Test Suite (143 Tests Passing)

The dApp includes 143 automated unit and integration tests executing natively on Node 20/22 without flaky browser dependencies:

```bash
npm test
```

### Test Coverage Highlights:
- **Soroban ScVal Argument Serialization**: Validates correct argument building for `create_agreement`, `fund_agreement`, `submit_milestone`, `release_milestone`, `raise_dispute`, and `resolve_dispute`.
- **Role & Access Controls**: Tests permission evaluation across Client, Provider, Arbiter, and Third-Party caller states.
- **XSS & Input Sanitization**: Verifies that malicious HTML tags, JavaScript payloads, and attribute-based attack vectors are neutralized.
- **Network Mismatch Guards**: Ensures proper banner triggers when wallet network diverges from contract network.
- **Balance Math & Formatting**: Precision checks for stroop-to-XLM conversions, percentage completions, and currency formatting.

---

## 🛠️ Getting Started Locally

### Prerequisites
- **Node.js**: v20.x or v22.x LTS
- **npm**: v10.x+
- **Freighter Wallet Extension**: Installed in Chrome, Brave, or Firefox with Testnet enabled.

### 1. Clone & Install
```bash
git clone https://github.com/StrataFlow-Org/strataflow-web.git
cd strataflow-web
npm install --ignore-scripts
```

### 2. Configure Environment Variables
Create a local `.env.local` configuration file:
```bash
cp .env.example .env.local
```

Example `.env.local`:
```env
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_CONTRACT_ID=CDXVD3AA43SE2D52ZBJSH3RDKAPOYG6OCDAZGSQD6M5TCBQIG3HTLY6J
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3001
NEXT_PUBLIC_STELLAR_EXPERT_URL=https://stellar.expert/explorer/testnet
```

### 3. Run Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the dApp.

### 4. Run Lint & Type Check
```bash
npm run lint
```

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🚢 Deployment Guide

### Vercel (Recommended)
1. Import the repository `StrataFlow-Org/strataflow-web` in the Vercel Dashboard.
2. Select **Next.js** framework preset.
3. Configure Environment Variables matching `.env.example`.
4. Deploy! All routes are statically pre-rendered with dynamic client-side RPC fallbacks.

### Docker Deployment
Build and run the standalone containerized production server:
```bash
docker build -t strataflow-web:latest .
docker run -p 3000:3000 -e NEXT_PUBLIC_CONTRACT_ID=CDXVD3AA43SE2D52ZBJSH3RDKAPOYG6OCDAZGSQD6M5TCBQIG3HTLY6J strataflow-web:latest
```

---

## 📄 License & Governance

- **License**: Licensed under the [MIT License](LICENSE).
- **Security Policy**: See [SECURITY.md](SECURITY.md) for responsible disclosure guidelines.
- **Contributing**: Read [CONTRIBUTING.md](CONTRIBUTING.md) to get involved.
- **Code of Conduct**: Governed by the [Contributor Covenant](CODE_OF_CONDUCT.md).
- **Changelog**: Detailed release history in [CHANGELOG.md](CHANGELOG.md).
