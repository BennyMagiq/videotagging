import React, { useContext, useMemo, useState } from 'react';
import { CsvActionsContext, CsvContext } from './Context';
import './DataPage.css';

export default function DataPage() {
  const csv = useContext(CsvContext);
  const { datasetName, source, loading, error, loadFile, restoreOriginal } = useContext(CsvActionsContext);
  const [file, setFile] = useState(null);
  const [notice, setNotice] = useState('');
  const [localError, setLocalError] = useState('');

  const summary = useMemo(() => {
    const events = [...new Set(csv.map(r => r.Event).filter(Boolean))];
    const players = [...new Set(csv.map(r => r['Player Name']).filter(n => n && n !== '-'))];
    const teams = [...new Set(csv.map(r => r['Team Name']).filter(n => n && n !== '-'))];
    return { events, players, teams };
  }, [csv]);

  async function handleUpload(e) {
    e.preventDefault();
    setLocalError(''); setNotice('');
    try {
      const count = await loadFile(file);
      setNotice(file.name + ' geladen (' + count + ' records). De grafieken zijn bijgewerkt.');
      setFile(null);
      e.target.reset();
    } catch (err) { setLocalError(err.message || 'Importeren is mislukt.'); }
  }

  async function handleRestore() {
    setLocalError(''); setNotice('');
    try {
      const count = await restoreOriginal();
      setNotice('Originele data.csv hersteld (' + count + ' records).');
    } catch (err) { setLocalError(err.message); }
  }

  return (
    <section className="data-page">
      <div className="page-intro"><h1>Data beheren</h1><p>Upload een CSV- of JSON-bestand om de grafieken direct met nieuwe voetbaldata te bekijken.</p></div>
      <div className="data-panels">
        <div className="data-panel">
          <h2>1. Bestand kiezen</h2>
          <form onSubmit={handleUpload}>
            <label htmlFor="new-csv">Kies een bestand met dezelfde kolommen als de originele data.csv</label>
            <input id="new-csv" type="file" accept=".csv,.json,text/csv,application/json" onChange={e => {setFile(e.target.files[0] || null);setLocalError('');setNotice('');}} />
            <p className="data-help">CSV of JSON · maximaal 12 MB. Een upload vervangt tijdelijk de huidige gegevens in deze browsersessie.</p>
            <button type="submit" className="data-primary" disabled={!file || loading}>{loading ? 'Bezig...' : 'Upload en gebruik dataset'}</button>
          </form>
          {(localError || error) && <p role="alert" className="data-alert">{localError || error}</p>}
          {notice && <p role="status" className="data-success">{notice}</p>}
        </div>
        <div className="data-panel">
          <h2>2. Actieve dataset</h2>
          <dl className="data-facts">
            <div><dt>Bestand</dt><dd>{datasetName}</dd></div>
            <div><dt>Bron</dt><dd>{source}</dd></div>
            <div><dt>Records</dt><dd>{csv.length.toLocaleString('nl-NL')}</dd></div>
            <div><dt>Spelers</dt><dd>{summary.players.length}</dd></div>
            <div><dt>Teams</dt><dd>{summary.teams.length}</dd></div>
          </dl>
          <button className="data-secondary" onClick={handleRestore} disabled={loading}>Originele data.csv herstellen</button>
        </div>
      </div>
      <div className="data-panel data-preview">
        <h2>Voorbeeld van geladen gegevens</h2>
        {csv.length > 0 ? (
          <div className="preview-scroll"><table>
            <thead><tr>{['Event','Timestamp','Player Name','Team Name','Result'].map(k => <th key={k}>{k}</th>)}</tr></thead>
            <tbody>{csv.slice(0, 8).map((row, index) => <tr key={index}>{['Event','Timestamp','Player Name','Team Name','Result'].map(k => <td key={k}>{row[k] || '–'}</td>)}</tr>)}</tbody>
          </table></div>
        ) : <p>{loading ? 'Dataset wordt geladen...' : 'Geen gegevens geladen.'}</p>}
        <p className="data-help">Uploaden bewaart het bestand niet op GitHub of een server. Bij opnieuw openen van de website wordt de originele dataset geladen.</p>
      </div>
    </section>
  );
}
