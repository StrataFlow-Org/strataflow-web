/**
 * Client-Side Input Sanitization & Validation Helpers.
 * Protects against XSS, input overflow, and malformed URLs.
 */

export function sanitizeInputText(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*(?:["'][^"']*["']|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '')
    .trim();
}

export function isValidDeliverableUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  const trimmed = url.trim();

  // Allow IPFS URIs: ipfs://Qm... or ipfs://bafy...
  if (trimmed.startsWith('ipfs://')) {
    return /^ipfs:\/\/[a-zA-Z0-9_-]{40,}$/.test(trimmed);
  }

  // Allow HTTPS URLs
  if (trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  return false;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateAgreementMetadata(title: string, description: string): ValidationResult {
  const errors: string[] = [];

  const cleanTitle = sanitizeInputText(title);
  if (cleanTitle.length < 3) {
    errors.push('Agreement title must be at least 3 characters long.');
  }
  if (cleanTitle.length > 120) {
    errors.push('Agreement title cannot exceed 120 characters.');
  }

  const cleanDesc = sanitizeInputText(description);
  if (cleanDesc.length > 2000) {
    errors.push('Agreement description cannot exceed 2000 characters.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateMilestoneInput(description: string, amount: number | string): ValidationResult {
  const errors: string[] = [];

  const cleanDesc = sanitizeInputText(description);
  if (cleanDesc.length < 3) {
    errors.push('Milestone description must be at least 3 characters long.');
  }
  if (cleanDesc.length > 500) {
    errors.push('Milestone description cannot exceed 500 characters.');
  }

  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    errors.push('Milestone amount must be a positive number greater than 0.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
