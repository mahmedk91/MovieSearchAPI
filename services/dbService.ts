import { DBMovie } from "../types";
import fs from "fs";

export default class DBService {
  private static DB_FILE_PATH: string = "dist/movies/data.json";

  // Fetches all movies
  public static getAllMovies(): Array<DBMovie> {
    return this.loadMoviesFromDB();
  }

  // Fetches movie with id or imdbId
  public static getMovie(id: String): DBMovie {
    return this.loadMoviesFromDB().find(
      movie => String(movie.id) === id || movie.imdbId === id
    );
  }

  // Load all movies from data.json
  private static loadMoviesFromDB(): Array<DBMovie> {
    const rawdata = fs.readFileSync(this.DB_FILE_PATH);
    const movies: Array<DBMovie> = JSON.parse(String(rawdata));
    return movies;
  }
}
