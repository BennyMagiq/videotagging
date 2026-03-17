import React, { useState } from 'react';
import '../styles/Dashboard.css';

const STATS = [
  { id: 'pass-by-length', title: 'Pass by Length', icon: '📊' },
  { id: 'pass-accuracy', title: 'Pass Accuracy', icon: '✅' },
  { id: 'shot-outcome', title: 'Shot Outcome', icon: '⚽' },
  { id: 'shots-on-target', title: 'Shots on Target', icon: '🎯' },
  { id: 'completed-dribbles', title: 'Completed Dribbles', icon: '🏃' },
  { id: 'dribbles-by-length', title: 'Dribbles by Length', icon: '📏' },
  { id: 'dribble-percentage', title: 'Dribble Percentage', icon: '📈' },
  { id: 'dribbles-by-direction', title: 'Dribbles by Direction', icon: '🧭' },
  { id: 'fouls', title: 'Fouls', icon: '⚠️' },
  { id: 'bookings', title: 'Bookings', icon: '🟨' },
  { id: 'saves-by-type', title: 'Saves by Type', icon: '🛡️' },
  { id: 'offside', title: 'Offside', icon: '🚩' },
  { id: 'distribution', title: 'Distribution by Type', icon: '📍' },
  { id: 'corners', title: 'Corners', icon: '🔄' },
  { id: 'gk-completion', title: 'GK Completion', icon: '🧤' },
  { id: 'gt-completion', title: 'Goal Threat Completion', icon: '💯' },
];

export default function Dashboard({ user, onSelectStat, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStats = STATS.filter((stat) =>
    stat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-top">
          <h1 className="dashboard-title">⚽ Video Tagging Analytics</h1>
          <div className="user-info">
            <span className="welcome-text">Welcome, {user.name}!</span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search statistics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <main className="stats-grid">
        {filteredStats.length > 0 ? (
          filteredStats.map((stat) => (
            <button
              key={stat.id}
              className="stat-card"
              onClick={() => onSelectStat(stat.id)}
            >
              <div className="stat-icon">{stat.icon}</div>
              <h3 className="stat-title">{stat.title}</h3>
              <span className="stat-arrow">→</span>
            </button>
          ))
        ) : (
          <p className="no-results">No statistics found</p>
        )}
      </main>
    </div>
  );
}
