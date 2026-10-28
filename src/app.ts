import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { movieController } from './controllers/movieController';

export const app = express();

app.use(cors());
app.use(express.json());

// Rota de Healthcheck
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'API de Filmes Overlabs - Desafio Técnico',
    endpoint: '/filmes',
  });
});

// Rota principal do desafio
app.get('/filmes', (req: Request, res: Response, next: NextFunction) => {
  movieController.getFilmes(req, res, next);
});

// Middleware de tratamento global de erros
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno no servidor.';

  res.status(statusCode).json({
    error: true,
    message,
  });
});
