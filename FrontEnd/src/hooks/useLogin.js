import { useState } from "react";
import { useUserContext } from "../Context/userContext.js";
import Swal from "sweetalert2";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setUser } = useUserContext();

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
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'You are now logged in!',
                    timer: 1000,  
                    showConfirmButton: false, 
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: data.message,
                }).then(() => {
                    window.location.reload();
                });
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong. Please try again later.',
            }).then(() => {
                window.location.reload();
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
            icon: 'warning',
            title: 'Input Error',
            text: 'Phone number or password is missing.',
        }).then(() => {
            window.location.reload();
        });
        return false;
    }

    if (phNo < 1000000000 || phNo > 9999999999) {
        Swal.fire({
            icon: 'warning',
            title: 'Input Error',
            text: 'Invalid phone number.', 
        }).then(() => {
            window.location.reload();
        });
        return false;
    }

    return true;
};

export default useLogin;
