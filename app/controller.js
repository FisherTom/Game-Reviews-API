const comments = require("../db/data/test-data/comments");
const {
  selectCategories,
  selectReviews,
  selectReviewById,
  selectComentsByReviewId,
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

function getReviewsById(request, response, next) {
  const reviewId = request.params.review_id;

  selectReviewById(reviewId)
    .then((review) => {
      //console.log(review);
      response.status(200).send({ review: review[0] });
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
      console.log(review);
      response.status(200).send({ review: { review } });
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
  patchReviewVotes,
};
