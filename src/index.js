import initMongoConnection from './db/initMongoConnection.js';

const startServer = async () => {
  await initMongoConnection();

  // Тут можна запустити ваш сервер
  console.log('Server is running...');
};

startServer();
