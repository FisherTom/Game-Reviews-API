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
    test("should return review objects sorted by created_at in descending order by default", () => {
      return request(app)
        .get("/api/reviews")
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("should accept category search query and respond with only reviews of that category", () => {
      return request(app)
        .get("/api/reviews?category=dexterity")
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews.length).toBeGreaterThan(0);
          reviews.forEach((review) => {
            expect(review.category).toBe("dexterity");
          });
        });
    });
    test("should accept a sort_by query to sort results by selected collumn", () => {
      return request(app)
        .get("/api/reviews?sort_by=votes")
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews.length).toBeGreaterThan(0);
          expect(reviews).toBeSortedBy("votes", { descending: true });
        });
    });
    test("should accept an order query to order results in ascending order", () => {
      return request(app)
        .get("/api/reviews?order=ASC")
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews.length).toBeGreaterThan(0);
          expect(reviews).toBeSortedBy("created_at", { ascending: true });
        });
    });
    test("should accept a category, sort_by and order query and respond with data in correct format", () => {
      return request(app)
        .get("/api/reviews?category=social deduction&sort_by=votes&order=ASC")
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews.length).toBeGreaterThan(0);
          expect(reviews).toBeSortedBy("votes", { ascending: true });
          reviews.forEach((review) => {
            expect(review.category).toBe("social deduction");
          });
        });
    });
    test('400: "Invalid sort query" if sort query is not on green list', () => {
      return request(app)
        .get("/api/reviews?sort_by=im_a_hacker")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid sort query");
        });
    });
    test('400: "Invalid order query" if order query is not on green list', () => {
      return request(app)
        .get("/api/reviews?order=im_a_hacker")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid order query");
        });
    });
    test('404: "Not found" if given non existant category', () => {
      return request(app)
        .get("/api/reviews?category=not_a_category")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not found");
        });
    });
    test("200: returns empty array if given category with no reviews", () => {
      return request(app)
        .get("/api/reviews?category=children's games")
        .expect(200)
        .then((response) => {
          expect(response.body.reviews).toEqual([]);
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
  describe("/api/users", () => {
    test("200: response body contains array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const users = response.body.users;
          expect(users.length).toBeGreaterThan(0);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
});

describe("POST", () => {
  describe("/api/reviews/:review_id/comments", () => {
    test("201: respond with posted comment", () => {
      const testComment = {
        username: "dav3rid",
        body: "Test Comment",
      };

      return request(app)
        .post("/api/reviews/1/comments")
        .send(testComment)
        .expect(201)
        .then((response) => {
          expect(response.body).toMatchObject({
            author: "dav3rid",
            body: "Test Comment",
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            review_id: 1,
            votes: 0,
          });
        })
        .then(() => {
          // check comment is in the DB
          return request(app)
            .get("/api/reviews/1/comments")
            .then((response) => {
              const lastComment = response.body.comments[0].body;
              expect(lastComment).toBe("Test Comment");
            });
        });
    });
    test("201: ignores unnecasery properties in request body", () => {
      const testComment = {
        username: "dav3rid",
        body: "Test Comment",
        unnecasery: "why?",
      };

      return request(app)
        .post("/api/reviews/1/comments")
        .send(testComment)
        .expect(201)
        .then((response) => {
          expect(response.body).toMatchObject({
            author: "dav3rid",
            body: "Test Comment",
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            review_id: 1,
            votes: 0,
          });
        });
    });
    test('404: "Not found" if nonexistant review id', () => {
      const testComment = {
        username: "dav3rid",
        body: "Test Comment",
      };
      return request(app)
        .post("/api/reviews/10000/comments")
        .send(testComment)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not found");
        });
    });
    test('404: "Not found" if given nonexistant username', () => {
      const testComment = {
        username: "not_a_username",
        body: "Test Comment",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(testComment)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not found");
        });
    });
    test('400: "Bad request" if given bad review id', () => {
      const testComment = {
        username: "dav3rid",
        body: "Test Comment",
      };
      return request(app)
        .post("/api/reviews/not_a_review_id/comments")
        .send(testComment)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test('400: "Bad request" if no comment body', () => {
      const testComment = {
        username: "dav3rid",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(testComment)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
  });
});
describe("PATCH requests", () => {
  describe("/api/reviews/:review_id (incrament votes)", () => {
    test("should incrament votes, update the table and return the updated review object", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: 1 })
        .expect(200)
        .then((response) => {
          const review = response.body.review;
          expect(review).toMatchObject({
            review_id: 2,
            title: expect.any(String),
            category: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_body: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: 6,
          });
        })
        .then(() => {
          return request(app)
            .get("/api/reviews/2")
            .then((response) => {
              expect(response.body.review.votes).toBe(6);
            });
        }); //check its actually in the DB
    });
    test("should reduce votes given a negative value, update the table and return the updated review object", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: -2 })
        .expect(200)
        .then((response) => {
          const review = response.body.review;
          expect(review).toMatchObject({
            review_id: 2,
            title: expect.any(String),
            category: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_body: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.anything(),
            votes: 3,
          });
        })
        .then(() => {
          return request(app)
            .get("/api/reviews/2")
            .then((response) => {
              expect(response.body.review.votes).toBe(3);
            });
        }); //check its actually in the DB
    });
    test("400: 'Bad request' if sent NaN value", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: "Parmesan" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("400: 'Bad request' if no request body", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send()
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test('404: "Not found" if given a nonexistant review id', () => {
      return request(app)
        .patch("/api/reviews/20000")
        .send({ inc_votes: -2 })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not found");
        });
    });
    test('400: "Bad request" if review id is not valid', () => {
      return request(app)
        .patch("/api/reviews/not_a_review_id")
        .send({ inc_votes: -2 })
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
