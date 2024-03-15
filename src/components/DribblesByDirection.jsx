import React, { useContext, useMemo, useState } from "react";
import { CsvContext } from "./Context"; // Adjust the path if needed
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DribblesByDirection() {
  const csvData = useContext(CsvContext);
  const [selectedPlayer, setSelectedPlayer] = useState("All");

  // Memoize processing for performance
  const { chartData, players } = useMemo(() => {
    if (!Array.isArray(csvData) || csvData.length === 0) {
      return { chartData: [], players: [] };
    }

    // Filter rows where Event is "Dribbles"
    const dribbles = csvData.filter(
      (row) => row.Event?.toLowerCase() === "dribbles"
    );

    // Aggregate dribbles by direction and player
    const directionMap = {};
    dribbles.forEach((dribble) => {
      const player = dribble["Player Name"]?.trim() || "Unknown";
      const direction = dribble["direction"]?.trim() || "Unknown";

      if (!directionMap[player]) {
        directionMap[player] = { player, forward: 0, backward: 0, lateral: 0, unknown: 0 };
      }

      if (direction === "forward") {
        directionMap[player].forward += 1;
      } else if (direction === "backward") {
        directionMap[player].backward += 1;
      } else if (direction === "lateral") {
        directionMap[player].lateral += 1;
      } else {
        directionMap[player].unknown += 1;
      }
    });

    // Format data for the chart
    return {
      chartData: Object.values(directionMap),
      players: ["All", ...Object.keys(directionMap)],
    };
  }, [csvData]);

  const handlePlayerChange = (event) => {
    setSelectedPlayer(event.target.value);
  };

  const filteredData =
    selectedPlayer === "All"
      ? chartData
      : chartData.filter((data) => data.player === selectedPlayer);

  if (!Array.isArray(csvData) || csvData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Dribbles by Direction</h2>
      <div>
        <label htmlFor="filter-select">Filter by Player: </label>
        <select
          id="filter-select"
          value={selectedPlayer}
          onChange={handlePlayerChange}
        >
          <option value="All">All</option>
          {players.map((player) => (
            <option key={player} value={player}>
              {player}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="45%" height={400}>
        <BarChart
          data={filteredData}
          margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
        >
          <XAxis type="category" dataKey="player" />
          <YAxis type="number" />
          <Tooltip />
          <Legend />
          <Bar dataKey="forward" fill="#0088FE" name="Forward Dribbles" />
          <Bar dataKey="backward" fill="#FF8042" name="Backward Dribbles" />
          <Bar dataKey="lateral" fill="#00C49F" name="Lateral Dribbles" />
          <Bar dataKey="unknown" fill="#AAAAAA" name="Unknown Direction" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}