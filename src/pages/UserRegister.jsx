import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import '../App.css';

const UserRegister = () => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await api.post(
        '/api/auth/user/register',
        { fullName, email, password },
        { withCredentials: true }
      );

      console.log('User register success:', res.data);

      const token = res.data?.token;
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
      }

      const user = res.data?.user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      navigate('/home');

    } catch (err) {
      console.error('User register error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>User Register</h2>

        <div className="form-group">
          <label>Full name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Jane Doe"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="password-row">
            <input
              type={show ? 'text' : 'password'}
              name="password"
              placeholder="Create a password"
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
          Register
        </button>

        <p className="muted">
          Already have an account?{' '}
          <Link to="/user/login">User Login</Link> or{' '}
          <Link to="/food-partner/login">Food Partner Login</Link>
        </p>

        <p className="muted">
          Or register as{' '}
          <Link to="/food-partner/register">Food Partner</Link>
        </p>
      </form>
    </div>
  );
};

export default UserRegister;
