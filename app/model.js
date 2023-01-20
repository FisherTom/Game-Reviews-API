const format = require("pg-format");
const db = require("../db/connection");

function selectCategories() {
  const queryString = "SELECT * FROM categories";
  return db.query(queryString).then((result) => {
    return result.rows;
  });
}

function selectUsers() {
  const queryString = "SELECT * FROM users";
  return db.query(queryString).then((result) => {
    return result.rows;
  });
}

function selectReviews(category, sortBy = `created_at`, order = `DESC`) {
  const sortByGreenList = [
    `owner`,
    `title`,
    `review_id`,
    `category`,
    `created_at`,
    `votes`,
    `designer`,
    `comment_count`,
  ];

  if (!sortByGreenList.includes(sortBy)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  if (![`ASC`, `DESC`].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queries = [];

  let queryString = `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count
  FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id`;

  if (category) {
    queryString += ` WHERE reviews.category = $1`;
    queries.push(category);
  }

  queryString += ` GROUP BY reviews.review_id ORDER BY ${sortBy} ${order}`;

  return db.query(queryString, queries).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
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
      return result.rows[0];
    }
  });
}

function updateReviewVotes(reviewId, incVotes) {
  const queryString = `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`;

  return db.query(queryString, [incVotes, reviewId]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else {
      return result.rows[0];
    }
  });
}

function insertComment(reviewId, requestBody) {
  const queryString = `INSERT INTO comments (body, author, review_id) 
    VALUES ($1,$2,$3)
    RETURNING *`;

  return db
    .query(queryString, [requestBody.body, requestBody.username, reviewId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return result.rows[0];
      }
    });
}

module.exports = {
  selectCategories,
  selectReviews,
  selectComentsByReviewId,
  selectReviewById,
  insertComment,
  updateReviewVotes,
  selectUsers,
};
