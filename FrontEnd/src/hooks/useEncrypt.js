import Swal from "sweetalert2";

const useEncrypt = () => {
  const encryptAndSend = async (formData) => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized!",
        text: "Authorization token not found. Please log in again.",
      });
      return;
    }

    // 🔹 Validation before sending
    if (!formData.receiver || !formData.message.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields!",
        text: "Please enter a valid recipient and message.",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append(
      "message",
      new Blob(
        [
          JSON.stringify({
            rph: formData.receiver,
            message: formData.message,
          }),
        ],
        { type: "application/json" }
      )
    );

    // 🔹 Only append image if it exists
    if (formData.picture) {
      formDataToSend.append("image", formData.picture);
    }

    try {
      const response = await fetch("/user/encrypt", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Message Sent!",
          text: "Your message has been successfully sent.",
        }).then(() => {
          window.location.reload();
        });
      } else if (response.status === 401) {
        // 🔹 If Unauthorized, clear token and prompt login
        localStorage.removeItem("authToken");
        Swal.fire({
          icon: "error",
          title: "Session Expired!",
          text: "Your session has expired. Please log in again.",
        }).then(() => {
          window.location.href = "/login"; // Redirect to login
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: result.message || "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("Encryption Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to send the message. Try again later.",
      });
    }
  };

  return { encryptAndSend };
};

export default useEncrypt;
