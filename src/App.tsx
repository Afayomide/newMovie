import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Footer from "./components/footer/footer";
import { Toaster } from "react-hot-toast";
import Home from "./components/home/home";
import Upload from "./components/upload/upload";
import Verify from "./components/auth/verify";
import Update from "./components/update/update";

function App() {
  return (
    <Router>
      <div className="App">
        <div>
             <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            style: {
              background: "#ffd79f",
              color: "#00000",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/verify" element={<Verify/>}/>
          <Route path="/update" element={<Update/>}/>
        </Routes>
        </div>
     
        <Footer />
      </div>
    </Router>
  );
}

export default App;
