import React, { useContext, useMemo, useState } from "react";
import { CsvContext } from "./Context"; // Adjust the path if needed
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function SavesByType() {
  const csvData = useContext(CsvContext);
  const [selectedGK, setSelectedGK] = useState("All");

  // Memoize data processing for performance
  const { chartData, gkNames } = useMemo(() => {
    if (!Array.isArray(csvData) || csvData.length === 0) {
      return { chartData: [], gkNames: ["All"] };
    }

    // Filter rows where Event is "Gk Saves"
    const saves = csvData.filter((row) => row.Event === "Gk Saves");

    // Extract unique GK names
    const uniqueGKNames = ["All", ...new Set(saves.map((save) => save["Player Name"]?.trim() || "Unknown"))];

    // Group saves by type and GK
    const saveCounts = {};
    saves.forEach((save) => {
      const gk = save["Player Name"]?.trim() || "Unknown";
      const type = save.Type?.trim() || "Unknown";

      if (!saveCounts[gk]) {
        saveCounts[gk] = {};
      }

      if (!saveCounts[gk][type]) {
        saveCounts[gk][type] = { type, count: 0, gk };
      }

      saveCounts[gk][type].count += 1;
    });

    // Format data for the chart
    const formattedData = Object.values(saveCounts).flatMap((gkData) => Object.values(gkData));

    return { chartData: formattedData, gkNames: uniqueGKNames };
  }, [csvData]);

  const handleGKChange = (event) => {
    setSelectedGK(event.target.value);
  };

  const filteredData =
    selectedGK === "All"
      ? chartData
      : chartData.filter((data) => data.gk === selectedGK);

  return (
    <div>
      <h2>Saves by Type</h2>
      <div>
        <label htmlFor="gk-select">Filter by Goalkeeper: </label>
        <select id="gk-select" value={selectedGK} onChange={handleGKChange}>
          {gkNames.map((gk, index) => (
            <option key={index} value={gk}>
              {gk}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="60%" height={400}>
        <BarChart
          data={filteredData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" name="Save Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}