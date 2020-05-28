import { Router, Request, Response } from "express";
import DBService from "../services/dbService";
import OMDBService from "../services/omdbService";
import Utils from "../services/utils";
import { DBMovie, OMDBMovie, MergedMovie } from "../types";

export class MoviesRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    this.router.get("/", this.searchMovies);
    this.router.get("/:id", this.getEnrichedMovie);
  }

  public async searchMovies(req: Request, res: Response) {
    // Get all movies from store
    const dbMovies: Array<DBMovie> = DBService.getAllMovies();

    // movies matching search query
    let searchedMovies: Array<MergedMovie> = new Array<MergedMovie>();

    // Enrich all store movies from OMDB
    for (const dbMovie of dbMovies) {
      const omdbMovie: OMDBMovie = await OMDBService.getMovie(dbMovie.imdbId);
      if (omdbMovie) {
        searchedMovies.push(Utils.mergeMovie(dbMovie, omdbMovie));
      }
    }

    // Perform search on the list of movies
    for (const searchField in req.query) {
      searchedMovies = Utils.searchMovies(
        searchedMovies,
        searchField,
        req.query[searchField]
      );
    }

    // return all matched movies
    res.status(200).send(searchedMovies);
  }

  public async getEnrichedMovie(req: Request, res: Response) {
    // Get id or imdbId from request params
    const id: String = req.params.id;

    // Get movie from store
    const storedMovie: DBMovie = DBService.getMovie(id);

    if (!storedMovie) {
      // Not found in store -> search in OMDB
      const omdbMovie: OMDBMovie = await OMDBService.getMovie(id);
      if (!omdbMovie) {
        // Not found in OMDB then -> return 404
        res.status(404).send({
          message: `No movie found with id or imdbID ${id}`,
          status: res.status
        });
        return;
      }

      // Found in OMDB -> return OMDB movie
      res.status(200).send(omdbMovie);
      return;
    }

    // Found in store -> search in OMDB with imdbId
    const omdbMovie: OMDBMovie = await OMDBService.getMovie(storedMovie.imdbId);
    if (!omdbMovie) {
      // Not found in OMDB -> return only store movie
      res.status(200).send(storedMovie);
      return;
    }

    // Found in OMDB -> combine store and OMDB movie
    res.status(200).send(Utils.mergeMovie(storedMovie, omdbMovie));
    return;
  }
}

const movieRoutes = new MoviesRouter();

export default movieRoutes.router;
