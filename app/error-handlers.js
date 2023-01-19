// app.all("/*", (request, response) => {
//     response.status(404).send({ msg: "Not Found" });
//   }); // if no endpoints are matched

function endPointNotFound(request, response) {
  response.status(404).send({ msg: "Not Found" });
}

//   app.use((err, request, response, next) => {
//     if (err.status) {
//       response.status(err.status).send({ msg: err.msg });
//     } else {
//       next(err);
//     }
//   });

function customError(err, request, response, next) {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
}

//   app.use((err, request, response, next) => {
//     if (err.code === "23503") {
//       response.status(404).send({ msg: "Not found" });
//     }
//     if (err.code === "22P02" || "23502") {
//       response.status(400).send({ msg: "Bad request" });
//     } else {
//       next(err);
//     }
//   });

function postgresError(err, request, response, next) {
  if (err.code === "23503") {
    response.status(404).send({ msg: "Not found" });
  }
  if (err.code === "22P02" || "23502") {
    response.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
}

//   app.use((err, request, response, next) => {
//     response.status(500).send({ msg: "internal sever error" });
//   });

function internalServerError(err, request, response, next) {
  response.status(500).send({ msg: "internal sever error" });
}

module.exports = {
  endPointNotFound,
  customError,
  postgresError,
  internalServerError,
};
