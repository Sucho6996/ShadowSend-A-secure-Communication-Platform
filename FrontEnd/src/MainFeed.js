import React, { useState, useEffect, useCallback } from 'react';
import './Css/MainFeed.css';
import Swal from 'sweetalert2'; 
import useLogout from './hooks/useLogout.js';
import useGetSix from './hooks/useGetSix.js';
import useEncrypt from './hooks/useEncrypt.js';
import useDecrypt from './hooks/useDecrypt.js';
import useProfile from './hooks/useProfile';
import logo from './logo.webp';
import ChangePassword from './hooks/ChangePassword'; 

const MainFeed = ({ setCurrentView }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    receiver: '',
    picture: null,
    message: '',
  });
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [decryptedModalVisible, setDecryptedModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { logout } = useLogout(setCurrentView);
  const { userViews, error, fetchFirstSix } = useGetSix();
  const { encryptAndSend } = useEncrypt();
  const { decryptAndRead } = useDecrypt();

  useEffect(() => {
    fetchFirstSix();
    document.body.classList.add('mainfeed-body');

    return () => {
      document.body.classList.remove('mainfeed-body');
    };
  }, [fetchFirstSix]);

  // Use useCallback to memoize handlers
  const handleDecrypt = useCallback((id) => {
    decryptAndRead(id, setDecryptedMessage);
    setDecryptedModalVisible(true);
    setFormVisible(false);  
    document.querySelector('.massage-body').classList.add('blurred');
  }, [decryptAndRead]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please upload an image file.',
      });
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      picture: file,
    }));
  }, []);

  const handleSendFormMessage = useCallback(() => {
    encryptAndSend(formData);
    closeForm();
  }, [formData, encryptAndSend]);

  const openForm = useCallback(() => {
    setFormVisible(true);
    document.querySelector('.massage-body').classList.add('blurred'); 
  }, []);

  const closeForm = useCallback(() => {
    setFormVisible(false);
    setFormData({
      receiver: '',
      picture: null,
      message: '',
    });
    document.querySelector('.massage-body').classList.remove('blurred'); 
  }, []);

  const closeDecryptedModal = useCallback(() => {
    setDecryptedModalVisible(false);
    setDecryptedMessage('');
    document.querySelector('.massage-body').classList.remove('blurred'); 
    Swal.fire({
      icon: 'success',
      title: 'Message Deleted!',
      text: 'The decrypted message has been deleted.',
      confirmButtonText: 'OK',
    }).then(() => {
      window.location.reload();
    });
  }, [fetchFirstSix]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const toggleDropdown = useCallback(() => {
    setDropdownVisible((prev) => {
      const isVisible = !prev;
      const bodyElement = document.querySelector('.massage-body');
      if (isVisible) {
        bodyElement.classList.add('blurred');
      } else {
        bodyElement.classList.remove('blurred');
      }
      return isVisible;
    });
  }, []);

  const closeDropdown = useCallback(() => {
    setDropdownVisible(false);
    document.querySelector('.massage-body').classList.remove('blurred'); 
  }, []);

  const { profile, loading, errors } = useProfile();

  if (loading) return <div>Loading...</div>;
  if (errors) return <div>Error: {errors}</div>;

  const profileName = profile ? profile.name : 'Guest';
  const profilePhone = profile ? profile.phNo : 'N/A';

  // Handle Change Password
  const handleChangePassword = () => {
      ChangePassword();
  };

  return (
    <div className="mainfeed">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="logo" height={50} width={50} />
        </div>
        <div className="app-name">ShadowSend</div>
        <i className="material-icons nav__icon new-message-btn" onClick={openForm}>
          edit_note
        </i>
        <div className="user-icon-container" onBlur={closeDropdown}>
          <i className="material-icons user-icon" onClick={toggleDropdown}>
            account_circle
          </i>
          {dropdownVisible && (
            <div className="profile-view-dropdown">
              <div className="profile-header">
              <div className="profile-icon">
                {profileName && profileName.length > 0 ? (
                  <span className="profile-initial">{profileName.charAt(0).toUpperCase()}</span>
                ) : (
                  <i className="material-icons user-profile-icon">account_circle</i>
                )}
              </div>

                <div className="profile-info">
                  <h3>{profileName}</h3>
                  <div className='phno'><b>Phone</b><b> number: </b> <p>{profilePhone}</p></div>
                  <a onClick={handleChangePassword}>Change Password</a> 
                  <div className="logout-div" onClick={handleLogout}>
                    <i className="material-icons logout">logout</i>
                    <p>Logout</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </nav>

      {/* Body */}
      <div className="massage-body">
        <div className="catalog-view">
          {userViews.length <= 0 ? (
            <h1 className="sadText">You have no new messages 😿</h1>
          ) : (
            userViews.map((user) => (
              <div className="message-item" key={user.messageId}>
                <h2>
                  <div className="sender">{user.senderName}</div>
                </h2>
                <br />
                <img src={`data:image/jpeg;base64,${user.image}`} alt="Sender" />
                <div className="encrypted-message">{new Date(user.timeStamp).toLocaleString()}</div>
                <button
                  onClick={() => handleDecrypt(user.messageId)}
                  className="decrypt-btn"
                >
                  Read
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Popup Form for Sending New Message */}
      {formVisible && (
        <div className="form-popup1">
          <a onClick={closeForm} id="close" className="material-icons nav__icon">
            close
          </a><br />
          <form className="box3">
            <center>
              <h2>Compose New Message</h2><br />
              <input
                type="text"
                name="receiver"
                value={formData.receiver}
                onChange={handleInputChange}
                placeholder="Receiver"
                required
              />
              <input
                type="file"
                name="picture"
                accept="image/*"
                onChange={handleFileChange}
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Message"
                required
              ></textarea>
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
          </a><br />
          <form className="box3">
            <center>
              <h2>Decrypted Message</h2><br />
              <p>{decryptedMessage}</p><br />
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

export default React.memo(MainFeed);
