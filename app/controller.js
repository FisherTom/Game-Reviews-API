const info = require("../endpoints.json");
const {
  selectCategories,
  selectReviews,
  selectReviewById,
  selectComentsByReviewId,
  insertComment,
  updateReviewVotes,
  selectUsers,
  selectUserByUsername,
  insertCategory,
  insertReview,
  removeComment,
  updateCommentVotes,
} = require("./model");

function getInfo(request, response, next) {
  response.status(200).send(info);
}

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
  const { category } = request.query;
  const sortBy = request.query.sort_by;
  const { order } = request.query;

  selectCategories()
    .then((result) => {
      return result.map((dbCategory) => dbCategory.slug);
    })
    .then((dbCategories) => {
      return selectReviews(category, sortBy, order, dbCategories);
    })
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
}

function getCommentsByReviewId(request, response, next) {
  const reviewId = request.params.review_id;
  Promise.all([selectReviewById(reviewId), selectComentsByReviewId(reviewId)])
    .then((promises) => {
      const comments = promises[1];
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
      response.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
}

function postComment(request, response, next) {
  const reviewId = request.params.review_id;
  const { body } = request;

  insertComment(reviewId, body)
    .then((comment) => {
      response.status(201).send({ comment }); // send as object
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

function patchCommentVotes(request, response, next) {
  const commentId = request.params.comment_id;
  const incVotes = request.body.inc_votes;

  updateCommentVotes(commentId, incVotes)
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
}

function getUsers(request, response, next) {
  selectUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
}

function getUserByUsername(request, response, next) {
  const username = request.params.username;

  selectUserByUsername(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
}

function postCategory(request, response, next) {
  insertCategory(request.body)
    .then((category) => {
      response.status(201).send({ category });
    })
    .catch((err) => {
      next(err);
    });
}

function postReview(request, response, next) {
  insertReview(request.body)
    .then((review) => {
      response.status(201).send({ review });
    })
    .catch((err) => {
      next(err);
    });
}

function deleteComment(request, response, next) {
  const commentId = request.params.comment_id;
  removeComment(commentId)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getInfo,
  getCategories,
  getReviews,
  getCommentsByReviewId,
  getReviewsById,
  postComment,
  patchReviewVotes,
  getUsers,
  getUserByUsername,
  postCategory,
  postReview,
  deleteComment,
  patchCommentVotes,
};
