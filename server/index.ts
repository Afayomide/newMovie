const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
import verifyToken from "./verifyToken";
import connectToMongo from "./dbConnection";
const nodemailer = require("nodemailer");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const movieRouter = require("./routes/movies");
const cookieParser = require("cookie-parser");


const port = 4000;
const dburl: string = process.env.dburl || "";

const corsOption = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use("/api/user", verifyToken, userRouter);
app.use("/api/auth", authRouter);
app.use("/api/movies", verifyToken, movieRouter);

declare global {
  namespace Express {
    interface Request {
      user?: any; 
      file?: any;
    }
  }
}

connectToMongo(dburl)
  .then(() => {
    console.log("connection succesful");
  })
  .catch((error) => {
    console.error("Fatal error:", error.message);
  });

app.get("/", (req: any, res: any) => {
  res.send("Dandys Server");
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
