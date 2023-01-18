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
            expect(review).toMatchObject({
              owner: expect.anything(),
              title: expect.anything(),
              review_id: expect.anything(),
              review_body: expect.anything(),
              category: expect.anything(),
              review_img_url: expect.anything(),
              created_at: expect.anything(),
              votes: expect.anything(),
              designer: expect.anything(),
              comment_count: expect.anything(),
            });
          });
        });
    });
    test("should return review objects sorted by created_at in descending order", () => {
      return request(app)
        .get("/api/reviews")
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews).toBeSortedBy("created_at", { descending: true });
        });
    });
  });

  describe("/api/reviews/:review_id", () => {
    test("should return a review with the correct id", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then((response) => {
          const review = response.body.review;

          expect(review).toMatchObject({
            owner: expect.anything(),
            title: expect.anything(),
            review_id: expect.anything(),
            review_body: expect.anything(),
            category: expect.anything(),
            review_img_url: expect.anything(),
            created_at: expect.anything(),
            votes: expect.anything(),
            designer: expect.anything(),
          });

          expect(review.review_id).toBe(1);
        });
    });
    test("404: review not found when a non-existant review is requested", () => {
      return request(app)
        .get(`/api/reviews/10000`)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Review not found");
        });
    });
    test("400: bad request when wrong datatype is used", () => {
      return request(app)
        .get(`/api/reviews/not_a_review_id`)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
  });

  describe("/api/reviews/:review_id/comments", () => {
    test("should respond with 200 & body with comments associated to specified review", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then((response) => {
          const comments = response.body.comments;
          expect(comments.length).toBeGreaterThan(0);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.anything(),
              votes: expect.anything(),
              created_at: expect.anything(),
              body: expect.anything(),
              author: expect.anything(),
              review_id: expect.anything(),
            });
          });
        });
    });
    test("should return comments sorted by created_at in descending order", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .then((response) => {
          const comments = response.body.comments;
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    test('404: "review not found" if given bad review id', () => {
      return request(app)
        .get("/api/reviews/10000/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Review not found");
        });
    });
    test("400: bad request when wrong datatype is used", () => {
      return request(app)
        .get(`/api/reviews/not_a_review_id/comments`)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
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
