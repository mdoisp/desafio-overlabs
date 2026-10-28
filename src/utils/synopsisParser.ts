import { RawSinopse } from '../types/movie';

export function extractSynopsis(sinopses?: RawSinopse[]): string {
  if (!sinopses || !Array.isArray(sinopses) || sinopses.length === 0) {
    return '';
  }

  const ptSynopsis = sinopses.find((item) => {
    const lang = item.idioma?.toLowerCase().trim();
    return lang === 'pt-br' || lang === 'pt';
  });

  if (ptSynopsis?.texto) {
    return ptSynopsis.texto;
  }

  const enSynopsis = sinopses.find((item) => {
    const lang = item.idioma?.toLowerCase().trim();
    return lang === 'en';
  });

  if (enSynopsis?.texto) {
    return enSynopsis.texto;
  }

  const fallbackSynopsis = sinopses.find((item) => Boolean(item.texto));
  return fallbackSynopsis?.texto ?? '';
}
