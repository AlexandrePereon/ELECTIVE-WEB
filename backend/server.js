import "./config/config.js";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { connect} from "./db/index.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import routes from "./routes/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

//connection from db here
connect(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//  adding routes
routes(app);

app.on("ready", () => {
  app.listen(3000, () => {
    console.log("Server is up on port", 3000);
  });
});

export default app;
