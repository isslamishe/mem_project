'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Login.module.css';

export default function LoginPage() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'student',
    acceptPolicy: false
  });
  const animationSideRef = useRef(null);

  useEffect(() => {
    checkRole();
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkRole = async () => {
    
    const token = localStorage.getItem('token');
    console.log(token)
    if (!token) return;

    try {
      const res = await fetch('https://8290e2f1-719d-4741-bb3b-0b75975ea92c-00-2e7aan01o959s.picard.replit.dev/GetRole', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(res.ok)
      {const data = await res.json();
     
   window.location.href = `/${data.newId.encryptedID}?iv=${data.newId.iv}`;
     }else{ localStorage.removeItem('token')}
    
     return 
      
    } catch (error) {
      console.error('Role check failed:', error);
    }
  };

 

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 790);
  };

  const handleFormSwitch = () => {
    setIsLoginForm(!isLoginForm);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async () => {
    if (!isValidEmail(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const res = await fetch(
        `https://8290e2f1-719d-4741-bb3b-0b75975ea92c-00-2e7aan01o959s.picard.replit.dev/login?password=${formData.password}&email=${formData.email}`
      );
      console.log(res.ok)
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        checkRole();
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignup = async () => {
    if (!isValidEmail(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const res = await fetch(
        `https://8290e2f1-719d-4741-bb3b-0b75975ea92c-00-2e7aan01o959s.picard.replit.dev/signin?FIRST_NAME=${formData.firstName}&LAST_NAME=${formData.lastName}&PASSWORD=${formData.password}&EMAIL=${formData.email}&ROLE=${formData.role}`
      );
      if (res.ok) {
        alert('Signup successful! Please login.');
        setIsLoginForm(true);
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.infoside} ${isMobile ? styles.mobileInfoside : ''}`}>
        {isLoginForm ? (
          <div className={styles.logininput}>
            <div className={styles.inputs}>
              <div className={styles.inputGroup}>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <p className={styles.linkText}>
                Forgot your <a href="#">password</a>?
              </p>
            </div>
            <button className={styles.loginbutton} onClick={handleLogin}>
              LOGIN
            </button>
            <p className={styles.aboutpage}>
              Want to know more <a href="#">about</a> us?
            </p>
          </div>
        ) : (
          <div className={styles.sighupinputs}>
            <div className={styles.switchbuttons}>
              <button
                className={`${styles.formSwitch} ${isLoginForm ? styles.active : ''}`}
                onClick={() => setIsLoginForm(true)}
              >
                Login
              </button>
              <button
                className={`${styles.formSwitch} ${!isLoginForm ? styles.active : ''}`}
                onClick={() => setIsLoginForm(false)}
              >
                Sign Up
              </button>
            </div>
            <div className={styles.inputGroup}>
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.roleSelection}>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === 'student'}
                  onChange={handleInputChange}
                />
                Student
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="Prof"
                  checked={formData.role === 'Prof'}
                  onChange={handleInputChange}
                />
                Professor
              </label>
            </div>
            <div className={styles.policyAgreement}>
              <label>
                <input
                  type="checkbox"
                  name="acceptPolicy"
                  checked={formData.acceptPolicy}
                  onChange={handleInputChange}
                />
                Accept our policies
              </label>
            </div>
            <button className={styles.signbutton} onClick={handleSignup}>
              SIGN UP
            </button>
          </div>
        )}
      </div>

      <div
        ref={animationSideRef}
        className={`${styles.anmationside} ${isMobile ? styles.mobileAnmationside : ''}`}
      >
        <h1 className={styles.logo}>CHOOSE</h1>
        {!isMobile && (
          <button className={styles.signb} onClick={handleFormSwitch}>
            {isLoginForm ? 'Sign Up' : 'Login'}
          </button>
        )}
      </div>
    </div>
  );
}