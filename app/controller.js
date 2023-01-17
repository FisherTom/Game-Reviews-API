const { selectCategories, selectReviews } = require("./model");

function getCategories(request, response, next) {
  selectCategories()
    .then((categories) => {
      response.status(200).send(categories);
    })
    .catch((err) => {
      next(err);
    });
}

function getReviews(request, response, next) {
  selectReviews()
    .then((reviews) => {
      console.log(reviews);
      response.status(200).send(reviews);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getCategories, getReviews };
