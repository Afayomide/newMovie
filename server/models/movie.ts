import mongoose, { Types } from "mongoose";


export interface Movie {
    movieTitle: string;
    releaseDate: string;
    imageUrl: string;
  }
  
  const movieSchema = new mongoose.Schema<Movie>({
    movieTitle: { type: String, required: true },
    releaseDate: { type: String, required: true },
    imageUrl: {type: String, required:true},
  });
  
  export default mongoose.model<Movie>("Movie", movieSchema);