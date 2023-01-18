const express = require("express");
const app = express();
const { getCategories, getReviews, getReviewsById } = require("./controller");

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewsById);

app.all("/*", (request, response) => {
  response.status(404).send({ msg: "Not Found" });
}); // if no endpoints are matched

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
