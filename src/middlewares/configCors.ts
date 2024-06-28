import { Express } from "express";
import cors, { CorsOptions } from "cors";

export default (app: Express) => {
  const options: CorsOptions = {
    origin: "*",
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, api-key"
  };

  app.use(cors(options));
};
