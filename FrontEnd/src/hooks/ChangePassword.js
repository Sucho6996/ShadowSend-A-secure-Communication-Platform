import Swal from "sweetalert2";

const ChangePassword = () => {
  const initiateChangePassword = async () => {
    try {
      // Send OTP to phone number
      const sendOtpRes = await fetch("/user/sendOtpSecure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const sendOtpData = await sendOtpRes.json();

      if (!sendOtpRes.ok) {
        throw new Error(sendOtpData?.error || "Failed to send OTP.");
      }

      Swal.fire({
        icon: "info",
        title: "OTP Sent",
        text: "Please check your phone for the OTP.",
        confirmButtonText: "Verify OTP",
      });

      // Collect phone number and OTP
      const { value: phoneAndOtp, dismiss: dismissAction } = await Swal.fire({
        title: "Verify Phone Number",
        html: `
          <input type="text" id="phone" class="swal2-input" placeholder="Enter your phone number">
          <input type="text" id="otp" class="swal2-input" placeholder="Enter the OTP">
        `,
        showCancelButton: true,
        preConfirm: () => {
          const phone = Swal.getPopup().querySelector("#phone").value;
          const otp = Swal.getPopup().querySelector("#otp").value;

          if (!phone || !otp) {
            Swal.showValidationMessage("Phone number and OTP are required!");
          }

          return { phone, otp };
        },
      });

      if (dismissAction === "cancel" || !phoneAndOtp) {
        window.location.reload();
        return;
      }

      const { phone, otp } = phoneAndOtp;

      // Verify OTP
      await verifyOtp(phone, otp);
    } catch (e) {
      console.error("OTP error:", e.message);
      Swal.fire({
        icon: "error",
        title: "OTP Failed",
        text: e.message || "An error occurred while sending OTP.",
      }).then(() => {
        window.location.reload();
      });
    }
  };

  const verifyOtp = async (phone, otp) => {
    try {
      const verifyRes = await fetch("/user/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phNo: phone, otp }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(verifyData?.error || "OTP verification failed.");
      }

      Swal.fire({
        icon: "success",
        title: "OTP Verified",
        text: "You can now reset your password.",
        confirmButtonText: "OK",
      });

      // Reset password
      await resetPasswordFlow(phone);
    } catch (e) {
      console.error("OTP verification error:", e.message);
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: e.message || "An error occurred during OTP verification.",
      }).then(() => {
        window.location.reload();
      });
    }
  };

  const resetPasswordFlow = async (phone) => {
    try {
      const { value: newPassword, dismiss: newPasswordDismiss } = await Swal.fire({
        title: "Enter New Password",
        input: "password",
        inputPlaceholder: "Enter your new password",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "New password is required!";
          }
          if (value.length < 6) {
            return "Password must be at least 6 characters long!";
          }
        },
      });

      if (newPasswordDismiss === "cancel" || !newPassword) {
        window.location.reload();
        return;
      }

      const { value: confirmPassword, dismiss: confirmPasswordDismiss } = await Swal.fire({
        title: "Confirm New Password",
        input: "password",
        inputPlaceholder: "Confirm your new password",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "Confirm password is required!";
          }
        },
      });

      if (confirmPasswordDismiss === "cancel" || !confirmPassword) {
        window.location.reload();
        return;
      }

      if (newPassword !== confirmPassword) {
        Swal.fire({
          icon: "warning",
          title: "Password Mismatch",
          text: "New password and confirm password must match.",
        });
        return;
      }

      // Reset password
      await resetPassword(phone, newPassword);
    } catch (e) {
      console.error("Password reset error:", e.message);
      Swal.fire({
        icon: "error",
        title: "Password Reset Failed",
        text: e.message || "An error occurred during password reset.",
      }).then(() => {
        window.location.reload();
      });
    }
  };

  const resetPassword = async (phno, newPassword) => {
    try {
      const resetPasswordRes = await fetch('/user/resetPassword', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phNo: phno, otp: newPassword }),
      });

      const resetPasswordData = await resetPasswordRes.json();

      if (!resetPasswordRes.ok) {
        throw new Error(resetPasswordData?.error || 'Password reset failed.');
      }

      Swal.fire({
        icon: "success",
        title: "Password Reset",
        text: "Your password has been successfully reset. Please login again.",
        confirmButtonText: "OK",
      }).then(async () => {
        const response = await fetch('/user/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            'Content-Type': 'application/json',
          },
        });
        let data = {};
        try {
          data = await response.json();
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }

        if (response.ok) {
          localStorage.removeItem('authToken');         
            window.location.reload();
        }        
      });
    } catch (e) {
      console.error("Password reset error:", e.message);
      Swal.fire({
        icon: "error",
        title: "Password Reset Failed",
        text: e.message || "An error occurred while resetting your password.",
      }).then(() => {
        window.location.reload();
      });
    }
  };

  initiateChangePassword();

  return null;
};

export default ChangePassword;
