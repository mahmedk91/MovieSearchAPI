import axios from "axios";
import { OMDBMovie } from "../types";

export default class OMDBService {
  private static OMDB_BASE_URL: string = "http://www.omdbapi.com";
  private static OMDB_API_KEY: string = "";

  // Get movie from OMDB given imdbId
  public static async getMovie(imdbId: String): Promise<OMDBMovie> {
    let response: any = Object;
    try {
      response = await axios.get(this.OMDB_BASE_URL, {
        params: {
          apikey: this.OMDB_API_KEY,
          plot: "full",
          i: imdbId,
        },
      });
    } catch (error) {
      // On error log the error
      console.log(error.message);
      return;
    }
    if (
      response.data &&
      response.data.Response &&
      response.data.Response === "True" &&
      response.data.imdbID
    ) {
      // Correct the imdbId attribute
      response.data.imdbId = response.data.imdbID;
      delete response.data.imdbID;
      return response.data;
    }
    return;
  }
}
