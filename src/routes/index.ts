import { Express, json } from "express";
import userRoutes from "./userRoutes";
import urlRoutes from "./urlRoutes";

export default (app: Express) => {
  app.route("/").get((req, res) => res.send({ message: "URL Shortener" }));

  app.use(
    "/api",
    json(),
    userRoutes,
    urlRoutes
  );
};