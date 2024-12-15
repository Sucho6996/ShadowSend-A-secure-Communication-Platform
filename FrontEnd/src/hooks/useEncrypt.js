import Swal from "sweetalert2";

const useEncrypt = () =>{
  const encryptAndSend = async (formData) => {
    // Prepare data for fetch request
    const token = localStorage.getItem('authToken'); // Example: Fetch token from localStorage
    console.log(token);
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized!',
        text: 'Authorization token not found.',
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append(
      'message',
      new Blob(
        [
          JSON.stringify({
            rph: formData.receiver,
            message: formData.message,
          }),
        ],
        { type: 'application/json' }
      )
    );
    formDataToSend.append('image', formData.picture);

    try {
      const response = await fetch('/user/encrypt', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent!',
          text: 'Your message has been successfully sent.',
        }).then(() => {
          // Reload the page after the SweetAlert success is confirmed
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: result.message || 'Something went wrong!',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to send the message. Try again later.',
      });
      console.log(error);
    }
  };
  return {encryptAndSend}
}
export default useEncrypt;
