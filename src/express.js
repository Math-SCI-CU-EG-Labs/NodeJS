const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const ValidationError = require("./errors/ValidationError");

const PORT = process.env.PORT || 8080;
const fileName = process.env.fileName || "./person.json";

main();

async function main() {
  const app = express();

  app.use(bodyParser.json());

  app.use(function attachDb(req, res, next) {
    req.fileName = fileName;
    next();
  });

  app.get("/", function(req, res, next) {
    res.status(200).json({ name: "personData-backend" });
  });

  app.use(require("./Routes/routes"));

  app.use(function handleErrors(err, req, res, next) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err });
    }
    next(err);
  });

  app.listen(PORT, err => {
    if (err) {
      throw err;
    }
    // eslint-disable-next-line no-console
    console.log(`api-server listening on port ${PORT}`);
  });
}
