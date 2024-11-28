import React, { useState, useContext, useEffect } from "react";
import authFooter from "../../assets/auth-footer.svg";
import "./auth.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../globalContext";
import { toast } from "react-hot-toast";

const Signup: React.FC = () => {
  const { authenticated } = useContext(GlobalContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [specialChar, setNoSpecialChar] = useState(false);
  const [changePassword, setChangePassword] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (authenticated) {
        toast("You are already logged in");
        navigate("../");
      }
    };
    checkAuth();
  }, [authenticated]);



  function containsSpecialCharacter(password: string) {
    var specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    return specialCharRegex.test(password);
  }

  const handleSignup = async (e: any) => {
    e.preventDefault();
  
    const serverUrl = `${process.env.REACT_APP_API_URL}/auth/signup`;
  
    if (!specialChar) {
      toast.error("Add a special character to the password");
      return;
    }
  
    const signupPromise = async () => {
      const response = await axios.post(serverUrl, {
        username,
        email,
        password,
      });
  
      return response;
    };
  
    toast.promise(signupPromise(), {
      loading: "Signing you up...",
      success: (response) => {
        const { success } = response.data;
  
        if (success) {
          navigate("/login");
          return "Signup successful! Please check your email👌";
        } else {
          throw new Error(response.data.message);
        }
      },
      error: (error) => {
        console.error("Signup failed:", error);
        return error.response?.data?.message || "Signup failed. Try again.";
      },
    });
  };
  

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
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
            placeholder="username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <br />
          <input
            type="text"
            className=""
            placeholder="password"
            onChange={(e) => {
              if (e.target.value.length > 20) {
                e.target.value = "";
                toast.error("password is too long");
              } else {
                setPassword(e.target.value);
              }
              if (!containsSpecialCharacter(e.target.value)) {
                setNoSpecialChar(false);
              } else {
                setNoSpecialChar(true);
              }
            }}
          />
          <br />
          <div className="remember-check">
            <input type="checkbox" /> Remember me
          </div>
          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
