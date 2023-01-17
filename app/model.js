const db = require("../db/connection");

function selectCategories() {
  const queryString = "SELECT * FROM categories";
  return db.query(queryString).then((result) => {
    return result.rows;
  });
}

module.exports = { selectCategories };
