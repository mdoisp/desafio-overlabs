import { RawMovie, ParsedMovie } from '../types/movie';
import { calculateProfit } from './currencyParser';
import { extractSynopsis } from './synopsisParser';
import { extractTopAward } from './awardParser';
import { extractImdbRating } from './ratingParser';

export interface ParseMovieOptions {
  includeElenco?: boolean;
}

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

export function parseMovieList(movies: RawMovie[], options: ParseMovieOptions = {}): ParsedMovie[] {
  return movies.map((movie) => parseMovie(movie, options));
}
