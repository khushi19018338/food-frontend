import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../App.css';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const containerRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Load logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Fetch food reels
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await api.get('/api/food');
        setFoods(res.data.foodItems || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // ✅ Auto play / pause videos
  useEffect(() => {
    if (!containerRef.current) return;

    const videos = containerRef.current.querySelectorAll('video');
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.intersectionRatio >= 0.6) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0.6] }
    );

    videos.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
  }, [foods]);

  // ✅ Tap to play/pause
  const togglePlay = (e) => {
    const video = e.currentTarget.querySelector('video');
    if (!video) return;
    video.paused ? video.play() : video.pause();
  };

  return (
    <div className="container">
      <div className="form" ref={containerRef}>
        <h2>Home</h2>

        {user && (
          <div className="user-info">
            <h3>Logged in as:</h3>
            <p><strong>Full Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user._id}</p>
          </div>
        )}

        {loading && <p>Loading food items...</p>}
        {error && <p className="muted">{error}</p>}

        {!loading && !error && (
          foods.length === 0 ? (
            <p>No food items yet.</p>
          ) : (
            <div className="food-reels">
              {foods.map((f) => (
                <div
                  key={f._id}
                  className="food-reel"
                  onClick={togglePlay}
                >
                  {f.video ? (
                    <video
                      src={f.video}
                      muted
                      playsInline
                      loop
                      preload="metadata"
                    />
                  ) : (
                    <div style={{ height: '100vh', background: '#000' }} />
                  )}

                  <div className="reel-controls">
                    <div className="reel-desc">{f.description}</div>

                    <button
                      className="visit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        const partnerId =
                          f.foodPartner?._id ||
                          f.foodPartner ||
                          f.partnerId;

                        if (partnerId) {
                          navigate(`/partner/${partnerId}`);
                        } else if (f.storeUrl) {
                          window.open(f.storeUrl, '_blank');
                        }
                      }}
                    >
                      Visit Store
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
