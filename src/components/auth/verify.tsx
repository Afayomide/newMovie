import React from "react";
import { useState, useEffect, useContext } from "react";
import authFooter from "../../assets/auth-footer.svg";
import "./auth.scss";
import axios from "axios";
import { toast } from "react-hot-toast";
import { GlobalContext } from "../globalContext";
import { useNavigate, Link, useSearchParams} from "react-router-dom";
import { Toaster } from "react-hot-toast";

const Verify: React.FC = () => {
  const [check, setCheck] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const { authenticated, setAuthenticated } = useContext(GlobalContext);
  const token = searchParams.get('token')

  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/checkAuth`);

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

  const handleVerify = async () => {
    const VerifyPromise = async () => {
      const response = await axios.post(`${apiUrl}/auth/complete-signup`, {
    token
      });

      return response;
    };

    toast.promise(VerifyPromise(), {
      loading: "Verifying your account",
      success: (response) => {
        console.log(response);
        const { success } = response.data;

        if (success) {
          setAuthenticated(true);
          navigate("/login");
          return "Verification successful!";
        } else {
          throw new Error(response.data.message);
        }
      },
      error: (error) => {
        console.error("Verify failed:", error);
        navigate("/login");
        return "An error occurred";
      },
    });
  };

  useEffect(() => {
    handleVerify();
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h3>We are verifying your account please</h3>
      </div>
    </div>
  );
};

export default Verify;
