import { useState } from "react";
import { useUserContext } from "../Context/userContext.js";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const {setUser} = useUserContext();

    const login = async (name,phNo, password) => {
        const success = validate(phNo, password); // Client-side input validation
        
        if (!success) return;

        try {
            setLoading(true); // Set loading to true while processing the request
            console.log("Attempting to log in:", phNo, password);

            // Make API call to the login endpoint
            const res = await fetch("/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name, phNo, password }),
            });

            // Parse the response
            const data = await res.json();

            if (res.ok) {
                console.log("Login successful. Token:", data.message); 
                // Handle successful login (store token in localStorage or state)
                localStorage.setItem("authToken", data.message); 
                setUser(data.message);
            } else {
                console.error("Login failed:", data.message); 
                // Handle login failure (display error message to user)
                alert(`Login failed: ${data.message}`);
            }
        } catch (e) {
            console.error("An error occurred during login:", e.message); 
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return { loading, login };
};

const validate = (phNo, password) => {
    if (!phNo || !password) {
        console.error("Phone number or password is missing.");
        alert("Phone number or password is missing.");
        return false;
    }

    if (phNo < 1000000000 || phNo > 9999999999) {
        console.error("Invalid phone number.");
        alert("Invalid phone number.");
        return false;
    }

    return true;
};

export default useLogin;
