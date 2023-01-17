const express = require("express");
const app = express();
const {
  getCategories,
  getReviews,
  getCommentsByReviewId,
} = require("./controller");

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.all("/*", (request, response) => {
  response.status(404).send({ msg: "Not Found" });
}); // if no endpoints are matched

app.use((err, request, response, next) => {
  response.status(err.status).send({ msg: err.msg });
});

module.exports = app;
