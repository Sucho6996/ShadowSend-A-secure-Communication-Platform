import { useState } from "react";
import Swal from "sweetalert2";

const ForgotPassword = () => {

  const initiateForgotPassword = async () => {
    try {
      // Ask for the phone number
      const { value: phoneNumber, dismiss } = await Swal.fire({
        title: 'Enter your Phone Number',
        input: 'text',
        inputPlaceholder: 'Enter your phone number',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Phone number is required!';
          }
        },
      });

      if (dismiss === 'cancel') {
        window.location.reload(); 
        return;
      }

      if (!phoneNumber) return; 
      const phno = phoneNumber.toString();

      const sendOtpRes = await fetch(`/user/sendOtp?phNo=${phno}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const sendOtpData = await sendOtpRes.json();

      if (!sendOtpRes.ok) {
        throw new Error(sendOtpData?.error || 'Failed to send OTP.');
      }

      Swal.fire({
        icon: 'info',
        title: 'OTP Sent',
        text: 'Please check your phone for the OTP.',
        confirmButtonText: 'Verify OTP',
      });

      // Ask for OTP
      const { value: otp, dismiss: otpDismiss } = await Swal.fire({
        title: 'Enter OTP',
        input: 'text',
        inputPlaceholder: 'Enter the OTP',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'OTP is required!';
          }
        },
      });

      if (otpDismiss === 'cancel') {
        window.location.reload(); 
        return;
      }

      if (!otp) return; 

      await verifyOtp(phoneNumber, otp); 
    } catch (e) {
      console.error('OTP error:', e.message);
      Swal.fire({
        icon: 'error',
        title: 'OTP Failed',
        text: e.message || 'An error occurred while sending OTP.',
      }).then(() => {
        window.location.reload();
      });
    } 
  };

  const verifyOtp = async (phoneNumber, otp) => {
    try {

      const verifyRes = await fetch('/user/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phNo: phoneNumber, otp }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(verifyData?.error || 'OTP verification failed.');
      }

      Swal.fire({
        icon: 'success',
        title: 'OTP Verified',
        text: 'You can now reset your password.',
        confirmButtonText: 'OK',
      });

      // Proceed to reset password
      const { value: newPassword, dismiss: newPasswordDismiss } = await Swal.fire({
        title: 'Enter New Password',
        input: 'password',
        inputPlaceholder: 'Enter your new password',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'New password is required!';
          }
          if (value.length < 6) {
            return 'Password must be at least 6 characters long!';
          }
        },
      });

      if (newPasswordDismiss === 'cancel') {
        window.location.reload(); 
        return;
      }

      if (!newPassword) return; 

      const { value: confirmPassword, dismiss: confirmPasswordDismiss } = await Swal.fire({
        title: 'Confirm New Password',
        input: 'password',
        inputPlaceholder: 'Confirm your new password',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Confirm password is required!';
          }
        },
      });

      if (confirmPasswordDismiss === 'cancel') {
        window.location.reload(); 
        return;
      }

      if (!confirmPassword) return; 

      if (newPassword !== confirmPassword) {
        Swal.fire({
          icon: 'warning',
          title: 'Password Mismatch',
          text: 'New password and confirm password must match.',
        });
        return;
      }

      await resetPassword(phoneNumber, newPassword);
    } catch (e) {
      console.error('OTP verification error:', e.message);
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: e.message || 'An error occurred during OTP verification.',
      }).then(() => {
        window.location.reload();
      });
    } 
  };

  const resetPassword = async (phoneNumber, newPassword) => {
    try {
      const resetPasswordRes = await fetch('/user/resetPassword', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phNo: phoneNumber, otp: newPassword }),
      });
      const resetPasswordData = await resetPasswordRes.json();

      if (!resetPasswordRes.ok) {
        throw new Error(resetPasswordData?.error || 'Password reset failed.');
      }

      Swal.fire({
        icon: 'success',
        title: 'Password Reset',
        text: 'Your password has been successfully reset.',
        confirmButtonText: 'OK',
      }).then(() => {
        window.location.reload();
      });
    } catch (e) {
      console.error('Password reset error:', e.message);
      Swal.fire({
        icon: 'error',
        title: 'Password Reset Failed',
        text: e.message || 'An error occurred while resetting your password.',
      }).then(() => {
        window.location.reload();
      });
    } 
  };

  initiateForgotPassword();

  return null;
};

export default ForgotPassword;
