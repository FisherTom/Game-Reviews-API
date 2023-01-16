const express = require("express");
const app = express();
const { getCategories } = require("./controller");

app.get("/api/categories", getCategories);

app.all("/*", (request, response) => {
  response.status(404).send({ msg: "Not Found" });
}); // if no endpoints are matched

app.use((err, request, response, next) => {
  response.status(500).send("error");
});

module.exports = app;
