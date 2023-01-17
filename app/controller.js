const {
  selectCategories,
  selectReviews,
  selectReviewById,
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

module.exports = { getCategories, getReviews, getReviewsById };
