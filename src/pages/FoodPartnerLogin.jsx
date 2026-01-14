import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import '../App.css';

const FoodPartnerLogin = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await api.post(
        '/api/auth/food-partner/login',
        { email, password },
        { withCredentials: true }
      );

      console.log('Partner login success:', res.data);

      const token = res.data?.token;
      if (token) {
        localStorage.setItem('token', token); // ✅ enough
      }

      const partner = res.data?.foodPartner;
      if (partner) {
        localStorage.setItem('partner', JSON.stringify(partner));
      }

      navigate('/create-food');
    } catch (err) {
      console.error('Partner login error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Food Partner Login</h2>

        <div className="form-group">
          <label>Contact email</label>
          <input
            name="email"
            type="email"
            placeholder="partner@example.com"
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

        <button className="button" type="submit">
          Login
        </button>

        <p className="muted">
          Don't have an account? <Link to="/food-partner/register">Sign up</Link>
        </p>
        <p className="muted">
          Or login as a <Link to="/user/login">User</Link>
        </p>
      </form>
    </div>
  );
};

export default FoodPartnerLogin;
