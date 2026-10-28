import { env } from '../config/env';
import { RawApiResponse, RawMovie } from '../types/movie';

export class MovieApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = env.FILMES_API_URL) {
    this.baseUrl = baseUrl;
  }

  async fetchRawMovies(): Promise<RawMovie[]> {
    if (!this.baseUrl) {
      throw new Error(
        'A variável de ambiente FILMES_API_URL não foi configurada. Crie o arquivo .env a partir de .env.example informando a URL da API.'
      );
    }

    try {
      const response = await fetch(this.baseUrl, {
        signal: AbortSignal.timeout(10_000),
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
