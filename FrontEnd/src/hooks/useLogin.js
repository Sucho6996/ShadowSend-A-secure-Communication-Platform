import { useState } from "react";
import { useUserContext } from "../Context/userContext.js";
import { useNavigate } from "react-router-dom"; 
import Swal from "sweetalert2";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setUser } = useUserContext();
    const navigate = useNavigate(); 

    const login = async (name, phNo, password) => {
        const success = validate(phNo, password);
        if (!success) return;

        try {
            setLoading(true);

            const res = await fetch("/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phNo, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("authToken", data.message);
                setUser(data.message);
                navigate("/MainFeed");
                Swal.fire({
                    icon: "success",
                    title: "Login Successful",
                    text: "You are now logged in!",
                    timer: 1000,
                    showConfirmButton: false,
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: data.message,
                });
            }
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong. Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

const validate = (phNo, password) => {
    if (!phNo || !password) {
        Swal.fire({
            icon: "warning",
            title: "Input Error",
            text: "Phone number or password is missing.",
        });
        return false;
    }

    if (!/^\d{10}$/.test(phNo)) {
        Swal.fire({
            icon: "warning",
            title: "Input Error",
            text: "Invalid phone number. Please enter a 10-digit number.",
        });
        return false;
    }

    return true;
};

export default useLogin;
