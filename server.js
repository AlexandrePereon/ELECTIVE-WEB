import './config/config.js';
import express from 'express';
import path, { dirname } from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import database from './db/index.js';
import routes from './routes/index.js';
import prometheusRouter from './routes/prometheusRoutes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//  adding routes
app.use(process.env.BASE_ENDPOINT, routes);
app.use(prometheusRouter);

const connectWithRetry = async () => {
  try {
    await database.authenticate();
    console.log('Database connected');

    // Migrate if there are any pending migrations
    database.sync({ alter: true })
      .then(() => {
        console.log('Database migrated');
        app.emit('dbReady');
      })
      .catch((err) => {
        console.error('Unable to migrate:', err);
      });
  } catch (error) {
    console.log('Unable to connect to the database');
    console.log('Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

app.listen(process.env.PORT, () => {
  console.log('Server is up on port', (process.env.PORT));
  connectWithRetry();
});

export default app;
