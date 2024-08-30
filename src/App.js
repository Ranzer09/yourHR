import React, { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./login";
import SignUp from "./signup";
import Navbar from "./navbar";
import Home from "./home";

import { useState } from "react";
import { auth } from "./firebase";


function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });

  
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar/>
          <div className="maincontainer">
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/home" /> : <Login />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/home" element={<Home />} />
            </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;