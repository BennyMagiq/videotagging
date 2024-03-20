import React, { useContext, useMemo } from "react";
import { CsvContext } from "./Context"; // Adjust the path if needed
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";

export default function Corners() {
  const csvData = useContext(CsvContext);

  // Memoize chart data calculation for performance
  const chartData = useMemo(() => {
    if (!Array.isArray(csvData) || csvData.length === 0) return [];

    // Filter for Corners events
    const corners = csvData.filter(row => row.Event === "Corners");

    // Group by player and count Chance Created vs Not
    const counts = {};
    corners.forEach(row => {
      const player = row["Player Name"]?.trim() || "Unknown";
      const result = row.Result?.trim() === "Chance Created" ? "ChanceCreated" : "NoChance";
      if (!counts[player]) counts[player] = { player, ChanceCreated: 0, NoChance: 0 };
      counts[player][result]++;
    });

    // Ensure all players have both keys for stacked bars
    return Object.values(counts);
  }, [csvData]);

  if (!Array.isArray(csvData) || csvData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Corners - Chance Created or Not</h2>
      <ResponsiveContainer width="65%" height={300}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="player" />
          <Tooltip />
          <Legend />
          <Bar dataKey="NoChance" stackId="a" fill="#FF8042" name="No Chance">
            <LabelList dataKey="NoChance" position="insideLeft" fill="#000" />
          </Bar>
          <Bar dataKey="ChanceCreated" stackId="a" fill="#0088FE" name="Chance Created">
            <LabelList dataKey="ChanceCreated" position="insideLeft" fill="#000" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}