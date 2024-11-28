import React from "react";
import { useState, useEffect, useContext } from "react";
import authFooter from "../../assets/auth-footer.svg";
import "./auth.scss";
import axios from "axios";
import { toast } from "react-hot-toast";
import { GlobalContext } from "../globalContext";
import { useNavigate, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { authenticated, setAuthenticated } = useContext(GlobalContext);
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/checkAuth`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setAuthenticated(true);
          toast("You are already logged in");
          navigate("../");
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginPromise = async () => {
      const response = await axios.post(
        `${apiUrl}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // Important for handling cookies!
        }
      );

      return response;
    };

    toast.promise(loginPromise(), {
      loading: "Logging in...",
      success: (response) => {
        console.log(response);
        const { success } = response.data;
          setAuthenticated(true);
          navigate("/");
          return "Login successful!";
      },
      error: (error) => {
        console.error("Login failed:", error);
        console.log(error);
        return error.response.data.message || "An error occurred";
      },
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Log In</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className=""
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <br />
          <input
            type="text"
            className=""
            placeholder="Password"
            onChange={(e) => {
              if (e.target.value.length > 20) {
                e.target.value = "";
                toast.error("password is too long");
              } else {
                setPassword(e.target.value);
              }
            }}
          />
          <br />
          <div className="remember-check">
            <input type="checkbox" className="remember-checkbox" /> Remember me
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
