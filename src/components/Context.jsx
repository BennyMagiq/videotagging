import React, { createContext, useEffect, useState } from 'react';
import Papa from 'papaparse';

export const CsvContext = createContext([]);
export const CsvActionsContext = createContext(null);

const REQUIRED = ['Event','Timestamp','Result','Player Name','Team Name'];
function parseDataset(text, filename) {
  let rows;
  if (filename.toLowerCase().endsWith('.json')) {
    const data = JSON.parse(text);
    rows = Array.isArray(data) ? data : data.data;
  } else {
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: 'greedy' });
    if (parsed.errors.some(e => e.type === 'Quotes')) {
      throw new Error('CSV bevat ongeldige aanhalingstekens.');
    }
    rows = parsed.data;
  }
  if (!Array.isArray(rows) || !rows.length) throw new Error('Bestand bevat geen gegevens.');
  const fields = Object.keys(rows[0]);
  const missing = REQUIRED.filter(f => !fields.includes(f));
  if (missing.length) throw new Error('Ontbrekende kolommen: ' + missing.join(', '));
  const cleaned = rows.filter(r => r && String(r.Event || '').trim());
  if (!cleaned.length) throw new Error('Geen bruikbare acties gevonden.');
  return cleaned;
}
export default function CsvProvider({ children }) {
  const [csvData, setCsvData] = useState([]);
  const [datasetName, setDatasetName] = useState('data.csv');
  const [source, setSource] = useState('Originele dataset');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const restoreOriginal = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(process.env.PUBLIC_URL + '/data.csv', { cache: 'no-store' });
      if (!response.ok) throw new Error('Originele dataset niet beschikbaar.');
      const rows = parseDataset(await response.text(), 'data.csv');
      setCsvData(rows);
      setDatasetName('data.csv');
      setSource('Originele dataset');
      return rows.length;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { restoreOriginal().catch(() => {}); }, []);

  const loadFile = async (file) => {
    if (!file) throw new Error('Kies eerst een bestand.');
    if (!/\.(csv|json)$/i.test(file.name)) throw new Error('Alleen CSV of JSON toegestaan.');
    if (file.size > 12 * 1024 * 1024) throw new Error('Maximaal 12 MB.');
    setLoading(true);
    setError('');
    try {
      const rows = parseDataset(await file.text(), file.name);
      setCsvData(rows);
      setDatasetName(file.name);
      setSource('Geïmporteerd in deze browsersessie');
      return rows.length;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return (
    <CsvContext.Provider value={csvData}>
      <CsvActionsContext.Provider value={{ datasetName, source, loading, error, loadFile, restoreOriginal }}>
        {children}
      </CsvActionsContext.Provider>
    </CsvContext.Provider>
  );
}
