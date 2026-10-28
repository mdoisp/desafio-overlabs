import { RawMovie, ParsedMovie } from '../types/movie';
import { calculateProfit } from './currencyParser';
import { extractSynopsis } from './synopsisParser';
import { extractTopAward } from './awardParser';
import { extractImdbRating } from './ratingParser';

export interface ParseMovieOptions {
  includeElenco?: boolean;
}

/**
 * Transforma um objeto de filme bruto no formato exigido pela plataforma.
 * Converte duração para segundos, calcula lucro, seleciona maior premiação,
 * extrai nota IMDb, resolve sinopse prioritária e remove campos desnecessários.
 */
export function parseMovie(movie: RawMovie, options: ParseMovieOptions = {}): ParsedMovie {
  const duracaoSegundos = (movie.duracao ?? 0) * 60;
  const lucro = calculateProfit(movie.orcamento, movie.bilheteria);
  const maiorPremiacao = extractTopAward(movie.premios);
  const notaIMDb = extractImdbRating(movie.ratings);
  const sinopse = extractSynopsis(movie.sinopse);

  const parsed: ParsedMovie = {
    titulo: movie.titulo,
    ano: movie.ano,
    diretor: movie.diretor,
    genero: movie.genero,
    duracaoSegundos,
    notaIMDb,
    lucro,
    maiorPremiacao,
    sinopse,
  };

  if (options.includeElenco && movie.elenco) {
    parsed.elenco = movie.elenco;
  }

  return parsed;
}

/**
 * Mapeia uma lista de filmes brutos para o formato parseado.
 */
export function parseMovieList(movies: RawMovie[], options: ParseMovieOptions = {}): ParsedMovie[] {
  return movies.map((movie) => parseMovie(movie, options));
}
