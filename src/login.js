import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState ,useEffect} from "react";
import { auth } from "./firebase";
import { Link,useNavigate } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const teleport = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/home');  
      }
    });

    return () => teleport();
  }, [navigate]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      navigate('/home')
    } catch (error) {
      console.log(error.message);
      alert('Error occured:',error.message);
    }
  };

  return (
    <section className="formcontainer">

      <form onSubmit={handleSubmit}>
      <label>Login</label>

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
          type="password"
          className="forminput"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="">
        <button type="submit" className="btn">
          Login
        </button>
      </div>
      <p className="forminput" id="link">
        New user ?  
        <Link to='/signup'> Signup Here </Link>
      </p>
    </form>
    </section>
  );
}

export default Login;