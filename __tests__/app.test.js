const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app/app");
const db = require("../db/connection");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET requests", () => {
  ////////////// GET REQUESTS
  describe("/api/categories", () => {
    ////////////// /api/categories
    test("should respond with 200 & body with array of categories", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
          categories = response.body;
          expect(categories.length).toBeGreaterThan(0);
          categories.forEach((category) => {
            expect(category).toHaveProperty("slug");
            expect(category).toHaveProperty("description");
          });
        });
    });
  });
});

describe("ERRORS", () => {
  test("status:404, responds with an error message when passed a bad end point", () => {
    return request(app)
      .get("/api/not_an_endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
