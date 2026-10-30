import React, { useContext, useMemo } from 'react';
import { CsvContext } from './Context';
import './DataPage.css';

export default function ExplorePage({ type, onOpenStatistic }) {
  const rows = useContext(CsvContext);
  const key = type === 'players' ? 'Player Name' : 'Team Name';
  const title = type === 'players' ? 'Spelers' : 'Teams';
  const list = useMemo(() => {
    const map = new Map();
    rows.forEach(row => {
      const name = row[key];
      if (!name || name === '-') return;
      if (!map.has(name)) map.set(name, { name, events: 0, passes: 0, shots: 0, dribbles: 0, duels: 0 });
      const item = map.get(name);
      item.events++;
      if (row.Event === 'Pass') item.passes++;
      if (row.Event === 'Shots' || row.Event === 'Shot') item.shots++;
      if (row.Event === 'Dribbles' || row.Event === 'Dribble') item.dribbles++;
      if (row.Event === 'Duel') item.duels++;
    });
    return [...map.values()].sort((a,b) => b.events - a.events);
  }, [rows, key]);

  return <section className="data-page">
    <div className="page-intro"><h1>{title}</h1><p>Overzicht op basis van de actieve CSV-dataset.</p></div>
    <div className="data-panel data-preview">
      {list.length ? <div className="preview-scroll"><table>
        <thead><tr><th>{type === 'players' ? 'Speler' : 'Team'}</th><th>Acties</th><th>Passes</th><th>Schoten</th><th>Dribbels</th><th>Duels</th></tr></thead>
        <tbody>{list.map(item => <tr key={item.name}><td>{item.name}</td><td>{item.events}</td><td>{item.passes}</td><td>{item.shots}</td><td>{item.dribbles}</td><td>{item.duels}</td></tr>)}</tbody>
      </table></div> : <p>Geen gegevens gevonden.</p>}
      <button className="data-secondary" onClick={() => onOpenStatistic('pass-by-length')}>Passgrafiek bekijken</button>
    </div>
  </section>;
}
