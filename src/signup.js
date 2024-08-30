import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState,useEffect } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { Link,useNavigate } from "react-router-dom";


function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const teleport = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/login');  
      }
    });
    return () => teleport();
  }, [navigate]);


  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          Name: name,
          number: number,
        });
      }
      console.log("User Signed up Successfully!!");
      navigate('/login')
    } catch (error) {
      console.log(error.message);
      alert(`Error occured:${error.message}`)
    }
  };

  return (
    <section className="formcontainer">
    <form onSubmit={handleSignup}>
  
      <label className="signup">Sign Up</label>

      <div className="input">
        <input
          type="text"
          className="forminput"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="input">

        <input
          type="email"
          className="forminput"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="input">
        <input
          type="text"
          className="forminput"
          placeholder="Enter Phone number"
          maxLength="10"
          onChange={(e) => setNumber(e.target.value)}
          required
        />
      </div>

      <div className="input">
        <input
          type="password"
          className="forminput"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <button type="submit" className="btn">
          Sign Up
        </button>
      </div>
      <p className="forminput" id="link">
        Already Signed up ?  <Link to='/login'> Login</Link>
      </p>
    </form>
    </section>
  );
}
export default Signup;