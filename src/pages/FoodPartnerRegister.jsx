import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import '../App.css';

const FoodPartnerRegister = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const businessName = e.target.businessName.value;
    const email = e.target.email.value;
    const contactNumber = e.target.contactNumber.value;
    const address = e.target.address.value;
    const cuisineType = e.target.cuisineType.value;
    const password = e.target.password.value;

    try {
      const res = await api.post(
        '/api/auth/food-partner/register',
        { businessName, email, contactNumber, address, cuisineType, password },
        { withCredentials: true }
      );

      console.log('Partner register success:', res.data);

      const token = res.data?.token;
      if (token) {
        // ✅ correct place to set token
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
      }

      const partner = res.data?.foodPartner;
      if (partner) {
        localStorage.setItem('partner', JSON.stringify(partner));
      }

      navigate('/create-food');

    } catch (err) {
      console.error('Partner register error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Food Partner Register</h2>

        <div className="form-group">
          <label>Business name</label>
          <input
            name="businessName"
            type="text"
            placeholder="My Food Stall"
            required
          />
        </div>

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
          <label>Contact number</label>
          <input
            name="contactNumber"
            type="tel"
            placeholder="+91 9876543210"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            name="address"
            type="text"
            placeholder="123 Market St, City"
          />
        </div>

        <div className="form-group">
          <label>Cuisine type</label>
          <select name="cuisineType" required>
            <option value="">Select cuisine</option>
            <option>Indian</option>
            <option>Chinese</option>
            <option>Italian</option>
            <option>Mexican</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="password-row">
            <input
              name="password"
              type={show ? 'text' : 'password'}
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

        <div className="form-group">
          <label>
            <input type="checkbox" required /> I agree to the terms and policies
          </label>
        </div>

        <button className="button" type="submit">
          Register
        </button>

        <p className="muted">
          Already have an account? <Link to="/food-partner/login">Login</Link>
        </p>
        <p className="muted">
          Or sign up as a <Link to="/user/register">Normal User</Link>
        </p>
      </form>
    </div>
  );
};

export default FoodPartnerRegister;
