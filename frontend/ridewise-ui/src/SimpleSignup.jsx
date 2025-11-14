import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import ridewiseLogo from './assets/ridewise_logo.png';

function SimpleSignup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      setMessage('❌ Error: Passwords do not match!');
      return;
    }
    
    if (password.length < 6) {
      setMessage('❌ Error: Password must be at least 6 characters!');
      return;
    }

    if (!name.trim()) {
      setMessage('❌ Error: Please enter your full name!');
      return;
    }

    setMessage('Creating your account...');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name.trim()
      });
      
      setMessage('✅ Account created successfully! Redirecting...');
      
      // Wait a bit then navigate
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1500);
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = '❌ Error: ';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage += 'This email is already registered. Please login instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage += 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage += 'Password is too weak. Use at least 6 characters.';
      } else {
        errorMessage += error.message;
      }
      
      setMessage(errorMessage);
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
          <p style={{ color: '#666', margin: '10px 0 0 0', fontSize: '16px' }}>Create your account 🚀</p>
        </div>
        
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 'bold' }}>
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
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
              Username *
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Choose a username"
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
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
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
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
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
              Confirm Password *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter your password"
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
            Create Account 🎉
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '15px 20px',
            background: message.includes('❌') ? 'linear-gradient(135deg, #ff6b6b, #ee5a6f)' : 
                       message.includes('✅') ? 'linear-gradient(135deg, #51cf66, #37b24d)' :
                       'linear-gradient(135deg, #ffd93d, #f5b900)',
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            animation: 'slideIn 0.3s ease',
          }}>
            {message}
          </div>
        )}

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default SimpleSignup;
