import express from 'express';
import { connectDatabase } from './dataSource';
import urlRoutes from './routes/urlRoutes';

const app = express(),
  PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(urlRoutes);

app.use((err: Error, req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log('TypeORM connection error: ', error));
