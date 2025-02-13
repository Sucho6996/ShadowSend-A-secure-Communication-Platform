import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const useGetSix = () => {
  const [userViews, setUserViews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigation

  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Authorization token not found in localStorage.");
    }
    return token;
  };

  const fetchFirstSix = useCallback(async () => {
    setError("");
    setLoading(true);

    const authToken = getAuthToken();
    if (!authToken) {
      setError("Authorization token is missing. Please log in.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching data with JWT token...");
      const response = await fetch("/user/findfirstsix", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("authToken"); // Clear token
          navigate("/login"); // Redirect to login page
          return;
        }

        const errorMessage =
          response.status === 204
            ? "No content found."
            : `Error: ${response.status} - ${response.statusText}`;

        setError(errorMessage);
        return;
      }

      const data = await response.json();
      setUserViews(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  }, [navigate]); // Include `navigate` in dependency array

  return { userViews, error, loading, fetchFirstSix };
};

export default useGetSix;
