import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', '.well-known', 'stellar.toml');
  try {
    const tomlContent = fs.readFileSync(filePath, 'utf8');
    return new NextResponse(tomlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    const fallbackToml = `# SEP-0001: StrataFlow Protocol Configuration
VERSION="2.0.0"

[DOCUMENTATION]
ORG_NAME="StrataFlow Protocol"
ORG_URL="https://strataflow.network"
ORG_DESCRIPTION="Decentralized autonomous milestone escrow protocol on Stellar and Soroban"
ORG_OFFICIAL_EMAIL="security@strataflow.network"
ORG_GITHUB="https://github.com/StrataFlow-Org"

[NETWORK_PASSPHRASE]
TESTNET="Test SDF Network ; September 2015"
PUBLIC="Public Global Stellar Network ; September 2015"

[ACCOUNTS]
ACCOUNTS=["GBBD47IF6LWK7P7MDEVTESTWINNINGTALKER2026COMMITS"]

[CONTRACTS]
STRATAFLOW_ESCROW="CDXVD3AA43SE2D52ZBJSH3RDKAPOYG6OCDAZGSQD6M5TCBQIG3HTLY6J"
`;
    return new NextResponse(fallbackToml, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
