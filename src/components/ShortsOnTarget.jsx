import React, { useContext, useMemo, useState } from "react";
import { CsvContext } from "./Context"; // Adjust the path if needed
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ShotsOnTargetGraph() {
  const csvData = useContext(CsvContext);
  const [selectedPlayer, setSelectedPlayer] = useState("All");

  // Memoize data processing for performance
  const { chartData, players } = useMemo(() => {
    if (!Array.isArray(csvData) || csvData.length === 0) {
      return { chartData: [], players: ["All"] };
    }

    // Filter rows where Event is "Shots"
    const shots = csvData.filter((row) => row.Event === "Shots");

    // Group shots by player and outcome
    const shotCounts = {};
    shots.forEach((shot) => {
      const player = shot["Player Name"]?.trim() || "Unknown";
      const outcome = shot["Result"]?.trim();

      if (!shotCounts[player]) {
        shotCounts[player] = { player, onTarget: 0, offTarget: 0, blocked: 0 };
      }

      if (outcome === "On Target") {
        shotCounts[player].onTarget++;
      } else if (outcome === "Off Target") {
        shotCounts[player].offTarget++;
      } else if (outcome === "Blocked") {
        shotCounts[player].blocked++;
      }
    });

    // Format data for the chart
    const formattedData = Object.values(shotCounts);

    // Extract unique players for the dropdown
    const uniquePlayers = ["All", ...new Set(shots.map((shot) => shot["Player Name"]?.trim() || "Unknown"))];

    return { chartData: formattedData, players: uniquePlayers };
  }, [csvData]);

  const handlePlayerChange = (event) => {
    setSelectedPlayer(event.target.value);
  };

  const filteredData =
    selectedPlayer === "All"
      ? chartData
      : chartData.filter((data) => data.player === selectedPlayer);

  return (
    <div>
      <h2>Shots On Target/Off Target</h2>
      <div>
        <label htmlFor="player-select">Filter by Player: </label>
        <select id="player-select" value={selectedPlayer} onChange={handlePlayerChange}>
          {players.map((player, index) => (
            <option key={index} value={player}>
              {player}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="45%" height={400}>
        <BarChart
          layout="vertical"
          data={filteredData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="player" />
          <Tooltip />
          <Legend />
          <Bar dataKey="onTarget" fill="#0088FE" name="Shots On Target" />
          <Bar dataKey="offTarget" fill="#FF8042" name="Shots Off Target" />
          <Bar dataKey="blocked" fill="#AAAAAA" name="Shots Blocked" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}