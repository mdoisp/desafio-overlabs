export function parseMonetaryValue(value: string): number {
  if (!value || typeof value !== 'string') return 0;

  const sanitized = value.trim().toLowerCase().replace(/[^0-9.,a-zá-ú]/gi, ' ');
  const match = sanitized.match(/([0-9]+(?:[.,][0-9]+)?)\s*(milh[ãa]o|milh[õo]es|bilh[ãa]o|bilh[õo]es|mil)?/i);

  if (!match) return 0;

  const rawNumberStr = match[1].replace(',', '.');
  const numericValue = parseFloat(rawNumberStr);
  const scale = match[2]?.toLowerCase();

  if (isNaN(numericValue)) return 0;

  if (!scale) return numericValue;

  if (scale.startsWith('bilh')) {
    return Math.round(numericValue * 1_000_000_000);
  }

  if (scale.startsWith('milh')) {
    return Math.round(numericValue * 1_000_000);
  }

  if (scale === 'mil') {
    return Math.round(numericValue * 1_000);
  }

  return numericValue;
}

export function formatMonetaryValue(value: number): string {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const prefix = isNegative ? '-$' : '$';

  if (absValue >= 1_000_000_000) {
    const inBillions = absValue / 1_000_000_000;
    const formatted = parseFloat(inBillions.toFixed(3));
    const suffix = formatted === 1 ? 'bilhão' : 'bilhões';
    return `${prefix}${formatted} ${suffix}`;
  }

  if (absValue >= 1_000_000) {
    const inMillions = absValue / 1_000_000;
    const formatted = parseFloat(inMillions.toFixed(3));
    const suffix = formatted === 1 ? 'milhão' : 'milhões';
    return `${prefix}${formatted} ${suffix}`;
  }

  if (absValue >= 1_000) {
    const inThousands = absValue / 1_000;
    const formatted = parseFloat(inThousands.toFixed(3));
    return `${prefix}${formatted} mil`;
  }

  return `${prefix}${absValue}`;
}

export function calculateProfit(orcamento: string, bilheteria: string): string {
  const orcamentoNum = parseMonetaryValue(orcamento);
  const bilheteriaNum = parseMonetaryValue(bilheteria);

  const profit = bilheteriaNum - orcamentoNum;
  return formatMonetaryValue(profit);
}
