import React, { useEffect, useState } from 'react';
import './MainFeed.css';
import picture from './project.jpeg';
import Swal from 'sweetalert2'; // Ensure SweetAlert is imported

function MainFeed() {
  const [formVisible, setFormVisible] = useState(false); // State for showing the popup form
  const [formData, setFormData] = useState({
    receiver: '',
    picture: null,
    message: '',
  });
  const [decryptedMessage, setDecryptedMessage] = useState(''); // State for decrypted message
  const [decryptedModalVisible, setDecryptedModalVisible] = useState(false); // State to control the decrypted message modal

  useEffect(() => {
    document.body.classList.add('mainfeed-body');
    return () => {
      document.body.classList.remove('mainfeed-body');
    };
  }, []);

  // Sample encrypted messages data
  const messages = [
    { sender: 'Jane Smith', encryptedMessage: 'SG93IGFyZSB5b3U/' },
    { sender: 'John Doe', encryptedMessage: 'U29ycnkgY29tcGxldGVseSBsb3ZlLg==' },
    { sender: 'Alice Johnson', encryptedMessage: 'VGhpcyBpcyBhIG1vcm5pbmc=' },
    { sender: 'Bob Brown', encryptedMessage: 'V2hhdCBhcmUgdm91IGRvaW5nLg==' },
    { sender: 'John Doe', encryptedMessage: 'U29ycnksIGhhdmUgeW91I==' },
    { sender: 'Jane Smith', encryptedMessage: 'VGhlIHBsYXRmb3JtIGZvciB04=' },
    { sender: 'Alice Johnson', encryptedMessage: 'VGhpcyBpcyBhIGZpbmFsIHNldHRpbmc=' },
    { sender: 'Bob Brown', encryptedMessage: 'V29ya2luZyBpbiB0aGVzIGdlbnJlLg==' },
    { sender: 'John Doe', encryptedMessage: 'VGVzdCBtZXNzYWdlLg==' },
  ];

  // Decrypt function
  const handleDecrypt = (encryptedMessage) => {
    const decodedMessage = atob(encryptedMessage); // Decode Base64
    setDecryptedMessage(decodedMessage); // Set decrypted message
    setDecryptedModalVisible(true); // Show the modal with decrypted message
    document.querySelector('.massage-body').classList.add('blurred'); // Add blur effect to the background
  };

  // Form data handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      picture: file,
    }));
  };

  // SweetAlert for sending message
  const handleSendMessageAlert = () => {
    Swal.fire({
      icon: 'success',
      title: 'Message Sent!',
      text: 'Your message has been successfully sent.',
      confirmButtonText: 'Okay'
    });
  };

  // Send message handler
  const handleSendFormMessage = () => {
    console.log('Message Sent:', formData);
    handleSendMessageAlert();
    closeForm();
  };

  // Open/close form
  const openForm = () => {
    setFormVisible(true);
    document.querySelector('.massage-body').classList.add('blurred');
  };

  const closeForm = () => {
    setFormVisible(false);
    document.querySelector('.massage-body').classList.remove('blurred');
    setFormData({
      receiver: '',
      picture: null,
      message: '',
    }); // Reset form data
  };

  // Close decrypted message modal and show success alert
  const closeDecryptedModal = () => {
    setDecryptedModalVisible(false);
    setDecryptedMessage(''); // Clear decrypted message
    document.querySelector('.massage-body').classList.remove('blurred'); // Remove blur effect
    Swal.fire({
      icon: 'success',
      title: 'Message Deleted!',
      text: 'The decrypted message has been deleted.',
      confirmButtonText: 'Okay'
    });
  };

  return (
    <div className="mainfeed">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">AppLogo</div>
        <div className="app-name">ShadowSend</div>
        <form className="form1" method="post">
          <div className="search-container">
            <input
              id="input1"
              type="text"
              placeholder="Search an element"
              name="element"
            />
            <button id="searchlogo" className="material-symbols-outlined" name="search">
              search
            </button>
          </div>
        </form>
        <i className="material-icons nav__icon new-message-btn" onClick={openForm}>
          edit_note
        </i>
      </nav>

      {/* Body */}
      <div className="massage-body">
        <div className="catalog-view">
          {messages.map((message, index) => (
            <div className="message-item" key={index}>
              <h2>
                <div className="sender">{message.sender}</div>
              </h2>
              <br />
              <img src={picture} alt="Sender" />
              <div className="encrypted-message">{message.encryptedMessage}</div>
              <button
                onClick={() => handleDecrypt(message.encryptedMessage)}
                className="decrypt-btn"
              >
                Read
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popup Form for Sending New Message */}
      {formVisible && (
        <div className="form-popup1">
          <a onClick={closeForm} id="close" className="material-icons nav__icon">
            close
          </a>
          <form className="box3">
            <center>
              <br />
              <br />
              <h2>Compose New Message</h2>
              <br />
              <input
                type="text"
                name="receiver"
                value={formData.receiver}
                onChange={handleInputChange}
                placeholder="Receiver"
                required
              />
              <br />
              <input
                type="file"
                name="picture"
                accept="image/*"
                onChange={handleFileChange}
              />
              <br />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Message"
                required
              ></textarea>
              <br />
              <button type="button" onClick={handleSendFormMessage}>
                Send Message
              </button>
            </center>
          </form>
        </div>
      )}

      {/* Decrypted Message Modal */}
      {decryptedModalVisible && (
        <div className="form-popup2">
          <a onClick={closeDecryptedModal} id="close" className="material-icons nav__icon">
            close
          </a>
          <form className="box3">
            <center>
              <br />
              <br />
              <h2>Decrypted Message</h2>
              <br />
              <p>{decryptedMessage}</p>
              <br />
              <button type="button" onClick={closeDecryptedModal}>
                OK, Now Delete It
              </button>
            </center>
          </form>
        </div>
      )}
    </div>
  );
}

export default MainFeed;
