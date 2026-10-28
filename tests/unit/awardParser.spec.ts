import { describe, it, expect } from 'vitest';
import { extractTopAward } from '../../src/utils/awardParser';

describe('awardParser', () => {
  it('deve retornar a premiação com maior relevância', () => {
    const premios = [
      { nome: 'Oscar de Melhor Ator', relevancia: 8 },
      { nome: 'Oscar de Melhor Filme', relevancia: 10 },
      { nome: 'BAFTA', relevancia: 7 },
    ];
    expect(extractTopAward(premios)).toBe('Oscar de Melhor Filme');
  });

  it('deve retornar null se a lista for vazia ou indefinida', () => {
    expect(extractTopAward([])).toBeNull();
    expect(extractTopAward(undefined)).toBeNull();
  });
});
