import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';

describe('Integração - Rotas da API', () => {
  it('GET / deve retornar status 200 e informações da API', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('endpoint', '/filmes');
  });

  it('GET /filmes deve retornar a lista de filmes parseados conforme requisitos', async () => {
    const res = await request(app).get('/filmes');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const firstMovie = res.body[0];

    expect(firstMovie).toHaveProperty('titulo');
    expect(firstMovie).toHaveProperty('ano');
    expect(firstMovie).toHaveProperty('diretor');
    expect(firstMovie).toHaveProperty('genero');
    expect(firstMovie).toHaveProperty('duracaoSegundos');
    expect(firstMovie).toHaveProperty('notaIMDb');
    expect(firstMovie).toHaveProperty('lucro');
    expect(firstMovie).toHaveProperty('maiorPremiacao');
    expect(firstMovie).toHaveProperty('sinopse');

    expect(typeof firstMovie.duracaoSegundos).toBe('number');
    expect(typeof firstMovie.notaIMDb).toBe('string');
    expect(typeof firstMovie.lucro).toBe('string');
    expect(typeof firstMovie.sinopse).toBe('string');

    expect(firstMovie).not.toHaveProperty('locacoes');
    expect(firstMovie).not.toHaveProperty('poster');
    expect(firstMovie).not.toHaveProperty('trailer');
    expect(firstMovie).not.toHaveProperty('duracao');
    expect(firstMovie).not.toHaveProperty('ratings');
    expect(firstMovie).not.toHaveProperty('orcamento');
    expect(firstMovie).not.toHaveProperty('bilheteria');
    expect(firstMovie).not.toHaveProperty('premios');
  });

  it('GET /filmes?includeElenco=true deve incluir elenco quando solicitado', async () => {
    const res = await request(app).get('/filmes?includeElenco=true');

    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('elenco');
    expect(Array.isArray(res.body[0].elenco)).toBe(true);
  });
});
