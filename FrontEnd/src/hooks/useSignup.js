import { useState } from "react";

const useSignup = () => {
  const [loading, setLoading] = useState(false);

  const signup = async (name, phNo, password) => {
 const success = validate(name, phNo, password);

  if (!success) return;

  try {
    setLoading(true);

    const res = await fetch("/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phNo, password }),
    });

    let data;
    try {
      data = await res.json(); // Try to parse JSON response
    } catch (_e) {
      data = await res.text(); // Fallback to text if JSON parsing fails
    }

    if (!res.ok) {
      throw new Error(data.error || data || "Something went wrong");
    }

    console.log("Signup successful:", data);

  } catch (e) {
    console.error("Signup error:", e.message);
  } finally {
    setLoading(false);
  }
};

  return { loading, signup };
};

const validate = (name, phNo, password) => {
  if (!name || !phNo || !password) {
    console.error("Some inputs are missing");
    return false;
  }

  if (phNo < 1000000000 || phNo > 9999999999) {
    console.error("Not a valid phone number");
    return false;
  }

  return true;
};

export default useSignup;
