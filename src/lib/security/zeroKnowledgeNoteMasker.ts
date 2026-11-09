export function maskPrivateNotes(notes: string, preserveLength = false): string {
  if (!notes) return '';
  if (preserveLength) {
    return '*'.repeat(notes.length);
  }
  return '[CONFIDENTIAL_PAYLOAD_REDACTED]';
}
