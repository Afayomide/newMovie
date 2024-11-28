import { Request, Response } from "express";
import User from "../models/user";
import Movie from "../models/movie";
const fs = require("fs");
const path = require("path");
const { Dropbox } = require("dropbox");
const fetchDB = require("isomorphic-fetch");
const multer = require("multer");

const dbx = new Dropbox({ accessToken: process.env.dropbox_token, fetchDB });
const storage = multer.memoryStorage();
export const upload = multer({ storage }).single("file");

export const postMovie = async (req: Request, res: Response) => {
  const id = req.user?.userId;
  if (!id) {
    return res.status(400).json({ message: "User ID is missing or invalid" });
  }

  const file = req.file;
  const { title, releaseDate } = req.body;
  console.log(file, title, releaseDate);

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json("User not found");
    }

    // Upload the file to Dropbox
    console.log("Received file:", file.filename);
    const fileName = Date.now() + path.extname(file.originalname);
    console.log("Generated file name:", fileName);

    const uploadResponse = await dbx.filesUpload({
      path: "/" + fileName,
      contents: file.buffer,
    });

    const linkResponse = await dbx.filesGetTemporaryLink({
      path: uploadResponse.result.path_display,
    });

    const fileUrl = linkResponse.result.link;

    const newMovie = new Movie({
      movieTitle: title,
      releaseDate,
      imageUrl: fileUrl,
    });
    console.log("user undefined", user);

    const savedMovie = await newMovie.save();

    user.movies.unshift(savedMovie._id);
    await user.updateOne({ movies: user.movies });

    return res.status(201).json({
      message: "Movie uploaded and saved successfully!",
      movie: savedMovie,
    });
  } catch (error: any) {
    console.error("Error uploading file to Dropbox:", error);
    return res.status(500).json({
      message:
        error.message || "Something went wrong while uploading the file.",
      error: error, 
    });
  }
};
export const getMovies = async (req: Request, res: Response) => {
  const id = req.user?.userId;
  if (!id) {
    return res.status(400).json({ message: "User ID is missing or invalid" });
  }
  try {
    const user = await User.findById(id).populate("movies");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ movies: user.movies });
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error retrieving movies", error: error.message });
  }
};
