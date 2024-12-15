import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './Css/Forms.css'; // Import the CSS
import useLogin from './hooks/useLogin.js';
import useSignup from './hooks/useSignup.js';

const Forms = ({ onViewSwitch }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  const [data, setData] = useState({
    name: '',
    phNo: '',
    password: '',
  });

  const { loginLoading, login } = useLogin();
  const { signupLoading, signup } = useSignup();

  // Generate CAPTCHA on-demand
  const generateCaptcha = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captchaString = '';
    for (let i = 0; i < 6; i++) {
      captchaString += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptcha(captchaString);
  }, []);

  useEffect(() => {
    generateCaptcha(); // Generate CAPTCHA on component mount
  }, [generateCaptcha]);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prevState) => !prevState);
  }, []);

  // Toggle form and reset input fields
  const toggleForm = useCallback(() => {
    setIsSignup((prev) => {
      const newState = !prev;
      // Reset form fields when switching forms
      setData({
        name: '',
        phNo: '',
        password: '',
      });
      setUserCaptcha(''); // Clear the CAPTCHA input field
      setCaptchaError(false); // Clear CAPTCHA error state
      generateCaptcha();
      return newState;
    });
  }, []);

  // Handle login
  const handleLogin = useCallback(() => {
    if (userCaptcha === captcha) {
      login(data.name, data.phNo, data.password);
    } else {
      setCaptchaError(true);
      setTimeout(() => setCaptchaError(false), 3000); // Clear error after 3 seconds
    }
  }, [captcha, userCaptcha, data, login]);

  // Handle signup
  const handleSignup = useCallback(() => {
    signup(data.name, data.phNo, data.password);
  }, [data, signup]);

  // Memoized input handler
  const handleInputChange = useCallback(
    (field) => (e) => {
      setData((prev) => ({ ...prev, [field]: e.target.value }));
    },
    []
  );

  return (
    <div className={`container ${isSignup ? 'change' : ''}`}>
      <div className="forms-container">
        {/* Signup Form */}
        {isSignup && (
          <div className="form-control signup-form">
            <form action="#">
              <h2>SIGN UP</h2><br/>
              <div className="input-wrapper">
                <i className="fas fa-user icon"></i>
                <input type="text" placeholder="Name" value={data.name} onChange={handleInputChange('name')} required />
              </div>
              <div className="input-wrapper">
                <i className="fas fa-phone-alt icon"></i>
                <input type="number" placeholder="Phone no." value={data.phNo} onChange={handleInputChange('phNo')} required />
              </div>
              <div className="input-wrapper">
                <i className="fas fa-key icon"></i>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Password"
                  value={data.password}
                  onChange={handleInputChange('password')}
                  required
                />
                <i
                  className={`fa ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'} toggle-password`}
                  onClick={togglePasswordVisibility}
                ></i>
              </div>
              <button type="button" onClick={handleSignup} disabled={signupLoading}>
                {signupLoading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
          </div>
        )}

        {/* Signin Form */}
        {!isSignup && (
          <div className="form-control signin-form">
            <form action="#">
              <h2>LOGIN</h2><br />
              <div className="input-wrapper">
                <i className="fas fa-user icon"></i>
                <input type="text" placeholder="Name" value={data.name} onChange={handleInputChange('name')} required />
              </div>
              <div className="input-wrapper">
                <i className="fas fa-user icon"></i>
                <input type="text" placeholder="Registered number" value={data.phNo} onChange={handleInputChange('phNo')} required />
              </div>
              <div className="input-wrapper">
                <i className="fas fa-key icon"></i>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Password"
                  value={data.password}
                  onChange={handleInputChange('password')}
                  required
                />
                <i
                  className={`fa ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'} toggle-password`}
                  onClick={togglePasswordVisibility}
                ></i>
              </div>
              <div className="captcha-container">
                <div className="captcha-display">
                  <span>{captcha}</span>
                </div>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter CAPTCHA"
                    value={userCaptcha}
                    onChange={(e) => setUserCaptcha(e.target.value)}
                    required
                  />
                </div>
              </div>
              {captchaError && <div className="captcha-error">Incorrect CAPTCHA, please try again.</div>}
              <button type="button" onClick={handleLogin} disabled={loginLoading}>
                {loginLoading ? 'Logging In...' : 'Log In'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Intro Section */}
      <div className="intros-container">
        <div className="intro-control">
          <div className="intro-control__inner">
            <h1>{isSignup ? 'Come join ShadowSend!' : 'Welcome back to ShadowSend!'}</h1>
            <p>{isSignup ? 'Sign up now to send SMS securely.' : 'Your security is our priority.'}</p>
            <button onClick={toggleForm}>
              {isSignup ? 'Already have an account? Sign In.' : 'No account yet? Sign Up.'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Forms);
