import { useState, useCallback } from "react";

const useGetSix = () => {
  const [userViews, setUserViews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    console.log(authToken);

    if (!authToken) {
      setError("Authorization token is missing. Please log in.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching data with JWT token..."); // Debug log

      const authString =`Bearer ${authToken}`;
      console.debug(authToken);

      const response = fetch("/user/findfirstsix", {
        method: "GET",
        headers: {
        'Authorization':authString,
        //'Content-Type': 'text/plain',
      },
      }).then(response => response.json())
        .then(data => setUserViews(data))
      
        .catch(error => console.error('Error:', error));

      if (!response.ok) {
        console.log("oops")
        const errorMessage = response.status === 204
          ? "No content found."
          : response.status === 401
          ? "Session expired. Please log in again."
          : `Error: ${response.status} - ${response.statusText}`;
        
        if (response.status === 401) {
          //localStorage.removeItem("authToken"); // Clear token if unauthorized
          console.log("you are unauthorized")
        }

        setError(errorMessage);
        return;
      }

      //const data = await response.json();
      //setUserViews(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { userViews, error, loading, fetchFirstSix };
};

export default useGetSix;
