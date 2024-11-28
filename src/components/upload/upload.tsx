import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./upload.scss";
import uploadIc from "../../assets/upload.svg";
import { useNavigate } from "react-router-dom";

const Upload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  // const handleFileChange = (e: any) => {
  //   const selectedFile = e.target.files[0];
  //   console.log("Selected file: ", selectedFile);
  //   setImage(selectedFile);
  // };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile)); // Create a preview of the selected image
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
      axios.post(`${apiUrl}/movies/upload-movie`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      {
        loading: "Uploading image...",
        success: (response) => {
          console.log("File uploaded successfully: ", response.data.url);
          navigate("/");
          return `File uploaded successfully`;
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
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Publishing Year"
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
            <button type="submit">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Upload;
