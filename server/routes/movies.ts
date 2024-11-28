const express = require("express");
const router = express.Router();
import verifyToken from "../verifyToken"
import {upload} from "../controllers/movies"

require("dotenv").config();

import { postMovie, getMovies} from "../controllers/movies";

router.route('/upload-movie').post(upload, postMovie);
router.route('/get-movies').get(upload, getMovies);




module.exports = router;