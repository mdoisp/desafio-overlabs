import { describe, it, expect } from 'vitest';
import { extractSynopsis } from '../../src/utils/synopsisParser';

describe('synopsisParser', () => {
  it('deve priorizar a sinopse em português (pt-br)', () => {
    const sinopses = [
      { idioma: 'fr', texto: 'Texte en français.' },
      { idioma: 'pt-br', texto: 'Texto em português brasileiro.' },
      { idioma: 'en', texto: 'Text in English.' },
    ];
    expect(extractSynopsis(sinopses)).toBe('Texto em português brasileiro.');
  });

  it('deve utilizar a sinopse em inglês caso não haja em português', () => {
    const sinopses = [
      { idioma: 'fr', texto: 'Texte en français.' },
      { idioma: 'en', texto: 'Text in English.' },
    ];
    expect(extractSynopsis(sinopses)).toBe('Text in English.');
  });

  it('deve retornar a primeira ocorrência caso não haja português nem inglês', () => {
    const sinopses = [
      { idioma: 'fr', texto: 'Texte en français.' },
      { idioma: 'es', texto: 'Texto en español.' },
    ];
    expect(extractSynopsis(sinopses)).toBe('Texte en français.');
  });

  it('deve retornar string vazia quando a lista for vazia ou indefinida', () => {
    expect(extractSynopsis([])).toBe('');
    expect(extractSynopsis(undefined)).toBe('');
  });
});
