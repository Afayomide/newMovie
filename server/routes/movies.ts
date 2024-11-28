const express = require("express");
const router = express.Router();
import verifyToken from "../verifyToken"
import {getMovieById, updateMovie, upload} from "../controllers/movies"

require("dotenv").config();

import { postMovie, getMovies} from "../controllers/movies";

router.route('/upload-movie').post(upload, postMovie);
router.route('/get-movies').get(upload, getMovies);
router.route('/update-movie/:movieId').post(upload, updateMovie);
router.route('/get-movie/:movieId').get(upload, getMovieById);






module.exports = router;