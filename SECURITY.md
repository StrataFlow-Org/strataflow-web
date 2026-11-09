# Security Policy

## 🔒 Reporting Security Vulnerabilities

The StrataFlow team takes client-side security, wallet integrity, and non-custodial asset protection seriously. If you discover a vulnerability or potential exploit:

**Please DO NOT open a public issue.**

Instead, report it responsibly via our security channel:
- **Email**: `security@strataflow.io`
- **Subject**: `[Security Vulnerability]: StrataFlow Web`

### Please Include in Your Report:
1. **Description**: Clear description of the vulnerability and attack scenario.
2. **Steps to Reproduce**: Proof of concept (PoC) or reproduction steps.
3. **Impact**: Potential severity (e.g., XSS execution, unintended transaction signing, session token hijacking).
4. **Suggested Remediation**: Any code recommendations or patches if available.

### Response SLA
- **Initial Acknowledgment**: Within 24-48 hours.
- **Triage & Remediation Timeline**: Within 5-7 business days for critical issues.
- **Public Disclosure**: Coordinated following patch deployment.

---

## 🛡️ Security Architecture Highlights

1. **Strict Non-Custodial Architecture**: The application never touches or stores secret seeds (`S...`). All signatures are executed exclusively in the user's Freighter wallet extension.
2. **Defensive Input Neutralization**: All user milestone inputs and descriptions are sanitized with strict HTML entity encoding.
3. **URL Scheme Restrictions**: Deliverables strictly require IPFS URIs (`ipfs://`) or secure HTTPS links (`https://`).
4. **Zero Third-Party Tracking**: No external telemetry trackers or analytical third-party cookies.
