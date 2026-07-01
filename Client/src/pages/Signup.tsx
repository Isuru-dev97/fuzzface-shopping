import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      const res = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('🎯 Registration Successful! Now go to Login page.');
        // e.currentTarget.dispatchEvent(new Event('reset'));
        if (emailRef.current) emailRef.current.value = '';
        if (passwordRef.current) passwordRef.current.value = '';
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error, please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #4f46e5, #c084fc)' }}>
      <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '40px', borderRadius: '15px', backdropFilter: 'blur(10px)', width: '350px', color: 'white', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
        <h2>Fuzz Mart - Sign Up 📝</h2>
        <p style={{ fontSize: '14px', opacity: 0.8 }}>Create a new admin account</p>

        {message && <p style={{ color: '#10b981', fontWeight: 'bold' }}>{message}</p>}
        {error && <p style={{ color: '#ef4444', fontWeight: 'bold' }}>{error}</p>}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input ref={emailRef} type="email" placeholder="Email Address" style={{ padding: '12px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white' }} required />
          <input ref={passwordRef} type="password" placeholder="Password" style={{ padding: '12px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white' }} required />
          <button type="submit" style={{ padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(90deg, #ec4899, #8b5cf6)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Register</button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/" style={{ color: '#c084fc', textDecoration: 'none', fontWeight: 'bold' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}