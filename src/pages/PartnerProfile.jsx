import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import '../App.css';

const PartnerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [partner, setPartner] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1️⃣ Fetch all food items
        const foodRes = await api.get('/api/food');
        const allFoods = foodRes.data.foodItems || [];

        // 2️⃣ Filter foods by partner
        const filtered = allFoods.filter((f) => {
          const pid = f.foodPartner?._id || f.foodPartner || f.partnerId;
          return String(pid) === String(id);
        });

        setFoods(filtered);

        // 3️⃣ Derive partner info from food
        if (filtered.length > 0) {
          const fp = filtered[0].foodPartner;
          setPartner(fp || { businessName: `Partner ${id}` });
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="form">
          <p>Loading partner...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="form">
          <p className="muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form">
        <h2>{partner?.businessName || 'Partner'}</h2>
        <p><strong>Email:</strong> {partner?.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {partner?.contactNumber || 'N/A'}</p>
        <p><strong>Address:</strong> {partner?.address || 'N/A'}</p>
        <p><strong>Cuisine:</strong> {partner?.cuisineType || 'N/A'}</p>

        <h3>Offerings</h3>

        {foods.length === 0 ? (
          <p>No items available.</p>
        ) : (
          foods.map((f) => (
            <div key={f._id} className="food-card">
              <h4>{f.name}</h4>
              <p>{f.description}</p>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="button" onClick={() => navigate('/home')}>
                  Back
                </button>
                <OrderForm food={f} partnerId={id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const OrderForm = ({ food, partnerId }) => {
  const [qty, setQty] = useState(1);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async () => {
    setLoading(true);
    setMsg(null);
    try {
      await api.post('/api/order', {
        foodId: food._id,
        partnerId,
        quantity: qty,
        address,
      });
      setMsg('Order placed successfully');
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        type="number"
        min={1}
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        style={{ width: 60 }}
      />
      <input
        type="text"
        placeholder="Delivery address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button className="button" onClick={submit} disabled={loading}>
        {loading ? 'Ordering...' : 'Order'}
      </button>
      {msg && <span className="muted">{msg}</span>}
    </div>
  );
};

export default PartnerProfile;
