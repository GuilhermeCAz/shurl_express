import express from 'express';
import { connectDatabase } from './dataSource.js';
import authRoutes from './routes/authRoutes.js';
import urlRoutes from './routes/urlRoutes.js';

const app = express(),
  PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(authRoutes);
app.use(urlRoutes);

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log('TypeORM connection error: ', error));

export default app;
