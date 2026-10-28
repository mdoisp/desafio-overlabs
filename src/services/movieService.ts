import { ParsedMovie } from '../types/movie';
import { MovieApiClient, movieApiClient } from './movieApiClient';
import { parseMovieList, ParseMovieOptions } from '../utils/movieParser';

export class MovieService {
  constructor(private readonly client: MovieApiClient = movieApiClient) {}

  /**
   * Obtém os filmes da API de metadados e os retorna devidamente parseados.
   */
  async getParsedMovies(options?: ParseMovieOptions): Promise<ParsedMovie[]> {
    const rawMovies = await this.client.fetchRawMovies();
    return parseMovieList(rawMovies, options);
  }
}

export const movieService = new MovieService();
