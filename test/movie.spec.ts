import { describe } from "mocha";
import chai from "chai";
import chaiHttp = require("chai-http");

import app from "../App";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Movie details API", () => {
  it("returns 404 if no such id or imdbId", async () => {
    return chai
      .request(app)
      .get("/api/movies/no_such_id")
      .then(res => {
        expect(res.status).to.equal(404);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body.message).to.be.an("string");
        expect(res.body.message).to.be.equal(
          "No movie found with id or imdbID no_such_id"
        );
      });
  });

  it("can get movie with internal id", async () => {
    return chai
      .request(app)
      .get("/api/movies/3532674")
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body.id).to.be.an("number");
        expect(res.body.id).to.be.equal(3532674);
      });
  });

  it("can get movie with imdbId", async () => {
    return chai
      .request(app)
      .get("/api/movies/tt0076759")
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body.id).to.be.an("number");
        expect(res.body.id).to.be.equal(11043689);
      });
  });

  it("returns movie from omdb if not in store", async () => {
    return chai
      .request(app)
      .get("/api/movies/tt0944947") // tt0944947 imdbid refers to Game of Thrones which is not in store
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body.imdbId).to.be.an("string");
        expect(res.body.imdbId).to.be.equal("tt0944947");
      });
  });

  it("returns combined movie data with internal id", async () => {
    return chai
      .request(app)
      .get("/api/movies/11043689")
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body.id).to.be.an("number");
        expect(res.body.id).to.be.equal(11043689);

        // Title should overwrites title
        expect(res.body.title).to.be.an("string");
        expect(res.body.title).to.be.equal(
          "Star Wars: Episode IV - A New Hope"
        );

        // Plot should overwrites description
        expect(res.body.description).to.be.an("string");
        expect(res.body.description).to.be.equal(
          "The Imperial Forces, under orders from cruel Darth Vader, hold Princess Leia hostage in their efforts to quell the rebellion against the Galactic Empire. Luke Skywalker and Han Solo, captain of the Millennium Falcon, work together with the companionable droid duo R2-D2 and C-3PO to rescue the beautiful princess, help the Rebel Alliance and restore freedom and justice to the Galaxy."
        );

        // duration should overwrites Runtime
        expect(res.body.Runtime).to.be.an("string");
        expect(res.body.Runtime).to.be.equal("120 min");

        // Average star ratings should be 417 * 5 + 101 * 4 + 88 * 3 + 3 * 2 + 5 * 1 / 614 = 4.5
        // and added to Ratings
        const ratings = res.body.Ratings;
        expect(ratings).to.be.an("array");
        expect(ratings).to.be.lengthOf(4);
        expect(ratings[ratings.length - 1].Source).to.be.equal("User Rating");
        expect(ratings[ratings.length - 1].Value).to.be.equal("4.5/5.0");

        // Director, Writer and Actors should be transformed from String to an String[]
        expect(res.body.Director).to.be.an("array");
        expect(res.body.Director).to.be.lengthOf(1);
        expect(res.body.Director[0]).to.be.equal("George Lucas");
        expect(res.body.Writer).to.be.an("array");
        expect(res.body.Writer).to.be.lengthOf(1);
        expect(res.body.Writer[0]).to.be.equal("George Lucas");
        expect(res.body.Actors).to.be.an("array");
        expect(res.body.Actors).to.be.lengthOf(4);
        expect(res.body.Actors[0]).to.be.equal("Mark Hamill");
      });
  });

  it("returns combined movie data with imdbId", async () => {
    return chai
      .request(app)
      .get("/api/movies/tt0076759")
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body.id).to.be.an("number");
        expect(res.body.id).to.be.equal(11043689);

        // Title should overwrites title
        expect(res.body.title).to.be.an("string");
        expect(res.body.title).to.be.equal(
          "Star Wars: Episode IV - A New Hope"
        );

        // Plot should overwrites description
        expect(res.body.description).to.be.an("string");
        expect(res.body.description).to.be.equal(
          "The Imperial Forces, under orders from cruel Darth Vader, hold Princess Leia hostage in their efforts to quell the rebellion against the Galactic Empire. Luke Skywalker and Han Solo, captain of the Millennium Falcon, work together with the companionable droid duo R2-D2 and C-3PO to rescue the beautiful princess, help the Rebel Alliance and restore freedom and justice to the Galaxy."
        );

        // duration should overwrites Runtime
        expect(res.body.Runtime).to.be.an("string");
        expect(res.body.Runtime).to.be.equal("120 min");

        // Average star ratings should be 417 * 5 + 101 * 4 + 88 * 3 + 3 * 2 + 5 * 1 / 614 = 4.5
        // and added to Ratings
        const ratings = res.body.Ratings;
        expect(ratings).to.be.an("array");
        expect(ratings).to.be.lengthOf(4);
        expect(ratings[ratings.length - 1].Source).to.be.equal("User Rating");
        expect(ratings[ratings.length - 1].Value).to.be.equal("4.5/5.0");

        // Director, Writer and Actors should be transformed from String to an String[]
        expect(res.body.Director).to.be.an("array");
        expect(res.body.Director).to.be.lengthOf(1);
        expect(res.body.Director[0]).to.be.equal("George Lucas");
        expect(res.body.Writer).to.be.an("array");
        expect(res.body.Writer).to.be.lengthOf(1);
        expect(res.body.Writer[0]).to.be.equal("George Lucas");
        expect(res.body.Actors).to.be.an("array");
        expect(res.body.Actors).to.be.lengthOf(4);
        expect(res.body.Actors[0]).to.be.equal("Mark Hamill");
      });
  });
});
