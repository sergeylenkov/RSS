const express = require("express");
const feeds = require("../models/feeds");
const utils = require("../utils");

let router = express.Router();

router.get("/", function (req, res) {
  utils.log("GET feeds /");
  feeds
    .all()
    .then((items) => {
      return res.json(items);
    })
    .catch((error) => {
      res.status(500).send({ error: error });
    });
});

router.get("/update", function (req, res) {
  utils.log("GET feeds /update");
  feeds
    .update()
    .then((items) => {
      return res.json(items);
    })
    .catch((error) => {
      res.status(500).send({ error: error });
    });
});

router.post("/", function (req, res) {
  const link = req.body.link;
  utils.log("POST feeds /", link);
  feeds
    .add(link)
    .then((feed) => {
      return res.json(feed);
    })
    .catch((error) => {
      res.status(500).send({ error: error });
    });
});

router.patch("/:feedId", function (req, res) {
  const id = req.params.feedId;
  const data = req.body;
  utils.log(`PATCH feeds /${id}`, data);
  feeds
    .patch(id, data)
    .then((item) => {
      return res.json(item);
    })
    .catch((error) => {
      res.status(500).send({ error: error });
    });
});

router.delete("/:feedId", function (req, res) {
  const id = req.params.feedId;
  utils.log(`DELETE feeds /${id}`);
  feeds
    .delete(id)
    .then((item) => {
      return res.json(item);
    })
    .catch((error) => {
      res.status(500).send({ error: error });
    });
});

module.exports = router;
