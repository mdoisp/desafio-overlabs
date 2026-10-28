import { app } from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.log(`Servidor rodando na porta ${env.PORT}`);
  console.log(`Endpoint disponível em: http://localhost:${env.PORT}/filmes`);
});

export default server;
