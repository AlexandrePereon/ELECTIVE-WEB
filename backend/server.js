import './config/config.js';
import express from 'express';
import path, { dirname } from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import connect from './db/index.js';

import routes from './routes/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// connection from db here
connect(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//  adding routes
routes(app);

app.on("ready", () => {
  app.listen(process.env.PORT, () => {
    console.log("Server is up on port", (process.env.PORT));
  });
});

export default app;
