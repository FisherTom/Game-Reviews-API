const express = require("express");
const app = express();

const {
  getCategories,
  getReviews,
  getReviewsById,
  getCommentsByReviewId,
  patchReviewVotes,
} = require("./controller");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.patch("/api/reviews/:review_id", patchReviewVotes); //not a descriptive endpoint

app.all("/*", (request, response) => {
  response.status(404).send({ msg: "Not Found" });
});

app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "internal sever error" });
});

module.exports = app;
