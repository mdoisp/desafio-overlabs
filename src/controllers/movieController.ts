import { Request, Response, NextFunction } from 'express';
import { movieService } from '../services/movieService';

export class MovieController {
  async getFilmes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const includeElenco = req.query.includeElenco === 'true';
      const movies = await movieService.getParsedMovies({ includeElenco });
      res.status(200).json(movies);
    } catch (error) {
      next(error);
    }
  }
}

export const movieController = new MovieController();
