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
  describe("/api/categories", () => {
    test("should respond with 200 & body with array of categories", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
          const categories = response.body.categories;
          expect(categories.length).toBeGreaterThan(0);
          categories.forEach((category) => {
            expect(category).toHaveProperty("slug");
            expect(category).toHaveProperty("description");
          });
        });
    });
  });
  describe("/api/reviews", () => {
    test("should respond with 200 & body with array of review objects", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
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
    test("should return review objects sorted by created_at in descending order", () => {
      return request(app)
        .get("/api/reviews")
        .then((response) => {
          const reviews = response.body.reviews;
          console.log(reviews);
          expect(reviews).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
});
// describe("POST", () => {
//   describe("/api/reviews/:review_id/comments", () => {
//     test("201: respond with posted comment", () => {
//       return request(app)
//         .post("/api/reviews/1/comments")
//         .expect(201)
//         .then((response) => {});
//     });
//   });
// });
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
