const comments = require("../db/data/test-data/comments");
const {
  selectCategories,
  selectReviews,
  selectReviewById,
  selectComentsByReviewId,
  insertComment,
  updateReviewVotes,
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
  const category = request.query.category;
  selectReviews(category)
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

function getReviewsById(request, response, next) {
  const reviewId = request.params.review_id;

  selectReviewById(reviewId)
    .then((review) => {
      response.status(200).send({ review: review });
    })
    .catch((err) => {
      next(err);
    });
}

function postComment(request, response, next) {
  const reviewId = request.params.review_id;
  const body = request.body;

  insertComment(reviewId, body)
    .then((comment) => {
      response.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
}

function patchReviewVotes(request, response, next) {
  const reviewId = request.params.review_id;
  const incVotes = request.body.inc_votes;

  updateReviewVotes(reviewId, incVotes)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getCategories,
  getReviews,
  getCommentsByReviewId,
  getReviewsById,
  postComment,
  patchReviewVotes,
};
