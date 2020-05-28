import { describe } from "mocha";
import chai from "chai";
import chaiHttp = require("chai-http");

import app from "../App";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Search movies API", () => {
  it("return all movies if no search term is provided", async () => {
    return chai
      .request(app)
      .get("/api/movies")
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.be.lengthOf(4);
      });
  });

  it("returns combined movies", async () => {
    return chai
      .request(app)
      .get("/api/movies")
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.be.lengthOf(4);

        const movie = res.body[0];
        expect(movie).to.have.property("title");
        expect(movie).to.have.property("description");
        expect(movie.title).to.be.an("string");
        expect(movie.description).to.be.an("string");
        expect(movie).not.to.have.property("Plot");
      });
  });

  it("return no results for incorrect search field", async () => {
    return chai
      .request(app)
      .get("/api/movies?foo=bar")
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.be.lengthOf(0);
      });
  });

  it("return no results for incorrect search term", async () => {
    return chai
      .request(app)
      .get("/api/movies?title=no movie with this title")
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.be.lengthOf(0);
      });
  });

  it("can perform search", async () => {
    return chai
      .request(app)
      .get("/api/movies?title=Star Wars: Episode IV - A New Hope")
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.be.lengthOf(1);
        expect(res.body[0].title).to.be.equal(
          "Star Wars: Episode IV - A New Hope"
        );
      });
  });

  it("can perform search with numerical field", async () => {
    return chai
      .request(app)
      .get("/api/movies?productionYear=1989")
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.be.lengthOf(1);
        expect(res.body[0].title).to.be.equal(
          "Indiana Jones and the Last Crusade"
        );
      });
  });

  it("can perform search with case insensitive search field", async () => {
    return chai
      .request(app)
      .get("/api/movies?Title=Star Wars: Episode IV - A New Hope")
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.be.lengthOf(1);
        expect(res.body[0].title).to.be.equal(
          "Star Wars: Episode IV - A New Hope"
        );
      });
  });

  it("can perform search with case insensitive search term", async () => {
    return chai
      .request(app)
      .get("/api/movies?title=star wars: Episode IV - A New Hope")
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.be.lengthOf(1);
        expect(res.body[0].title).to.be.equal(
          "Star Wars: Episode IV - A New Hope"
        );
      });
  });

  it("can perform search on array field", async () => {
    return chai
      .request(app)
      .get("/api/movies?writer=george lucas")
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.be.lengthOf(1);
        expect(res.body[0].title).to.be.equal(
          "Star Wars: Episode IV - A New Hope"
        );
      });
  });

  it("can perform search with multiple search terms", async () => {
    return chai
      .request(app)
      .get(
        "/api/movies?language=english&title=Star Wars: Episode IV - A New Hope"
      )
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.be.lengthOf(1);
        expect(res.body[0].title).to.be.equal(
          "Star Wars: Episode IV - A New Hope"
        );
      });
  });
});
