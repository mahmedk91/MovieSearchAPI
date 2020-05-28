import express from "express";
import bodyParser from "body-parser";
import MoviesRouter from "./routes/moviesRouter";

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    this.express.use("/api/movies", MoviesRouter);
  }
}

export default new App().express;
