// routes/products.js
const express = require("express");
const router = express.Router();
const multer = require("multer");

require("dotenv").config();


const storage = multer.memoryStorage();
const upload = multer({ storage });



module.exports = router;
