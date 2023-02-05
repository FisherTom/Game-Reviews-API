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

function selectReviews(
  category,
  sortBy = `created_at`,
  order = `DESC`,
  dbCategories
) {
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
      if (dbCategories.includes(category)) {
        return [];
      } else {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    }
    return result.rows;
  });
}

function selectUserByUsername(username) {
  const queryString = `SELECT * FROM users WHERE  username=$1`;

  return db.query(queryString, [username]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "User not found" });
    } else {
      return result.rows[0];
    }
  });
}

function selectComentsByReviewId(reviewId) {
  const queryString = `SELECT * FROM comments WHERE review_id=$1 ORDER BY created_at DESC`;
  return db.query(queryString, [reviewId]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Review not found" });
    } else {
      return result.rows;
    }
  });
}

function selectReviewById(reviewId) {
  const queryString = `
  SELECT reviews.*, COUNT(comments.comment_id) AS comment_count
  FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  HAVING reviews.review_id = $1;
  `;
  return db.query(queryString, [reviewId]).then((result) => {
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

function updateCommentVotes(commentId, incVotes) {
  const queryString = `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`;

  return db.query(queryString, [incVotes, commentId]).then((result, err) => {
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

function insertCategory(requestBody) {
  const queryString = `INSERT INTO categories (slug, description)
  VALUES($1,$2)
  RETURNING *`;

  if (requestBody.slug === "")
    return Promise.reject({ status: 400, msg: "Bad request" });

  return db
    .query(queryString, [requestBody.slug, requestBody.description])
    .then((result) => {
      return result.rows[0];
    });
}

function insertReview({
  title,
  designer,
  owner,
  review_img_url,
  review_body,
  category,
}) {
  const queryString = `INSERT INTO reviews 
  (title, designer, owner, review_img_url, review_body, category)
  VALUES($1,$2,$3,$4,$5,$6)
  RETURNING *`;

  const emptyFields = [
    title,
    owner,
    review_img_url,
    review_body,
    category,
  ].some((val) => val === "" || val === undefined);

  if (emptyFields) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(queryString, [
      title,
      designer,
      owner,
      review_img_url,
      review_body,
      category,
    ])
    .then((result) => {
      return { ...result.rows[0], comment_count: 0 };
    });
}

function removeComment(commentId) {
  const queryString = `DELETE FROM comments WHERE comment_id = $1`;

  return db.query(queryString, [commentId]).then((result) => {
    //console.log(result);
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
  insertCategory,
  insertReview,
  removeComment,
  selectUserByUsername,
  updateCommentVotes,
};
