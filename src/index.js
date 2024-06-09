import initMongoConnection from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const startServer = async () => {
  try {
    await initMongoConnection();
    console.log('З’єднання з MongoDB встановлено');

    const server = setupServer();
    const port = process.env.PORT || 3000;

    server.listen(port, () => {
      console.log(`Сервер запущено на порті ${port}`);
    });
  } catch (error) {
    console.error('Помилка при запуску сервера:', error);
  }
};

startServer();
