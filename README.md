# Movie Metadata Search

An example of REST API in nodeJS to get and search movies from a database

## The service

You are tasked to implement a RESTful API that provides the following two basic functionalities to retrieve movie metadata from a content catalogue.

The data used for this comes from two sources:

- Typically, our own movie data would come from a database, but to simplify this, we use the static json files in `./movies` as our content catalogue.
- OMDb movie metadata can be retrieved as follows:
  - `http://www.omdbapi.com/?i=<imdb movie id>&apikey=<apikey>&plot=full`
  - You can use get a free API key from omdbapi limited by 1000 requests per day
  - Please see http://www.omdbapi.com for details

#### Getting enriched movie metadata (title, description, ..)

The first task is to merge movie metadata from our systems with movie metadata from the Open Movie Database (OMDb).

- Calling `GET /api/movies/:id` should return a JSON object representing the merged movie object.
- `:id` is an alphanumeric value that can either refer to OMDb movie ids or our internal ids.
- When merging the two objects with the same fields (i.e. both JSON objects have a `title` / `Title`), it depends on the name of the field, which metadata should be used.
- The following rules apply, with capitalized field names (i.e. `Title` vs `title`) always referring to OMDb data
  - `Title` overwrites `title`
  - `Plot` overwrites `description`
  - `duration` overwrites `Runtime`
  - `userrating` will become part of `Ratings`, applying a similar logic than `Ratings` currently has
  - `Director`, `Writer` and `Actors` should be transformed from `String` to an `String[]`
- Fields not covered by any of these rules should be merged into the resulting JSON without transformation
- If fields are unclear, make reasonable assumptions and choose your implementation accordingly

#### Search movies in our catalogue

We want to be able to search movies in our catalogue. To that end, we implement a simple search that returns a movie object if **all** search terms are true. A search term is a query param in your REST call in the form of `<search_field>=<search value>`

- If no search term is provided, return all movies
- Search terms are **case-insensitive**
- Search is performed on the merged json objects of movies
- If `<search_field>` is of type `Number` or `String` in the movie metadata, the search matches if the values are equal, i.e. `?title=Sin City` matches `3532674.json`
- If `<search_field>` is of type `Array` in the movie metadata, the search matches if the `<search value>` is contained in the array, i.e. `?director=Frank Miller` matches `3532674.json` / the corresponding OMBd object
- Calling `GET /api/movies?<search_field>=<search value>` should return a JSON array representing all movies that match the search criteria

### Solution

In order to run it, you should install required dependencies using

```
npm install
```

Once the dependencies are installed, make an omdbapi key and paste in `omdbService.ts`. Now, simply run the service in debug mode using

```
npm run start:watch
```

Run the unit tests with

```
npm test
```
