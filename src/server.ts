import express from "express";
import routes from "./routes";
import configCors from "./middlewares/configCors";
import { getEnv } from "./utils/env";

const app = express();

routes(app);
configCors(app);

app.listen(getEnv("PORT"), () => console.log(`Server is running on ${getEnv("PORT")} PORT.`));
