import { env } from '../config/env';
import { RawApiResponse, RawMovie } from '../types/movie';

export class MovieApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = env.FILMES_API_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Realiza a requisição HTTP para a API externa de metadados.
   */
  async fetchRawMovies(): Promise<RawMovie[]> {
    try {
      const response = await fetch(this.baseUrl, {
        signal: AbortSignal.timeout(10000), // Timeout de 10s
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Falha ao obter dados da API externa: status ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as RawApiResponse;

      if (!data || !Array.isArray(data.filmes)) {
        throw new Error('Formato inesperado de resposta da API de filmes.');
      }

      return data.filmes;
    } catch (error: any) {
      if (error.name === 'TimeoutError') {
        throw new Error('Tempo limite esgotado ao conectar à API externa de filmes.');
      }
      throw error;
    }
  }
}

export const movieApiClient = new MovieApiClient();
