const format = require("pg-format");
const db = require("../db/connection");

function selectCategories() {
  const queryString = "SELECT * FROM categories";
  return db.query(queryString).then((result) => {
    return result.rows;
  });
}

function selectReviews() {
  const queryString = `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count
  FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  ORDER BY created_at DESC`;

  return db.query(queryString).then((result) => {
    return result.rows;
  });
}

function selectComentsByReviewId(reviewId) {
  const queryString = format(
    `SELECT * FROM comments WHERE review_id=%L ORDER BY created_at DESC`,
    [reviewId]
  );
  return db.query(queryString).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Review not found" });
    } else {
      return result.rows;
    }
  });
}

function selectReviewById(reviewId) {
  const queryString = format(`SELECT * FROM reviews WHERE review_id=%L`, [
    reviewId,
  ]);
  return db.query(queryString).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Review not found" });
    } else {
      return result.rows;
    }
  });
}

function insertCommentByReviewId(reviewId, body) {
  /// will need to do some greenlisting

  const queryString = `INSERT INTO comments (body, votes, author, review_id, created_at) 
    VALUES (${body.body}, 0, ${body.username}, ${reviewId}, ${new Date()})`;
}

module.exports = {
  selectCategories,
  selectReviews,
  selectComentsByReviewId,
  selectReviewById,
  insertCommentByReviewId,
};
