import { useState, useEffect } from "react";

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Authorization token not found in localStorage.");
    }
    return token;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const authToken = getAuthToken();
      console.log(authToken);

      if (!authToken) {
        setError("Authorization token is missing. Please log in.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching data with JWT token..."); 

        const authString = `Bearer ${authToken}`;
        console.debug(authToken);

        // Await the response from fetch
        const response = await fetch("/user/profile", {
          method: "GET",
          headers: {
            'Authorization': authString,
            'Content-Type': 'application/json', // Add content-type if expecting JSON
          },
        });

        if (!response) {
          const errorData = await response.json();
          
          console.error("Response Error:", response.status, errorData);
          
          throw new Error(errorData.message || `Failed to fetch profile. Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data) {
          throw new Error("Empty response body or malformed JSON.");
        }

        setProfile(data);
        console.log("Profile details:", data); // Log the profile details

      } catch (err) {
        setError(err.message);
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};

export default useProfile;
