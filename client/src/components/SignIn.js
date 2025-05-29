import React, { useState } from 'react';
import axios from 'axios';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear previous messages when user starts typing
    setMessage('');
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const credentials = {
      email,
      password,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signin', credentials);
      console.log('Sign in successful:', res.data);
      localStorage.setItem('token', res.data.token);
      setMessage('Sign in successful!');
      // Optionally, clear form
      setFormData({ email: '', password: '' });
    } catch (err) {
      console.error('Sign in error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Sign in failed. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
