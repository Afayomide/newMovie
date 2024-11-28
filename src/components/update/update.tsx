import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import uploadIc from "../../assets/upload.svg";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const Update: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();  // Get the current URL
  const movieId = new URLSearchParams(location.search).get("id");

  useEffect(() => {
    if (!movieId) {
      toast.error("Movie ID is missing");
      return;
    }

    const fetchMovie = async () => {
      toast.promise(
        axios.get(`${apiUrl}/movies/get-movie/${movieId}`, {
          withCredentials: true,
        })
        .then((response) => {
          const movie = response.data.movie;

          // Populate the fields with fetched data
          setTitle(movie.movieTitle || "");
          setReleaseDate(movie.releaseDate || "");
          if (movie.imageUrl) {
            setImagePreview(movie.imageUrl);  // Set the image preview if available
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error fetching movie: " + (error.response?.data?.message || error.message));
        }),
        {
          loading: "Loading movie details...",
          success: "Movie loaded successfully!",
          error: "Failed to load movie",
        }
      );
    };

    fetchMovie();
  }, [movieId]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile)); 
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!image) {
      toast("Please select an image to upload.");
      return;
    }

    console.log("image to be uploaded", image);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("title", title);
    formData.append("releaseDate", releaseDate);

    toast.promise(
      axios.post(`${apiUrl}/movies/update-movie/${movieId}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      {
        loading: "Uploading image...",
        success: (response) => {
          console.log("Movie uploaded successfully: ");
          navigate("/");
          return `Movie uploaded successfully`;
        },
        error: (error) => {
          console.error("Error uploading image: ", error);
          return "Error uploading image.";
        },
      }
    );
  };

 
  

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="upload-container">
      <h3>Create a new movie</h3>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="select-image">
          <input
            style={{ display: "none" }}
            ref={fileInputRef}
            className="file-input"
            type="file"
            onChange={handleFileChange}
            placeholder="drop an image here"
          />
          {!imagePreview ? (
            <button
              onClick={handleButtonClick}
              className="file-button"
              type="button"
            >
              <img src={uploadIc} alt="Upload icon" />
              <br />
              Drop an image here
            </button>
          ) : (
              <img className="uploaded-image" onClick={handleButtonClick} src={imagePreview} alt="Selected preview" />
          )}
        </div>
        <div className="upload-input-buttons">
          <div className="upload-input">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Publishing Year"
              value={releaseDate}
              onChange={(e) => {
                setReleaseDate(e.target.value);
              }}
            />
          </div>

          <div className="responsive-select-image">
          <input
            style={{ display: "none" }}
            ref={fileInputRef}
            className="file-input"
            type="file"
            onChange={handleFileChange}
            placeholder="drop an image here"
          />
          {!imagePreview ? (
            <button
              onClick={handleButtonClick}
              className="file-button"
              type="button"
            >
              <img src={uploadIc} alt="Upload icon" />
              <br />
              Drop an image here
            </button>
          ) : (
              <img className="uploaded-image" onClick={handleButtonClick} src={imagePreview} alt="Selected preview" />
          )}
        </div>
          

          <div className="upload-button">
            <button type="button" onClick={handleClick}>
              {" "}
              Cancel
            </button>{" "}
            <button type="submit">Update</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Update;