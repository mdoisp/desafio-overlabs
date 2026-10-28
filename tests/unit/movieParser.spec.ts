import { describe, it, expect } from 'vitest';
import { parseMovie } from '../../src/utils/movieParser';
import { RawMovie } from '../../src/types/movie';

describe('movieParser', () => {
  const sampleMovie: RawMovie = {
    titulo: 'O Poderoso Chefão',
    diretor: 'Francis Ford Coppola',
    ano: 1972,
    genero: ['Crime', 'Drama'],
    duracao: 175,
    ratings: [
      { valor: 9.2, fonte: 'IMDb' },
      { valor: 4.5, fonte: 'Rotten Tomatoes' },
    ],
    elenco: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    sinopse: [
      {
        texto: 'Um chefão da máfia tenta transferir o controle de seu império clandestino para seu filho relutante.',
        idioma: 'pt-br',
      },
      {
        texto: 'A mafia boss tries to transfer control of his clandestine empire to his reluctant son.',
        idioma: 'en',
      },
    ],
    poster: 'link para o poster do filme',
    trailer: 'link para o trailer do filme',
    locacoes: ['Nova York', 'Sicília', 'Las Vegas'],
    orcamento: '$600 milhões',
    bilheteria: '$2 bilhões',
    premios: [
      { nome: 'Oscar de Melhor Filme', relevancia: 10 },
      { nome: 'Oscar de Melhor Ator', relevancia: 8 },
    ],
  };

  it('deve parsear o filme conforme os requisitos e remover campos extras', () => {
    const result = parseMovie(sampleMovie);

    expect(result).toEqual({
      titulo: 'O Poderoso Chefão',
      ano: 1972,
      diretor: 'Francis Ford Coppola',
      genero: ['Crime', 'Drama'],
      duracaoSegundos: 10500,
      notaIMDb: '9.2',
      lucro: '$1.4 bilhões',
      maiorPremiacao: 'Oscar de Melhor Filme',
      sinopse: 'Um chefão da máfia tenta transferir o controle de seu império clandestino para seu filho relutante.',
    });

    expect(result).not.toHaveProperty('locacoes');
    expect(result).not.toHaveProperty('poster');
    expect(result).not.toHaveProperty('trailer');
    expect(result).not.toHaveProperty('duracao');
    expect(result).not.toHaveProperty('ratings');
    expect(result).not.toHaveProperty('orcamento');
    expect(result).not.toHaveProperty('bilheteria');
    expect(result).not.toHaveProperty('premios');
  });

  it('deve permitir incluir elenco opcionalmente via flag', () => {
    const result = parseMovie(sampleMovie, { includeElenco: true });
    expect(result.elenco).toEqual(['Marlon Brando', 'Al Pacino', 'James Caan']);
  });
});
