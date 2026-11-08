export const STROOPS_PER_XLM = BigInt(10_000_000);

/**
 * Converts stroops (integer smallest unit in Stellar) to human-readable XLM string
 */
export function stroopsToXlm(stroops: bigint | string | number): string {
  try {
    const val = BigInt(stroops);
    const whole = val / STROOPS_PER_XLM;
    const remainder = val % STROOPS_PER_XLM;

    if (remainder === BigInt(0)) {
      return whole.toString();
    }

    const padded = remainder.toString().padStart(7, '0').replace(/0+$/, '');
    return `${whole}.${padded}`;
  } catch {
    return '0';
  }
}

/**
 * Converts human-readable XLM decimal string to stroops (BigInt)
 */
export function xlmToStroops(xlm: string | number): bigint {
  const str = xlm.toString().trim();
  if (!str || isNaN(Number(str))) return BigInt(0);

  const parts = str.split('.');
  const whole = BigInt(parts[0] || '0') * STROOPS_PER_XLM;

  if (parts.length > 1) {
    const fractionStr = parts[1].slice(0, 7).padEnd(7, '0');
    return whole + BigInt(fractionStr);
  }

  return whole;
}

/**
 * Formats a numeric string or stroop value with comma thousands separators
 */
export function formatCurrencyAmount(amount: string | number, decimals = 2): string {
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export interface AccountBalances {
  xlm: string;
  tokens: Array<{
    code: string;
    issuer?: string;
    balance: string;
  }>;
}

/**
 * Queries Horizon REST API to retrieve native XLM and token balances for an address
 */
export async function fetchAccountBalances(
  address: string,
  horizonUrl: string = 'https://horizon-testnet.stellar.org'
): Promise<AccountBalances> {
  try {
    const res = await fetch(`${horizonUrl}/accounts/${address}`, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      if (res.status === 404) {
        // Account unfunded on network
        return { xlm: '0.0000000', tokens: [] };
      }
      throw new Error(`Horizon error: ${res.statusText}`);
    }

    const data = await res.json();
    let xlmBalance = '0.0000000';
    const tokens: AccountBalances['tokens'] = [];

    if (Array.isArray(data.balances)) {
      for (const b of data.balances) {
        if (b.asset_type === 'native') {
          xlmBalance = b.balance;
        } else {
          tokens.push({
            code: b.asset_code || 'TOKEN',
            issuer: b.asset_issuer,
            balance: b.balance,
          });
        }
      }
    }

    return { xlm: xlmBalance, tokens };
  } catch (err) {
    console.warn(`Failed to fetch balances for ${address}:`, err);
    return { xlm: '0.0000000', tokens: [] };
  }
}
