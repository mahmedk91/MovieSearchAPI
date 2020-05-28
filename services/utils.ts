import { DBMovie, OMDBMovie, Rating, MergedMovie } from "../types";

export default class Utils {
  // merges store and omdb movie
  public static mergeMovie(
    storeMovie: DBMovie,
    omdbMovie: OMDBMovie
  ): MergedMovie {
    // Title overwrites title
    if (omdbMovie.Title) {
      storeMovie.title = omdbMovie.Title;
      delete omdbMovie.Title;
    }

    // Plot overwrites description
    if (omdbMovie.Plot) {
      storeMovie.description = omdbMovie.Plot;
      delete omdbMovie.Plot;
    }

    // duration overwrites Runtime
    if (storeMovie.duration) {
      omdbMovie.Runtime = String(storeMovie.duration) + " min";
      delete storeMovie.duration;
    }

    // userratings calculation and addition with other ratings
    if (storeMovie.userrating) {
      omdbMovie.Ratings.push(this.addAvgUserRating(storeMovie.userrating));
      delete storeMovie.userrating;
    }

    // merging all other fields without transformation
    let mergedMovie: MergedMovie = { ...storeMovie, ...omdbMovie };

    // Director, Writer, Actors transformed to list from string
    if (omdbMovie.Director) {
      mergedMovie.Director = omdbMovie.Director.split(", ");
    }
    if (omdbMovie.Writer) {
      mergedMovie.Writer = omdbMovie.Writer.split(", ");
    }
    if (omdbMovie.Actors) {
      mergedMovie.Actors = omdbMovie.Actors.split(", ");
    }

    return mergedMovie;
  }

  // Calculate the average user star ratings
  protected static addAvgUserRating(userRating: any): Rating {
    const totalStars =
      userRating.countStar5 * 5 +
      userRating.countStar4 * 4 +
      userRating.countStar3 * 3 +
      userRating.countStar2 * 2 +
      userRating.countStar1 * 1;
    const avgRating = totalStars / userRating.countTotal;
    return {
      Source: "User Rating",
      Value: String(avgRating.toPrecision(2)) + "/5.0"
    };
  }

  // Method to search a term of in a field in given list of movies
  public static searchMovies(
    movies: Array<MergedMovie>,
    searchField: string,
    searchTerm: String
  ): Array<MergedMovie> {
    // Convert both field and term in lowercase
    searchField = searchField.toLowerCase();
    searchTerm = searchTerm.toLowerCase();

    // filter movies matching search
    return movies.filter(movie =>
      this.searchMovie(movie, searchField, searchTerm)
    );
  }

  // Checks if movie matches search field and search term
  // returns true if search term is found
  private static searchMovie(
    movie: MergedMovie,
    searchField: string,
    searchTerm: String
  ): boolean {
    // lowercase all keys of movie
    for (const [key, value] of Object.entries(movie)) {
      movie[key.toLowerCase()] = value;
    }

    // No such field in movie -> return false
    if (!movie[searchField]) {
      return false;
    }

    if (typeof movie[searchField] === "string") {
      // if search field is string check equality
      return movie[searchField].toLowerCase() === searchTerm;
    } else if (typeof movie[searchField] === "number") {
      // if search field is number check equality
      return String(movie[searchField]) === searchTerm;
    } else if (Array.isArray(movie[searchField])) {
      // if search field is array check if array contains search term
      movie[searchField] = movie[searchField].map(v => v.toLowerCase());
      return movie[searchField].includes(searchTerm);
    }

    // search didn't match this movie
    return false;
  }
}
