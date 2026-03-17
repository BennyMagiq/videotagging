import { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DetailView from './components/DetailView';
import CsvProvider from './components/Context';



function App() {
  const [user, setUser] = useState(null);
  const [selectedStat, setSelectedStat] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedStat(null);
  };

  const handleSelectStat = (statId) => {
    setSelectedStat(statId);
  };

  const handleBack = () => {
    setSelectedStat(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <CsvProvider>
      {selectedStat ? (
        <DetailView statId={selectedStat} onBack={handleBack} />
      ) : (
        <Dashboard user={user} onSelectStat={handleSelectStat} onLogout={handleLogout} />
      )}
    </CsvProvider>
  );
}

export default App;