import { useState } from "react";
import Swal from "sweetalert2";

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
        data = await res.json(); 
      } catch (_e) {
        data = await res.text(); 
      }

      if (!res.ok) {
        const errorMessage =
          data?.error || (typeof data === "string" ? data : "Phone number already exists");

        if (errorMessage === "Phone number already exists") {
          Swal.fire({
            icon: "error",
            title: "Signup Failed",
            text: "This phone number is already registered. Please log in.",
          });
          return;
        }

        throw new Error(errorMessage);
      }

      console.log("Signup successful:", data);

      Swal.fire({
        icon: "success",
        title: "Signup Successful",
        text: "Your account has been created successfully. Please log in.",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload(); 
      });

    } catch (e) {
      console.error("Signup error:", e.message);

      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: e.message || "An error occurred during signup.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

const validate = (name, phNo, password) => {
  if (!name || !phNo || !password) {
    Swal.fire({
      icon: "warning",
      title: "Validation Error",
      text: "Please fill in all the required fields.",
    });
    return false;
  }

  if (phNo.toString().length !== 10 || isNaN(phNo)) {
    Swal.fire({
      icon: "warning",
      title: "Invalid Phone Number",
      text: "Please enter a valid 10-digit phone number.",
    });
    return false;
  }

  if (password.length < 6) {
    Swal.fire({
      icon: "warning",
      title: "Weak Password",
      text: "Password must be at least 6 characters long.",
    });
    return false;
  }

  return true;
};

export default useSignup;
