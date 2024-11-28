import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./home.scss";
import plusIc from "../../assets/plus.svg";
import logoutIc from "../../assets/logout.svg";
import toast from "react-hot-toast";
import { GlobalContext } from "../globalContext";
import imageIc from "../../assets/movieimg.svg";

// Define the Movie type
interface Movie {
  imageUrl: string;
  movieTitle: string;
  releaseDate: string;
}

const Card: React.FC<Movie> = (props) => {
  return (
    <div className="one-movie">
      <div className="image-container">
        <img src={props.imageUrl} alt={props.movieTitle} />
      </div>
      <div>
        <p>{props.movieTitle}</p>
        <p>{props.releaseDate}</p>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [userMovies, setUserMovies] = useState<Movie[]>([]);

const moviesPerPage = 5; 
const indexOfLastMovie = currentPage * moviesPerPage;
const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
const currentMovies = userMovies.slice(indexOfFirstMovie, indexOfLastMovie);
const totalPages = Math.ceil(userMovies.length / moviesPerPage);

const handlePageChange = (page: number) => {
  setCurrentPage(page);
};


  

  const apiUrl = process.env.REACT_APP_API_URL;

  const {
    authenticated,
    setAuthenticated,
  } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/checkAuth`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          toast("Please Login to access this page");
          navigate("/login");
        }
      } catch (error: any) {
        setAuthenticated(false);
          toast("Please Login to access this page");
          navigate("/login");
      }
    };

    checkAuth();
  }, [authenticated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/movies/get-movies`,{
          withCredentials: true,
        });
        console.log(response);
        setUserMovies(response.data.movies); // TypeScript will now recognize the correct type
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const logout = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/auth/logout`,
        {},
        { withCredentials: true }
      );
      console.log(response.data.message); // Handle success message
      const { success } = response.data;
      if (success) {
        toast.success("Bye for now!");
      }
      navigate("/login");
    } catch (error) {
      toast.error("error while logging out");
      console.error("Error logging out:", error);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="home-container">
      <nav>
        <Link to="/upload">
          <h1>My movies</h1> <img src={plusIc} alt="Add movie" />
        </Link>
        <button onClick={logout}>
          <p>logout</p> <img src={logoutIc} alt="Logout" />
        </button>
      </nav>
      {loading ? (
        <div>Loading...</div>
      ) : userMovies.length > 0 ? (
        <>
          <div className="all-movies">
            {currentMovies.map((movie, index) => (
              <Card
                key={index}
                imageUrl={movie.imageUrl}
                movieTitle={movie.movieTitle}
                releaseDate={movie.releaseDate}
              />
            ))}
          </div>
          <div className="pagination">
        <button className="prev" onClick={handlePrev} disabled={currentPage === 1}>
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        <button className="next" onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
        </>
      ) : (
        <div className="no-movies">
          <h4>Your movie list is empty</h4>
          <Link to="/upload">Add a new movie</Link>
        </div>
      )}
    </div>
  );
  
};

export default Home;
