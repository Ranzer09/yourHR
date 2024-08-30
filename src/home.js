import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc,updateDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { storage} from "./firebase";
import { getDownloadURL, ref,uploadBytes,deleteObject } from "firebase/storage";
import {v4} from 'uuid'

function Home() {
    
  const [userDetails, setUserDetails] = useState(null);
  const [fileUpload,setfileUpload]=useState(null)
  const [fileurl,setfileUrl]=useState(null)
  const [user,setcurrentUser]=useState(null)
  const [uploading,setuploading]=useState(null)
  const navigate = useNavigate();
  
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
    if (!user) 
      {
      navigate('/login');
      return;
      }
      setcurrentUser(user)
try{
    const docRef = doc(db, "Users", user.uid);
    const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userDetails = docSnap.data();
        setUserDetails(userDetails);
        if (userDetails.resumeurl) {
          setfileUrl(userDetails.resumeurl);
        }
      } else {
        alert("User data does not exist");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate('/login'); 
    }
  })};
  

  useEffect(() => {
    fetchUserData();
  }, []);


  const uploadResume= ()=>{
  
    if(fileUpload ==null){
      alert('Please select a file!')
      return
  };
  setuploading(true)
  const filename=fileUpload.name + v4()
  const resumeRef=ref(storage,`resumes/${filename}`)
 try { 
  uploadBytes(resumeRef,fileUpload).then(async()=>{

    getDownloadURL(resumeRef).then(async(url)=>{

      const userRef = doc(db, "Users", user.uid);
      console.log(userDetails.uid)
      await updateDoc(userRef, {
        resumeurl:url,
        resumeFilename: filename,
      });
      setfileUrl(url);    
      setuploading(null)
      alert('Resume Uploaded!')
      fetchUserData()
    })
  });
  } catch (error) {
    alert(`Error occured:${error.message}`)
  }

};

const deleteResume = async () => {
  try {
    if (!user || !userDetails.resumeurl) {
      console.error("No user or resume URL available");
      return;
    }
    setuploading(true)
    const resumeRef = ref(storage, userDetails.resumeurl);
    await deleteObject(resumeRef);
    alert('Resume file deleted successfully');

    const userDocRef = doc(db, "Users", user.uid);
    await updateDoc(userDocRef, {
      resumeurl: null,
      resumeFilename:null,
    });
    setfileUpload(null)
    setuploading(null)
    console.log('Firestore updated successfully');

    setfileUrl('');
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      resumeFilename:null,
      resumeurl: null,
    }));
  } catch (error) {
    console.error("Error deleting resume:", error);
  }
};

  async function handleLogout() {
    try {
      await auth.signOut();
      console.log("User logged out successfully!");
    } catch (error) {
      alert("Failed to log out. Please try again.");
    }
  }



  return (
    <>
      {userDetails ? (

        <div className="details">
          <label className="welcome ">Welcome {userDetails.Name}</label>
          <div className="details-1">
            <label>Email: {userDetails.email}</label>
            <label>Name: {userDetails.Name}</label>
            <label>Phone Number: {userDetails.number}</label>
          </div>

         {!fileurl?
         (
          <div className="resume">
            <label id="resumelabel" htmlFor="resume">Upload Your Resume!</label>
            <section className="resumeinputcontainer">
            <input className="resumeinput" type="file" name="resume" onChange={(e)=>{setfileUpload(e.target.files[0])}}/>
            <button className="resumebtn" disabled={uploading} onClick={uploadResume}>Upload Resume</button>
            </section>
          </div>
          ):
          (
            <div className="resume">
              <section className="resumeinputcontainer">
              <Link className="resumeinput" to={`${userDetails.resumeurl}`}>Uploaded Resume:{userDetails.resumeFilename}</Link>
              <button id='resumebtn' className="resumebtn" disabled={uploading} onClick={deleteResume}>Remove file</button>
              </section>
            </div>
          )}
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : 
      (
        <p>Loading...</p>
      )}
    </>
  );
}
export default Home;