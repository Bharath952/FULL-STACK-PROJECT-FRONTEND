import React, { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import heritageData from '../data/heritageData.json';
import { getStoredUser } from '../utils/authStorage';
import MonumentCard from '../components/MonumentCard';
import { Link } from 'react-router-dom';
import './DashboardHeritage.css';

const favoritesKey = (user) => `heritage_favorites_${user?.id ? String(user.id) : 'anon'}`;
const monumentsKey = 'heritage_monuments';
const quizAttemptsKey = (user) => `heritage_quiz_attempts_${user?.id ? String(user.id) : 'anon'}`;

const parseArray = (raw) => {
  try {
    const val = raw ? JSON.parse(raw) : [];
    return Array.isArray(val) ? val : [];
  } catch {
    return [];
  }
};

const toSlugId = (name) => {
  const base = String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return base ? base : `monument-${Date.now()}`;
};

const Dashboard = () => {
  const user = getStoredUser();

  const [monuments, setMonuments] = useState(() => {
    const raw = localStorage.getItem(monumentsKey);
    if (!raw) return heritageData.monuments;
    try {
      const val = JSON.parse(raw);
      if (Array.isArray(val) && val.length > 0) return val;
    } catch {
      // ignore
    }
    return heritageData.monuments;
  });

  const [activeTab, setActiveTab] = useState('User');

  const categories = useMemo(() => {
    const unique = new Set(monuments.map((m) => m.category));
    return Array.from(unique).sort();
  }, [monuments]);

  const [favorites, setFavorites] = useState(() => {
    const raw = localStorage.getItem(favoritesKey(user));
    return parseArray(raw);
  });
  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  const [quizAttempts, setQuizAttempts] = useState(() => {
    const raw = localStorage.getItem(quizAttemptsKey(user));
    return parseArray(raw).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  });

  const persistMonuments = (next) => {
    setMonuments(next);
    localStorage.setItem(monumentsKey, JSON.stringify(next));
  };

  const toggleFavorite = (monumentId) => {
    setFavorites((prev) => {
      const set = new Set(prev);
      if (set.has(monumentId)) set.delete(monumentId);
      else set.add(monumentId);
      const next = Array.from(set);
      localStorage.setItem(favoritesKey(user), JSON.stringify(next));
      return next;
    });
  };

  const [editingId, setEditingId] = useState(null);
  const editingTarget = useMemo(() => monuments.find((m) => m.id === editingId), [editingId, monuments]);

  const [editDraft, setEditDraft] = useState(null);
  const startEdit = (m) => {
    setEditingId(m.id);
    setEditDraft({
      name: m.name || '',
      location: m.location || '',
      category: m.category || 'Forts',
      unesco: Boolean(m.unesco),
      description: m.description || '',
      tourDescription: m.tourDescription || '',
      imagesText: (m.images || []).map((im) => im.src).join('\n')
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const saveEdit = () => {
    if (!editingTarget || !editDraft) return;
    const images = editDraft.imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6)
      .map((src) => ({ src, alt: editDraft.name }));

    const next = monuments.map((m) => {
      if (m.id !== editingTarget.id) return m;
      return {
        ...m,
        name: editDraft.name.trim() || m.name,
        location: editDraft.location.trim() || m.location,
        category: editDraft.category,
        unesco: Boolean(editDraft.unesco),
        description: editDraft.description,
        tourDescription: editDraft.tourDescription,
        images: images.length ? images : m.images
      };
    });
    persistMonuments(next);
    cancelEdit();
  };

  const deleteMonument = (monumentId) => {
    const next = monuments.filter((m) => m.id !== monumentId);
    persistMonuments(next);
    // Remove from favorites if it existed.
    setFavorites((prev) => prev.filter((id) => id !== monumentId));
  };

  const [newDraft, setNewDraft] = useState({
    name: '',
    location: '',
    category: categories[0] || 'Forts',
    unesco: false,
    description: '',
    tourDescription: '',
    imagesText: ''
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const name = newDraft.name.trim();
    const location = newDraft.location.trim();
    if (!name || !location) return;

    const images = newDraft.imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6)
      .map((src) => ({ src, alt: name }));

    const id = toSlugId(name) + `-${Date.now()}`;

    const nextMonument = {
      id,
      name,
      location,
      category: newDraft.category,
      unesco: Boolean(newDraft.unesco),
      description: newDraft.description || `A new heritage monument: ${name}.`,
      tourDescription: newDraft.tourDescription || `A guided virtual-tour intro for ${name}.`,
      images: images.length
        ? images
        : [{ src: 'https://placehold.co/1200x800/png?text=New+Monument', alt: name }],
      videoUrl: null,
      comments: [
        {
          name: 'Demo Visitor',
          message: 'Created via the Creator panel (demo-only UI).'
        }
      ]
    };

    persistMonuments([nextMonument, ...monuments]);
    setNewDraft({
      name: '',
      location: '',
      category: categories[0] || 'Forts',
      unesco: false,
      description: '',
      tourDescription: '',
      imagesText: ''
    });
  };

  const resetDemo = () => {
    localStorage.removeItem(monumentsKey);
    localStorage.removeItem(favoritesKey(user));
    localStorage.removeItem(quizAttemptsKey(user));
    setMonuments(heritageData.monuments);
    setFavorites([]);
    setQuizAttempts([]);
    setActiveTab('User');
    cancelEdit();
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content dashboard-heritage fade-in">
        <div className="container">
          <header className="dashboard-hero">
            <div>
              <h1 className="dashboard-title">Dashboard</h1>
              <p className="text-secondary dashboard-subtitle">
                Demo-only Admin / Creator / User panels (frontend only).
              </p>
            </div>

            <div className="dashboard-tabs">
              {['Admin', 'Creator', 'User'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`tab-btn ${activeTab === t ? 'active' : ''}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </header>

          <div className="dashboard-actions">
            <button type="button" className="btn btn-secondary" onClick={resetDemo}>
              Reset demo data
            </button>
          </div>

          {activeTab === 'Admin' ? (
            <section className="panel">
              <h2 className="panel-title">Admin: Manage Monuments</h2>
              <p className="text-secondary">Edit and delete monument cards (stored in localStorage).</p>

              <div className="admin-monuments">
                {monuments.map((m) => (
                  <div key={m.id} className="admin-card shadow-card">
                    <div className="admin-card-top">
                      <div>
                        <div className="admin-name">{m.name}</div>
                        <div className="admin-meta text-secondary">
                          {m.category} • {m.location} {m.unesco ? '• UNESCO' : ''}
                        </div>
                      </div>
                      <div className="admin-actions">
                        <button type="button" className="btn btn-light" onClick={() => startEdit(m)}>
                          Edit
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => deleteMonument(m.id)}>
                          Delete
                        </button>
                      </div>
                    </div>

                    {editingId === m.id && editDraft ? (
                      <div className="admin-editor">
                        <div className="editor-grid">
                          <div className="form-group">
                            <label>Name</label>
                            <input
                              className="form-control"
                              value={editDraft.name}
                              onChange={(e) => setEditDraft((p) => ({ ...p, name: e.target.value }))}
                            />
                          </div>
                          <div className="form-group">
                            <label>Location</label>
                            <input
                              className="form-control"
                              value={editDraft.location}
                              onChange={(e) => setEditDraft((p) => ({ ...p, location: e.target.value }))}
                            />
                          </div>
                          <div className="form-group">
                            <label>Category</label>
                            <select
                              className="form-control"
                              value={editDraft.category}
                              onChange={(e) => setEditDraft((p) => ({ ...p, category: e.target.value }))}
                            >
                              {categories.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="toggle-label">
                              <input
                                type="checkbox"
                                checked={editDraft.unesco}
                                onChange={(e) => setEditDraft((p) => ({ ...p, unesco: e.target.checked }))}
                              />
                              UNESCO site
                            </label>
                          </div>
                          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Description</label>
                            <textarea
                              className="form-control"
                              rows={3}
                              value={editDraft.description}
                              onChange={(e) => setEditDraft((p) => ({ ...p, description: e.target.value }))}
                            />
                          </div>
                          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Virtual tour guide text</label>
                            <textarea
                              className="form-control"
                              rows={2}
                              value={editDraft.tourDescription}
                              onChange={(e) => setEditDraft((p) => ({ ...p, tourDescription: e.target.value }))}
                            />
                          </div>
                          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Images (one URL per line)</label>
                            <textarea
                              className="form-control"
                              rows={3}
                              value={editDraft.imagesText}
                              onChange={(e) => setEditDraft((p) => ({ ...p, imagesText: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="editor-actions">
                          <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                            Cancel
                          </button>
                          <button type="button" className="btn btn-primary" onClick={saveEdit}>
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === 'Creator' ? (
            <section className="panel">
              <h2 className="panel-title">Creator: Add a Monument</h2>
              <p className="text-secondary">This form adds a monument card into localStorage (demo-only).</p>

              <form className="creator-form" onSubmit={handleCreate}>
                <div className="editor-grid">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      className="form-control"
                      value={newDraft.name}
                      onChange={(e) => setNewDraft((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      className="form-control"
                      value={newDraft.location}
                      onChange={(e) => setNewDraft((p) => ({ ...p, location: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      className="form-control"
                      value={newDraft.category}
                      onChange={(e) => setNewDraft((p) => ({ ...p, category: e.target.value }))}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={newDraft.unesco}
                        onChange={(e) => setNewDraft((p) => ({ ...p, unesco: e.target.checked }))}
                      />
                      UNESCO site
                    </label>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={newDraft.description}
                      onChange={(e) => setNewDraft((p) => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Virtual tour guide text</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={newDraft.tourDescription}
                      onChange={(e) => setNewDraft((p) => ({ ...p, tourDescription: e.target.value }))}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Images (one URL per line)</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={newDraft.imagesText}
                      onChange={(e) => setNewDraft((p) => ({ ...p, imagesText: e.target.value }))}
                      placeholder={`https://placehold.co/1200x800/png?text=New+Monument\nhttps://placehold.co/1200x800/png?text=Another+View`}
                    />
                  </div>
                </div>

                <div className="editor-actions">
                  <button type="submit" className="btn btn-primary">
                    Add Monument
                  </button>
                </div>
              </form>
            </section>
          ) : null}

          {activeTab === 'User' ? (
            <section className="panel">
              <h2 className="panel-title">User: Favorites & Quiz History</h2>

              <div className="user-sections">
                <div className="user-block">
                  <div className="user-block-title">Your Favorites</div>
                  {favorites.length === 0 ? (
                    <p className="text-secondary">No favorites yet. Like monuments from the Monuments page.</p>
                  ) : (
                    <div className="favorites-grid">
                      {monuments
                        .filter((m) => favoritesSet.has(m.id))
                        .slice(0, 8)
                        .map((m) => (
                          <MonumentCard
                            key={m.id}
                            monument={m}
                            liked={favoritesSet.has(m.id)}
                            onToggleLike={toggleFavorite}
                            compact
                          />
                        ))}
                    </div>
                  )}
                </div>

                <div className="user-block">
                  <div className="user-block-title">Quiz Attempts</div>
                  {quizAttempts.length === 0 ? (
                    <p className="text-secondary">No quiz attempts yet. Play the quiz and come back here!</p>
                  ) : (
                    <div className="attempt-list">
                      {quizAttempts.slice(0, 10).map((a) => (
                        <div key={a.id} className="attempt-card shadow-card">
                          <div className="attempt-top">
                            <div className="attempt-score">
                              {a.score} / {a.total}
                            </div>
                            <div className="attempt-date text-secondary">
                              {a.date ? new Date(a.date).toLocaleString() : ''}
                            </div>
                          </div>
                          <div className="attempt-actions">
                            <Link to="/quiz" className="btn btn-light" style={{ padding: '0.55rem 1.15rem' }}>
                              Play Again
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;

