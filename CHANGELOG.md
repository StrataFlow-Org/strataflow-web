# Changelog

All notable changes to the `strataflow-web` repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-11-09

### Security Hardening
- **Entity Escaping**: Added strict HTML entity encoding (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#x27;`) in `input-validator.ts` to neutralize persistent and reflected XSS in deliverable descriptions.
- **Dangerous Scheme Filter**: Restricted deliverable proof URLs strictly to IPFS CIDs (`ipfs://Qm...` and `ipfs://bafy...`) and valid HTTPS URLs; blocked `javascript:`, `data:`, and local file references.
- **Mock Fallback Removal**: Purged deceptive mock preview fallbacks from the agreement detail view (`/agreements/[id]`). Unsynchronized or non-existent agreements now display transparent error states and live synchronization status.
- **Timing Attack Mitigation**: Integrated `crypto.timingSafeEqual` for sensitive client-side token comparisons.
- **Audit Masking**: Integrated `clientSecretMasker` to redact Ed25519 seed keys, bearer tokens, and credentials from console telemetry.

### Added
- **Interactive Stepper Wizard**: Enhanced 3-step agreement creation wizard (`/create`) with live percentage calculator and currency conversions.
- **Freighter Extension Connectivity**: Multi-wallet connection flow with automatic network mismatch banners (Testnet vs. Mainnet).
- **On-Chain Action Tracing**: Integrated Toast notification queue with direct deep-links to StellarExpert for all contract transactions.
- **Test Suite Expansion**: Added comprehensive automated tests across role evaluation, Soroban ScVal serialization, formatting math, and input sanitization, reaching **139 passing tests (100% pass rate)**.
- **Governance Documentation**: Added `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, and updated `README.md`.

### Changed
- **Tooling**: Standardized `npm run lint` script to execute `tsc --noEmit`, ensuring strict type safety and zero interactive prompt blocking in automated CI environments.
- **Limits**: Expanded milestone description length bound to 500 characters to accommodate detailed technical scopes.

---

## [1.0.0] - 2026-11-08

### Added
- **Initial dApp Release**: Production-ready Next.js 14 App Router user interface for the StrataFlow protocol.
- **Tailwind Design System**: Deep Space Slate theme (`#0A0E17`) with emerald release indicators and amber dispute warning badges.
- **Soroban Pipeline**: Built `simulateTransaction` inspector, resource fee calculator, and transaction submission polling service.
- **Agreement Directory**: Searchable agreement console with status filter pills (`Created`, `Funded`, `InProgress`, `Disputed`, `Completed`, `Cancelled`).
- **Connected Testnet Contract**: Deployed contract integration targeting `CDXVD3AA43SE2D52ZBJSH3RDKAPOYG6OCDAZGSQD6M5TCBQIG3HTLY6J`.
