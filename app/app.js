const express = require("express");
const app = express();
const {
  getCategories,
  getReviews,
  postCommentByReviewId,
} = require("./controller");

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

app.all("/*", (request, response) => {
  response.status(404).send({ msg: "Not Found" });
}); // if no endpoints are matched

app.use((err, request, response, next) => {
  response.status(err.status).send(err.msg);
});

module.exports = app;
