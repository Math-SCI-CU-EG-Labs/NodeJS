const express = require("express");
const PersonService = require("../Services/PersonService");

const router = express.Router();

router.get("/getUserData", function(req, res, next) {
  const personService = new PersonService(req.fileName);
  personService
    .getData()
    .then(personData => res.status(200).json({ ...personData }))
    .catch(next);
});

router.post("/setUserData", function(req, res, next) {
  const { fileName, body } = req;
  const personService = new PersonService(fileName);
  personService
    .updateData(body)
    .then(resData => res.status(200).json({ ...resData }))
    .catch(next);
});

module.exports = router;
