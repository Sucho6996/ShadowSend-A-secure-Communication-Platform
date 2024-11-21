import Swal from "sweetalert2";

const useDecrypt = () =>{
  const decryptAndRead = async (id,setDecryptedMessage) => {
     const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You need to log in to decrypt messages.',
      });
      return;
    }

    try {
      const response = await fetch(`/user/decrypt?id=${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDecryptedMessage(data.message); // Update decrypted message
 //       document.querySelector('.massage-body').classList.add('blurred'); // Blur background

      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Decryption Failed',
          text: errorData.message || 'An error occurred while decrypting the message.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to decrypt the message. Please try again later.',
      });
      console.log(error);
    }
  };

  return { decryptAndRead };
}

export default useDecrypt;

