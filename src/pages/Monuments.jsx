import React, { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import MonumentCard from '../components/MonumentCard';
import heritageData from '../data/heritageData.json';
import { getStoredUser } from '../utils/authStorage';
import './Monuments.css';

const monumentsKey = 'heritage_monuments';

const getFavoritesStorageKey = (user) => {
  const suffix = user?.id ? String(user.id) : 'anon';
  return `heritage_favorites_${suffix}`;
};

const parseFavorites = (raw) => {
  try {
    const val = raw ? JSON.parse(raw) : [];
    if (Array.isArray(val)) return val;
    return [];
  } catch {
    return [];
  }
};

const Monuments = () => {
  const user = getStoredUser();

  const [monuments] = useState(() => {
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

  const categories = useMemo(() => {
    const unique = new Set(monuments.map((m) => m.category));
    return Array.from(unique).sort();
  }, [monuments]);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [unescoOnly, setUnescoOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const key = getFavoritesStorageKey(user);
    return parseFavorites(localStorage.getItem(key));
  });

  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  const onToggleLike = (id) => {
    const key = getFavoritesStorageKey(user);
    setFavorites((prev) => {
      const set = new Set(prev);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      const next = Array.from(set);
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return monuments.filter((m) => {
      const matchesQuery =
        q.length === 0 ||
        m.name.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q);

      const matchesCategory = category === 'All' ? true : m.category === category;
      const matchesUnesco = unescoOnly ? Boolean(m.unesco) : true;
      return matchesQuery && matchesCategory && matchesUnesco;
    });
  }, [category, query, unescoOnly, monuments]);

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content monuments-main fade-in">
        <div className="container">
          <header className="monuments-header">
            <h1 className="page-title">Monuments</h1>
            <p className="text-secondary">
              Search by name or location, then filter by heritage categories like Forts, Temples, and UNESCO sites.
            </p>
          </header>

          <SearchBar
            query={query}
            onQueryChange={setQuery}
            category={category}
            onCategoryChange={setCategory}
            categories={categories}
            unescoOnly={unescoOnly}
            onUnescoOnlyChange={setUnescoOnly}
            onClear={() => {
              setQuery('');
              setCategory('All');
              setUnescoOnly(false);
            }}
          />

          {filtered.length === 0 ? (
            <div className="empty-state shadow-card">
              <div className="empty-title">No matches found</div>
              <div className="text-secondary">Try a different search term or category.</div>
            </div>
          ) : (
            <div className="monuments-grid">
              {filtered.map((m) => (
                <MonumentCard
                  key={m.id}
                  monument={m}
                  liked={favoritesSet.has(m.id)}
                  onToggleLike={onToggleLike}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Monuments;
