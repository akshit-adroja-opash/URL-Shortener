import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './dashboard.css';

const API_BASE_URL = 'http://localhost:5000/api';
const REDIRECT_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

const Dashboard = () => {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUrl, setNewUrl] = useState('');
    const [shortLink, setShortLink] = useState('');
    const [showShortLink, setShowShortLink] = useState(false);
    const [stats, setStats] = useState({ total: 0, clicks: 0 });
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchUrls();
    }, [navigate, token]);

    const fetchUrls = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/links`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (response.ok) {
                setUrls(data);
                calculateStats(data);
            }
        } catch (error) {
            console.error('Error fetching URLs:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (urlList) => {
        setStats({
            total: urlList.length,
            clicks: urlList.reduce((sum, u) => sum + u.clicks, 0)
        });
    };

    const handleShorten = async (e) => {
        e.preventDefault();
        if (!newUrl) return;

        try {
            const response = await fetch(`${API_BASE_URL}/links`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ originalUrl: newUrl })
            });

            const data = await response.json();

            if (response.ok) {
                const fullShortUrl = `${REDIRECT_BASE_URL}/r/${data.slug}`;
                setShortLink(fullShortUrl);
                setShowShortLink(true);
                setNewUrl('');
                fetchUrls(); 
            }
        } catch (error) {
            console.error('Error shortening URL:', error);
        }
    };

    const handleCopy = (shortUrl) => {
        navigator.clipboard.writeText(shortUrl);
        alert('Copied to clipboard!');
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this link?")) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/links/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                setUrls(urls.filter(u => u._id !== id)); 
                calculateStats(urls.filter(u => u._id !== id));
            }
        } catch (error) {
            console.error('Error deleting URL:', error);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <Navbar />
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    

  return (
    <div className="dashboard-container">
      
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Links</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.clicks}</span>
          <span className="stat-label">Total Clicks</span>
        </div>
      </div>

      <section className="shorten-form-section">
        <h2>Shorten New URL</h2>
        <form onSubmit={handleShorten}>
          <div className="url-input-group">
            <input type="url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="Paste a long URL here..."/>
            <button type="submit" className="shorten-btn" disabled={!newUrl.trim()}>Shorten </button>
          </div>
          {showShortLink && (
            <div className="short-link-display show">
              <input type="text" value={shortLink} readOnly />
              <button className="copy-btn" onClick={() => handleCopy(shortLink)}>
                Copy
              </button>
            </div>
          )}
        </form>
      </section>

      <section className="urls-table-section">
        <h2>Your Short Links</h2>
        {urls.length === 0 ? (
          <div className="no-urls">
            <p>No shortened URLs yet. Create your first one above!</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
          <tr>
                  <th>Original URL</th>
                  <th>Short Link</th>
                  <th>Clicks</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <tr key={url._id}>
                    <td>{url.originalUrl}</td>
                    <td>
                      <span
                        className="short-code"
                        onClick={() => handleCopy(`${REDIRECT_BASE_URL}/r/${url.slug}`)}
                      >
                        {REDIRECT_BASE_URL}/r/{url.slug}
                      </span>
                    </td>
                    <td>{url.clicks}</td>
                    <td>{new Date(url.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="action-btn btn-copy"
                        onClick={() => handleCopy(`${REDIRECT_BASE_URL}/r/${url.slug}`)}
                      >
                        Copy
                      </button>
                      <button
                        className="action-btn btn-delete"
                        onClick={() => handleDelete(url._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
