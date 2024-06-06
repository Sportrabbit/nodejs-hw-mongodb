import initMongoConnection from '../src/db/initMongoConnection.js';
// src/index.js

const startServer = async () => {
  await initMongoConnection();

  // Тут можна запустити ваш сервер
  console.log('Server is running...');
};

startServer();

