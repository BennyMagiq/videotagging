import { useState } from 'react';
import './App.css';
import './styles/AppShell.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DetailView from './components/DetailView';
import CsvProvider from './components/Context';
import DataPage from './components/DataPage';
import ExplorePage from './components/ExplorePage';

const PAGES = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'statistics', label: 'Statistieken', icon: '▥' },
  { id: 'players', label: 'Spelers', icon: '◯' },
  { id: 'teams', label: 'Teams', icon: '◇' },
  { id: 'data', label: 'Data', icon: '▤' }
];

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [selectedStat, setSelectedStat] = useState(null);

  const changePage = nextPage => { setSelectedStat(null); setPage(nextPage); };
  const logout = () => { setUser(null);setSelectedStat(null);setPage('dashboard'); };
  if (!user) return <Login onLogin={setUser} />;

  return <CsvProvider>
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-brand">⚽ <span>Video Tagging Analytics</span></div>
        <nav className="app-nav" aria-label="Hoofdnavigatie">
          {PAGES.map(item => <button key={item.id}
            type="button"
            className={'app-nav-item ' + (!selectedStat && page === item.id ? 'active' : '')}
            onClick={() => changePage(item.id)}>
            <span className="nav-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>
          </button>)}
        </nav>
      </aside>
      <div className="app-main">
        {selectedStat ? <DetailView statId={selectedStat} onBack={() => setSelectedStat(null)} /> :
         page === 'data' ? <DataPage /> :
         page === 'players' || page === 'teams' ? <ExplorePage type={page} onOpenStatistic={setSelectedStat}/> :
         <Dashboard user={user} onSelectStat={setSelectedStat} onLogout={logout} />}
      </div>
    </div>
  </CsvProvider>;
}
export default App;
