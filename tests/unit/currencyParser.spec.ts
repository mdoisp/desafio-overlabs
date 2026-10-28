import { describe, it, expect } from 'vitest';
import {
  parseMonetaryValue,
  formatMonetaryValue,
  calculateProfit,
} from '../../src/utils/currencyParser';

describe('currencyParser', () => {
  describe('parseMonetaryValue', () => {
    it('deve converter valores em milhões corretamente', () => {
      expect(parseMonetaryValue('$6 milhões')).toBe(6_000_000);
      expect(parseMonetaryValue('$165 milhões')).toBe(165_000_000);
      expect(parseMonetaryValue('$3.3 milhões')).toBe(3_300_000);
      expect(parseMonetaryValue('$1 milhão')).toBe(1_000_000);
    });

    it('deve converter valores em bilhões corretamente', () => {
      expect(parseMonetaryValue('$2 bilhões')).toBe(2_000_000_000);
      expect(parseMonetaryValue('$1.142 bilhão')).toBe(1_142_000_000);
      expect(parseMonetaryValue('$2.208 bilhões')).toBe(2_208_000_000);
    });

    it('deve lidar com valores vazios ou inválidos', () => {
      expect(parseMonetaryValue('')).toBe(0);
      expect(parseMonetaryValue('inválido')).toBe(0);
    });
  });

  describe('formatMonetaryValue', () => {
    it('deve formatar valores em bilhões corretamente', () => {
      expect(formatMonetaryValue(1_400_000_000)).toBe('$1.4 bilhões');
      expect(formatMonetaryValue(1_000_000_000)).toBe('$1 bilhão');
      expect(formatMonetaryValue(2_008_000_000)).toBe('$2.008 bilhões');
    });

    it('deve formatar valores em milhões corretamente', () => {
      expect(formatMonetaryValue(239_000_000)).toBe('$239 milhões');
      expect(formatMonetaryValue(1_000_000)).toBe('$1 milhão');
      expect(formatMonetaryValue(26_700_000)).toBe('$26.7 milhões');
    });

    it('deve formatar valores negativos', () => {
      expect(formatMonetaryValue(-50_000_000)).toBe('-$50 milhões');
    });
  });

  describe('calculateProfit', () => {
    it('deve calcular o lucro entre bilheteria e orçamento', () => {
      expect(calculateProfit('$6 milhões', '$245 milhões')).toBe('$239 milhões');
      expect(calculateProfit('$165 milhões', '$677 milhões')).toBe('$512 milhões');
      expect(calculateProfit('$94 milhões', '$1.142 bilhão')).toBe('$1.048 bilhões');
      expect(calculateProfit('$3.3 milhões', '$30 milhões')).toBe('$26.7 milhões');
      expect(calculateProfit('$200 milhões', '$2.208 bilhões')).toBe('$2.008 bilhões');
      expect(calculateProfit('$600 milhões', '$2 bilhões')).toBe('$1.4 bilhões');
    });
  });
});
