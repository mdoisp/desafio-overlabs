import { RawSinopse } from '../types/movie';

/**
 * Seleciona uma única sinopse com base na seguinte ordem de prioridade:
 * 1. Português do Brasil ('pt-br' ou 'pt')
 * 2. Inglês ('en')
 * 3. Primeira ocorrência disponível
 */
export function extractSynopsis(sinopses?: RawSinopse[]): string {
  if (!sinopses || !Array.isArray(sinopses) || sinopses.length === 0) {
    return '';
  }

  // 1. Prioridade: Português (Brasil)
  const ptSynopsis = sinopses.find((item) => {
    const lang = item.idioma?.toLowerCase().trim();
    return lang === 'pt-br' || lang === 'pt';
  });

  if (ptSynopsis?.texto) {
    return ptSynopsis.texto;
  }

  // 2. Prioridade: Inglês
  const enSynopsis = sinopses.find((item) => {
    const lang = item.idioma?.toLowerCase().trim();
    return lang === 'en';
  });

  if (enSynopsis?.texto) {
    return enSynopsis.texto;
  }

  // 3. Fallback: primeira ocorrência disponível
  const fallbackSynopsis = sinopses.find((item) => Boolean(item.texto));
  return fallbackSynopsis?.texto ?? '';
}
