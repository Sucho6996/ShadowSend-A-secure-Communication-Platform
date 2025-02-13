import Swal from "sweetalert2";

const useDecrypt = () => {
  const decryptAndRead = async (id, setDecryptedMessage) => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "You need to log in to decrypt messages.",
      });
      return;
    }

    try {
      const response = await fetch(`/user/decrypt?id=${id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDecryptedMessage(data.message); // Update decrypted message

        // Optionally blur the message content to indicate waiting for decryption
        // document.querySelector('.message-body').classList.add('blurred');

      } else if (response.status === 401) {
        // Handle Unauthorized error: User is logged out or token is invalid
        localStorage.removeItem("authToken"); // Remove token
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Your session has expired. Please log in again.",
        }).then(() => {
          window.location.href = "/login"; // Redirect to login page
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Decryption Failed",
          text: errorData.message || "An error occurred while decrypting the message.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to decrypt the message. Please try again later.",
      });
      console.error("Decryption Error:", error);
    }
  };

  return { decryptAndRead };
};

export default useDecrypt;
