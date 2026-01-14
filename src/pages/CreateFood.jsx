import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const CreateFood = () => {
  const [showError, setShowError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const partnerData = localStorage.getItem('partner');
  const partner = partnerData ? JSON.parse(partnerData) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('name', e.target.name.value);
    formData.append('description', e.target.description.value);

    if (e.target.video.files[0]) {
      formData.append('video', e.target.video.files[0]);
    }

    try {
      const res = await api.post('/api/food', formData);

      console.log('Create food success:', res.data);

      const created = res.data.food;
      const partnerId = created?.foodPartner?._id || created?.foodPartner;

      if (partnerId) navigate(`/partner/${partnerId}`);
      else navigate('/home');

    } catch (err) {
      console.error('Create food error:', err.response?.data || err.message);
      setShowError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Create Food Item</h2>

        {partner && (
          <div className="partner-info">
            <h3>Logged in as:</h3>
            <p><strong>Business Name:</strong> {partner.businessName}</p>
            <p><strong>Email:</strong> {partner.email}</p>
            <p><strong>Partner ID:</strong> {partner._id}</p>
          </div>
        )}

        <div className="form-group">
          <label>Name</label>
          <input name="name" type="text" placeholder="Masala Dosa" required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" placeholder="Tasty..." required />
        </div>

        <div className="form-group">
          <label>Video</label>
          <input name="video" type="file" accept="video/*" />
        </div>

        {showError && <p className="muted">{showError}</p>}

        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default CreateFood;
