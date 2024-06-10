import initMongoConnection from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const startServer = async () => {
  try {
    await initMongoConnection();
    setupServer();
    console.log('З’єднання з MongoDB встановлено');

  } catch (error) {
    console.error('Помилка при запуску сервера:', error);
  }
};

startServer();
