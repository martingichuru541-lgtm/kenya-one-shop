import { Currency } from '../types';
import { CURRENCY_RATES } from '../data/initialData';

export function formatCurrency(amountKes: number, currency: Currency = 'KES'): string {
  const rate = CURRENCY_RATES[currency] || 1;
  const converted = amountKes * rate;

  switch (currency) {
    case 'KES':
      return `KES ${Math.round(converted).toLocaleString('en-KE')}`;
    case 'USD':
      return `$${converted.toFixed(2)}`;
    case 'GBP':
      return `£${converted.toFixed(2)}`;
    case 'EUR':
      return `€${converted.toFixed(2)}`;
    default:
      return `KES ${Math.round(amountKes).toLocaleString('en-KE')}`;
  }
}

export function formatAuctionCountdown(msRemaining: number): { text: string; isUrgent: boolean; isEnded: boolean } {
  if (msRemaining <= 0) {
    return { text: '00:00:00', isUrgent: false, isEnded: true };
  }

  const totalSeconds = Math.floor(msRemaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedH = String(hours).padStart(2, '0');
  const paddedM = String(minutes).padStart(2, '0');
  const paddedS = String(seconds).padStart(2, '0');

  const text = hours > 0 ? `${paddedH}:${paddedM}:${paddedS}` : `${paddedM}:${paddedS}`;
  const isUrgent = totalSeconds < 30;

  return { text, isUrgent, isEnded: false };
}

export function generateMpesaReceipt(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const prefix = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  const middle = Math.floor(100000 + Math.random() * 900000);
  const suffix = Array.from({ length: 2 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  return `${prefix}${middle}${suffix}`;
}

export function generateOrderNumber(): string {
  return `K1-${Math.floor(10000 + Math.random() * 90000)}`;
}
