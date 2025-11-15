import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import ridewiseLogo from './assets/ridewise_logo.png';

function SimpleLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem('ridewise_email') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(localStorage.getItem('ridewise_remember') === 'true');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('ridewise_email', email);
        localStorage.setItem('ridewise_remember', 'true');
      } else {
        localStorage.removeItem('ridewise_email');
        localStorage.removeItem('ridewise_remember');
      }
      
      setMessage('Login successful! ✅');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(20,184,166,0.4)',
        width: '100%',
        maxWidth: '450px'
      }}>
        {/* Logo and Title */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img 
            src={ridewiseLogo} 
            alt="RideWise Logo" 
            style={{ width: '80px', height: '80px', marginBottom: '15px', borderRadius: '16px' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h1 style={{ color: '#14b8a6', margin: '0', fontSize: '28px', fontWeight: '900' }}>
            RIDEWISE
          </h1>
          <p style={{ color: '#666', margin: '10px 0 0 0', fontSize: '16px' }}>Welcome back! 🚗</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 'bold' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 'bold' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ marginRight: '8px', cursor: 'pointer', width: '18px', height: '18px' }}
            />
            <label htmlFor="rememberMe" style={{ color: '#555', fontSize: '14px', cursor: 'pointer' }}>
              Remember me
            </label>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: '800',
              cursor: 'pointer',
              marginTop: '10px',
              boxShadow: '0 4px 15px rgba(20,184,166,0.3)'
            }}
          >
            Login 🚀
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: message.includes('Error') ? '#ffebee' : '#e8f5e9',
            color: message.includes('Error') ? '#c62828' : '#2e7d32',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
          Don't have an account?{' '}
          <a href="/" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default SimpleLogin;
