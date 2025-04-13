import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Swal from "sweetalert2";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const signup = async (name, phNo, password) => {
    const success = validate(name, phNo, password);
    if (!success) return;

    try {
      setLoading(true);
      const phno = phNo.toString();

      // Step 1: Send OTP
      const sendOtpRes = await fetch(`/user/sendOtp?phNo=${phno}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      if (sendOtpRes.ok) {
        Swal.fire({
          icon: "info",
          title: "OTP Sent",
          text: "Please check your phone for the OTP.",
          confirmButtonText: "Verify OTP",
        });

        // Step 2: Verify OTP
        const { value: otp } = await Swal.fire({
          title: "Verify Phone Number",
          input: "text",
          inputLabel: "Enter the OTP sent to your phone",
          inputPlaceholder: "Enter OTP",
          inputValidator: (value) => {
            if (!value) return "You need to enter the OTP!";
          },
          showCancelButton: true,
          confirmButtonText: "Verify",
        });

        if (!otp) return;

        const verifyRes = await fetch("/user/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phNo, otp }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok) {
          Swal.fire({
            icon: "success",
            title: "OTP Verified",
            text: "You can now proceed with signing up.",
            confirmButtonText: "OK",
          });

          // Step 3: Finalize Signup
          const res = await fetch("/user/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phNo, password }),
          });

          const signupData = await res.json();
          if (res.ok) {
            Swal.fire({
              icon: "success",
              title: "Signup Successful",
              text: "Your account has been created successfully. Please log in.",
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/MainFeed"); 
            });
          } else {
            throw new Error(signupData.error || "Phone number already exists.");
          }
        } else {
          throw new Error(verifyData.error || "OTP verification failed.");
        }
      } else {
        throw new Error((await sendOtpRes.json()).Message || "Failed to send OTP.");
      }
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

// Validation function
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
