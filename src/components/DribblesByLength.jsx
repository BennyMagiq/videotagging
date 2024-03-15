import React, { useContext, useMemo, useState } from "react";
import { CsvContext } from "./Context"; // Adjust the path if needed
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DribbleGraph() {
  const csvData = useContext(CsvContext);
  const [selectedPlayer, setSelectedPlayer] = useState("All");

  // Memoize data processing for performance
  const { chartData, players } = useMemo(() => {
    if (!Array.isArray(csvData) || csvData.length === 0) {
      return { chartData: [], players: [] };
    }

    // Filter for dribble events with valid length
    const data = csvData.filter(
      (row) =>
        row.Event === "Dribbles" && !isNaN(parseFloat(row.length_euclidean))
    );

    // Group by player and length category
    const grouped = {};
    data.forEach((row) => {
      const player = row["Player Name"] || "Unknown";
      const length = parseFloat(row.length_euclidean);

      if (!grouped[player]) {
        grouped[player] = { player, "< 5m": 0, "5-10m": 0, "> 10m": 0 };
      }

      if (length < 5) {
        grouped[player]["< 5m"] += 1;
      } else if (length <= 10) {
        grouped[player]["5-10m"] += 1;
      } else {
        grouped[player]["> 10m"] += 1;
      }
    });

    const chartData = Object.values(grouped);
    const players = ["All", ...Object.keys(grouped)];
    return { chartData, players };
  }, [csvData]);

  const filteredData =
    selectedPlayer === "All"
      ? chartData
      : chartData.filter((item) => item.player === selectedPlayer);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dribbles by Length</h2>

      {chartData.length > 0 ? (
        <>
          <div className="flex gap-4 mb-4">
            <select value={selectedPlayer} onChange={e => setSelectedPlayer(e.target.value)}>
              {players.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <ResponsiveContainer width="45%" height={400}>
            <BarChart
              layout="horizontal"
              data={filteredData}
              margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
            >
              <XAxis type="category" dataKey="player" />
              <YAxis type="number" />
              <Tooltip />
              <Legend />
              <Bar dataKey="< 5m" fill="#FFA500" name="Dribble < 5m" />
              <Bar dataKey="5-10m" fill="#00BFFF" name="Dribble 5-10m" />
              <Bar dataKey="> 10m" fill="#800080" name="Dribble > 10m" />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <p>No data available to display.</p>
      )}
    </div>
  );
}