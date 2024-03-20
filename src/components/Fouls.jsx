import React, { useContext, useMemo } from "react";
import { CsvContext } from "./Context"; // Adjust the path if needed
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function FoulsGraph() {
  const csvData = useContext(CsvContext);

  // Memoize chart data calculation for performance
  const chartData = useMemo(() => {
    if (!Array.isArray(csvData) || csvData.length === 0) return [];

    // Filter rows where Event is "Foul"
    const fouls = csvData.filter((row) => row.Event?.toLowerCase() === "foul");

    // Group fouls by player
    const foulCounts = {};
    fouls.forEach((foul) => {
      const player = foul["Player Name"]?.trim() || "Unknown";
      if (!foulCounts[player]) {
        foulCounts[player] = 0;
      }
      foulCounts[player] += 1;
    });

    // Format data for the chart
    return Object.entries(foulCounts).map(([player, count]) => ({
      name: player,
      fouls: count,
    }));
  }, [csvData]);

  if (!Array.isArray(csvData) || csvData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Fouls</h2>
      <ResponsiveContainer width="45%" height={400}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Legend />
          <Bar dataKey="fouls" fill="#FFA500" name="Fouls" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}