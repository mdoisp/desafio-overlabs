import { RawRating } from '../types/movie';

/**
 * Extrai a nota do IMDb do array de ratings e a retorna como string.
 */
export function extractImdbRating(ratings?: RawRating[]): string {
  if (!ratings || !Array.isArray(ratings) || ratings.length === 0) {
    return '';
  }

  const imdbRating = ratings.find((r) => r.fonte?.toLowerCase().trim() === 'imdb');

  if (!imdbRating || imdbRating.valor === undefined || imdbRating.valor === null) {
    return '';
  }

  return imdbRating.valor.toString();
}
