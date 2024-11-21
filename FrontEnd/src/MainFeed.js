import React, { useEffect, useState } from 'react';
import './MainFeed.css';
import Swal from 'sweetalert2'; // Ensure SweetAlert is imported
import useLogout from './hooks/useLogout.js';
import useGetSix from './hooks/useGetSix.js';
import useEncrypt from './hooks/useEncrypt.js';
import useDecrypt from './hooks/useDecrypt.js';
import logo from './5ef71ab8-3a74-433a-9a02-74ecb56bbf52.webp'

function MainFeed({setCurrentView}) {
  const [formVisible, setFormVisible] = useState(false); // State for showing the popup form
  const [formData, setFormData] = useState({
    receiver: '',
    picture: null,
    message: '',
  });
  const [decryptedMessage, setDecryptedMessage] = useState(''); // State for decrypted message
  const [decryptedModalVisible, setDecryptedModalVisible] = useState(false); // State to control the decrypted message modal
  const { logout} = useLogout(setCurrentView);
  const {userViews,error,fetchFirstSix} = useGetSix();
  const {encryptAndSend} = useEncrypt();
  const {decryptAndRead} = useDecrypt();

  useEffect(() => {
    fetchFirstSix()
    document.body.classList.add('mainfeed-body');
    
    return () => {
      document.body.classList.remove('mainfeed-body');
    };
  }, [fetchFirstSix]);
  
  console.log(userViews);
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
  const handleDecrypt = (id) => {
    //const decodedMessage = atob(encryptedMessage); // Decode Base64
    decryptAndRead(id,setDecryptedMessage);
    //setDecryptedMessage(decodedMessage); // Set decrypted message
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
    encryptAndSend(formData);
    //handleSendMessageAlert();

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
                window.location.reload(); // This will reload the page

  };

  const handleLogout = () =>{
    console.log("loggingout");
    logout();
  }

  return (
    <div className="mainfeed">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo"><img src={logo} alt='logo' height={50} width={50}  /> </div>
        <div className="app-name">ShadowSend</div>
        <form className="form1" method="post">
         {/* <div className="search-container">
            <input
              id="input1"
              type="text"
              placeholder="Search an element"
              name="element"
            />
            <button id="searchlogo" className="material-symbols-outlined" name="search">
              search
            </button>
          </div>*/}
        </form>
        <i className="material-icons nav__icon new-message-btn" onClick={openForm}>
          edit_note
        </i>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      {/* Body */}
      <div className="massage-body">
        <div className="catalog-view">
          {userViews.length <=0 ? <h1 className='sadText'> You have no new messages 😿</h1>:userViews.map((user) => (
            <div className="message-item" key={user.messageId}>
              <h2>
                <div className="sender">{user.senderName}</div>
              </h2>
              <br />
               <img src={`data:image/jpeg;base64,${user.image}`} alt="Sender" id="uimg" />
              <div className="encrypted-message">{new Date(user.timeStamp).toLocaleString()}</div>
              <button
                onClick={() => handleDecrypt(user.messageId)}
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
