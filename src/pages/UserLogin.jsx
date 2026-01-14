import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import '../App.css';

const UserLogin = () => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await api.post(
        '/api/auth/user/login',
        { email, password },
        { withCredentials: true }
      );

      console.log('Login success:', res.data);

      const token = res.data?.token;
      if (token) {
        // ✅ correct: api instance me token set
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
      }

      const user = res.data?.user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      navigate('/home');

    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>User Login</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="password-row">
            <input
              name="password"
              type={show ? 'text' : 'password'}
              placeholder="Your password"
              required
            />
            <button
              type="button"
              className="toggle"
              onClick={() => setShow(s => !s)}
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error && <p className="muted">{error}</p>}

        <button className="button" type="submit">
          Login
        </button>

        <p className="muted">
          Don't have an account? <Link to="/user/register">Sign up</Link>
        </p>
        <p className="muted">
          Are you a partner? <Link to="/food-partner/register">Register as Food Partner</Link>
        </p>
      </form>
    </div>
  );
};

export default UserLogin;
