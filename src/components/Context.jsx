import React, { createContext, useState, useEffect } from 'react';
import Papa from 'papaparse';


// Create the context
export const CsvContext = createContext([]);

// Provider component
export default function CsvProvider({ children }) {
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const loadCsv = async () => {
      try { 
        const response = await fetch(process.env.PUBLIC_URL + '/data.csv');
        const text = await response.text();
        const parsed = Papa.parse(text, { header: true }).data;
        setCsvData(parsed);
      } catch (err) {
        console.error('Failed to load CSV:', err);
      }
    };
    loadCsv();
  }, []);

  return (
    <CsvContext.Provider value={csvData}>
      {children}
    </CsvContext.Provider>
  );
}