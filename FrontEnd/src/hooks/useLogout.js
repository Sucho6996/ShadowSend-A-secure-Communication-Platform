import { useState } from "react";
import { useUserContext } from "../Context/userContext.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from "sweetalert2";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserContext();
  const navigate = useNavigate(); // Initialize navigation
  const [error, setError] = useState("");

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  const logout = async () => {
    setError("");

    const authToken = getAuthToken();

    if (!authToken) {
      setError("Authorization token is missing. Please log in first.");
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "Do you really want to log out?",
      showCancelButton: true,
      confirmButtonText: "Yes, Log me out",
      cancelButtonText: "No, Keep me logged in",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await fetch("/user/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        let data = {};
        try {
          data = await response.json();
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }

        if (response.ok) {
          localStorage.removeItem("authToken");
          setUser(null);

          Swal.fire({
            icon: "success",
            title: "Logged Out!",
            text: data.message || "Logout successful.",
            confirmButtonText: "Okay",
          });

          navigate("/Forms"); // Redirect to login page after logout
        } else {
          setError(data.message || "Logout failed. Please try again.");
          Swal.fire({
            icon: "error",
            title: "Logout Failed!",
            text: data.message || "An error occurred. Please try again.",
            confirmButtonText: "Okay",
          });
        }
      } catch (err) {
        setError("An error occurred during logout. Please try again.");
        Swal.fire({
          icon: "error",
          title: "Logout Error",
          text: "An error occurred during logout. Please try again.",
          confirmButtonText: "Okay",
        });
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Logout canceled");
    }
  };

  return { loading, logout };
};

export default useLogout;
