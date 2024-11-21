import {  useState } from "react";
import { useUserContext } from "../Context/userContext.js";
import Swal from "sweetalert2";

const useLogout = (setCurrentView) => {
  const [loading,setLoading] = useState(false);
  const {setUser} = useUserContext();
  

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Retrieve the authToken from localStorage or another secure place
  const getAuthToken = () => {
    return localStorage.getItem("authToken"); // Adjust as per your storage logic
  };

 const logout = async () => {
  setMessage('');
  setError('');

  const authToken = getAuthToken();

  console.log(authToken);

  if (!authToken) {
    setError('Authorization token is missing. Please log in first.');
    return;
  }

  try {
    const response = await fetch('/user/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    let data = {};
    try {
      data = await response.json();
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }

    if (response.ok) {
      localStorage.removeItem('authToken');
      setUser(null); 
      Swal.fire({
        icon: 'success',
        title: 'Logged Out!',
        text: data.message || 'Logout successful.',
        confirmButtonText: 'Okay'
      });

      setCurrentView('Forms');
    } else {
      setError(data.message || 'Logout failed. Please try again.');
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed!',
        text: data.message || 'An error occurred. Please try again.',
        confirmButtonText: 'Okay'
      });
    }
  } catch (err) {
    setError('An error occurred during logout. Please try again.');
    Swal.fire({
      icon: 'error',
      title: 'Logout Error',
      text: 'An error occurred during logout. Please try again.',
      confirmButtonText: 'Okay'
    });
    console.log(err);
  }
};
  return {loading , logout}
}

export default useLogout;

