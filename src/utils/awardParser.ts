import { RawPremio } from '../types/movie';

export function extractTopAward(premios?: RawPremio[]): string | null {
  if (!premios || !Array.isArray(premios) || premios.length === 0) {
    return null;
  }

  const topAward = premios.reduce((highest, current) => {
    return (current.relevancia ?? 0) > (highest.relevancia ?? 0) ? current : highest;
  }, premios[0]);

  return topAward?.nome ?? null;
}
