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
  describe("/api/reviews", () => {
    ////////////// /api/reviews
    test("should respond with 200 & body with array of review objects", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
          const reviews = response.body;
          expect(reviews.length).toBeGreaterThan(0);
          reviews.forEach((review) => {
            expect(review).toHaveProperty("owner");
            expect(review).toHaveProperty("title");
            expect(review).toHaveProperty("review_id");
            expect(review).toHaveProperty("category");
            expect(review).toHaveProperty("review_img_url");
            expect(review).toHaveProperty("created_at");
            expect(review).toHaveProperty("votes");
            expect(review).toHaveProperty("designer");
            expect(review).toHaveProperty("comment_count");
          });
        });
    });
    test("should return review objects sorted by date in descending order", () => {
      /*
        task calls to order by 'date' but there is 
        no 'date' key so they are ordered by 'created_at'
      */
      return request(app)
        .get("/api/reviews")
        .then((response) => {
          const reviews = response.body;
          expect(reviews).toBeSortedBy("created_at", { descending: true });
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
