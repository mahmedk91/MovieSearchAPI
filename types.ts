type DBMovie = {
  id: Number;
  imdbId: String;
  duration: Number;
  description: String;
  title: String;
  userrating: {
    countStar1: Number;
    countStar2: Number;
    countStar3: Number;
    countStar4: Number;
    countStar5: Number;
    countTotal: Number;
  };
};

type Rating = {
  Source: String;
  Value: String;
};

type OMDBMovie = {
  imdbId: String;
  Title: String;
  Plot?: String;
  Runtime?: String;
  Ratings?: Array<Rating>;
  Director?: String;
  Writer?: String;
  Actors?: String;
};

type MergedMovie = {
  id: Number;
  imdbId: String;
  description: String;
  title: String;
  Runtime?: String;
  Ratings?: Array<Rating>;
  Director?: String | Array<String>;
  Writer?: String | Array<String>;
  Actors?: String | Array<String>;
};

export { DBMovie, Rating, OMDBMovie, MergedMovie };
