const { selectCategories } = require("./model");

function getCategories(request, response) {
  selectCategories()
    .then((categories) => {
      response.status(200).send(categories);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getCategories };
