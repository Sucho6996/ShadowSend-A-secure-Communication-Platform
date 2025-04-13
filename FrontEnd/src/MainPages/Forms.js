import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Css/Forms.css';
import useLogin from '../Hooks/useLogin.js';
import useSignup from '../Hooks/useSignup.js';
import ForgotPassword from '../Hooks/ForgotPassword.js';

const Forms = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [data, setData] = useState({ name: '', phNo: '', password: '' });

  const { loginLoading, login } = useLogin();
  const { signupLoading, signup } = useSignup();
  const navigate = useNavigate();

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
    generateCaptcha();
  }, [generateCaptcha]);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prevState) => !prevState);
  }, []);

  const toggleForm = useCallback(() => {
    setIsSignup((prev) => {
      const newState = !prev;
      setData({ name: '', phNo: '', password: '' });
      setUserCaptcha('');
      setCaptchaError(false);
      generateCaptcha();
      return newState;
    });
  }, [generateCaptcha]);

  // Handle login
  const handleLogin = useCallback(() => {
    if (userCaptcha === captcha) {
      login(data.name, data.phNo, data.password);
    } else {
      setCaptchaError(true);
      setTimeout(() => setCaptchaError(false), 3000); 
    }
  }, [captcha, userCaptcha, data, login, navigate]);

  // Handle signup
  const handleSignup = useCallback(() => {
    signup(data.name, data.phNo, data.password);
    navigate('/mainfeed'); 
  }, [data, signup, navigate]);

  // Memoized input handler
  const handleInputChange = useCallback(
    (field) => (e) => {
      setData((prev) => ({ ...prev, [field]: e.target.value }));
    },
    []
  );

  // Handle Forgot Password click
  const handleForgotPassword = () => {
    ForgotPassword(); 
  };

  return (
    <div className={`container ${isSignup ? 'change' : ''}`}>
      <div className="forms-container">
        {/* Signup Form */}
        {isSignup ? (
          <div className="form-control signup-form">
            <form>
              <h2>SIGN UP</h2><br></br>
              <div className="input-wrapper">
                <i className="fas fa-user icon"></i>
                <input type="text" placeholder="Name" value={data.name} onChange={handleInputChange('name')} required />
              </div>
              <div className="input-wrapper">
                <i className="fas fa-phone-alt icon"></i>
                <input type="text" placeholder="Phone no." value={data.phNo} onChange={handleInputChange('phNo')} required />
              </div>
              <div className="input-wrapper">
                <i className="fas fa-key icon"></i>
                <input type={passwordVisible ? 'text' : 'password'} placeholder="Password" value={data.password} onChange={handleInputChange('password')} required />
                <i className={`fa ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'} toggle-password`} onClick={togglePasswordVisibility}></i>
              </div>
              <button type="button" onClick={handleSignup} disabled={signupLoading}>
                {signupLoading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
          </div>
        ) : (
          /* Login Form */
          <div className="form-control signin-form">
            <form>
              <h2>LOGIN</h2><br></br>
              <div className="input-wrapper">
                <i className="fas fa-user icon"></i>
                <input type="text" placeholder="Name" value={data.name} onChange={handleInputChange('name')} required />
              </div>
              <div className="input-wrapper">
                <i className="fas fa-phone-alt icon"></i>
                <input type="text" placeholder="Registered number" value={data.phNo} onChange={handleInputChange('phNo')} required />
              </div>
              <div className="input-wrapper">
                <i className="fas fa-key icon"></i>
                <input type={passwordVisible ? 'text' : 'password'} placeholder="Password" value={data.password} onChange={handleInputChange('password')} required />
                <i className={`fa ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'} toggle-password`} onClick={togglePasswordVisibility}></i>
              </div>
              <div className="captcha-container">
                <div className="captcha-display"><span>{captcha}</span></div>
                <div className="input-wrapper">
                  <input type="text" placeholder="Enter CAPTCHA" value={userCaptcha} onChange={(e) => setUserCaptcha(e.target.value)} required />
                </div>
              </div>
              {captchaError && <div className="captcha-error">Incorrect CAPTCHA, please try again.</div>}
              <button type="button" onClick={handleLogin} disabled={loginLoading}>
                {loginLoading ? 'Logging In...' : 'Log In'}
              </button>
              <br />
              <a onClick={handleForgotPassword}>Forgot Password?</a>
            </form>
          </div>
        )}
      </div>

      {/* Intro Section */}
      <div className="intros-container">
        <div className="intro-control signin-intro">
          <div className="intro-control__inner">
            <h1>Welcome back to ShadowSend!</h1>
            <p>A Secure Communication Platform! Let’s keep your messages safe.</p>
            <button onClick={toggleForm}>No account yet? Sign Up.</button>
          </div>
        </div>

        <div className="intro-control signup-intro">
          <div className="intro-control__inner">
            <h1>Come join ShadowSend!</h1>
            <p>Sign up now to send SMS securely.</p>
            <button onClick={toggleForm}>Already have an account? Sign In.</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Forms);
