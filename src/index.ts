import app from './app.js';
import { prisma } from './db/client.js';

const port = 3333;

const starterServer = async () => {
  try {
    await prisma.$connect();

    await prisma.$queryRaw`SELECT 1`;

    console.log('Banco conectado');

    return app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Erro ao conectar ao banco', err);
    process.exit(1);
  }
};

starterServer();
