export interface RawRating {
  valor: number;
  fonte: string;
}

export interface RawSinopse {
  texto: string;
  idioma: string;
}

export interface RawPremio {
  nome: string;
  relevancia: number;
}

export interface RawMovie {
  titulo: string;
  diretor: string;
  ano: number;
  genero: string[];
  duracao: number;
  ratings?: RawRating[];
  elenco?: string[];
  sinopse?: RawSinopse[];
  poster?: string;
  trailer?: string;
  locacoes?: string[];
  orcamento: string;
  bilheteria: string;
  premios?: RawPremio[];
}

export interface RawApiResponse {
  filmes: RawMovie[];
}

export interface ParsedMovie {
  titulo: string;
  ano: number;
  diretor: string;
  genero: string[];
  duracaoSegundos: number;
  notaIMDb: string;
  lucro: string;
  maiorPremiacao: string | null;
  sinopse: string;
  elenco?: string[];
}
