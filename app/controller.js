const comments = require("../db/data/test-data/comments");
const {
  selectCategories,
  selectReviews,
  selectComentsByReviewId,
} = require("./model");

function getCategories(request, response, next) {
  selectCategories()
    .then((categories) => {
      response.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
}

function getReviews(request, response, next) {
  selectReviews()
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
}

function getCommentsByReviewId(request, response, next) {
  const reviewId = request.params.review_id;
  selectComentsByReviewId(reviewId)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getCategories, getReviews, getCommentsByReviewId };
