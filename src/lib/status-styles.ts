export class StatusStyles {
  public static getMilestoneBadge(status: string): { label: string; bg: string; text: string } {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return { label: 'Approved', bg: 'bg-emerald-500/10', text: 'text-emerald-400' };
      case 'SUBMITTED':
        return { label: 'In Review', bg: 'bg-blue-500/10', text: 'text-blue-400' };
      case 'DISPUTED':
        return { label: 'Disputed', bg: 'bg-amber-500/10', text: 'text-amber-400' };
      default:
        return { label: 'Pending', bg: 'bg-slate-500/10', text: 'text-slate-400' };
    }
  }
}
