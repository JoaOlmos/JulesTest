import React, { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { username, email, password } = formData;

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

    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const newUser = {
      username,
      email,
      password,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', newUser);
      console.log('Sign up successful:', res.data);
      setMessage('Sign up successful! You can now sign in.');
      // Optionally, clear form
      setFormData({ username: '', email: '', password: '' });
    } catch (err) {
      console.error('Sign up error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Sign up failed. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
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
            minLength="6" // Example: enforce minimum password length
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
