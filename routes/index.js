const express = require("express");
const router = express.Router();
const { getHello } = require("../controllers/exampleController");

router.get("/", getHello);

module.exports = router;
