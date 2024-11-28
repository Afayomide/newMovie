const express = require("express");
const router = express.Router();
import verifyToken from "../verifyToken"

require("dotenv").config();

import { checkAuth, signUp, login, completeSignup, logOut } from "../controllers/auth";
router.route('/checkAuth').get(verifyToken, checkAuth);

router.route("/login").post(login);

router.route("/signup").post(signUp);

router.route("/complete-signup").post(completeSignup);

router.route("/logout").post(logOut);

module.exports = router;
