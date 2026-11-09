# Contributing to StrataFlow Web

Thank you for your interest in contributing to **StrataFlow Web**! This project is an open-source decentralized application built on the Stellar network.

---

## 🛠️ Development Setup

### 1. Prerequisites
- **Node.js**: v20.x or v22.x LTS
- **npm**: v10.x+
- **Git**: Modern git client configured with your developer identity
- **Freighter Wallet Extension**: Installed with Stellar Testnet enabled

### 2. Local Setup
```bash
# Clone repository
git clone https://github.com/StrataFlow-Org/strataflow-web.git
cd strataflow-web

# Install dependencies (respecting lockfile)
npm install --ignore-scripts

# Configure local environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 🧪 Testing & Code Quality Standards

Every submission must pass automated verification prior to pull request acceptance:

```bash
# Execute full unit and integration test suite (139 tests)
npm test

# Verify TypeScript compilation and type safety
npm run lint

# Compile production bundle
npm run build
```

---

## 🌿 Git Branch & Commit Workflow

1. Fork or branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Follow Conventional Commits:
   - `feat(scope): add new feature`
   - `fix(scope): resolve bug or security vulnerability`
   - `test(scope): add test assertions`
   - `docs(scope): update documentation`
3. Ensure no secrets, keys, or unnecessary binaries are staged.
4. Submit your pull request with a descriptive summary of your changes.

---

## 📜 Code of Conduct

All contributors are expected to uphold the standards described in our [Code of Conduct](CODE_OF_CONDUCT.md).
