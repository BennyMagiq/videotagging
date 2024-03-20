import React, { useContext, useMemo, useState } from "react";
import { CsvContext } from "./Context"; // Adjust the path if needed
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function OffsideGraph() {
  const csvData = useContext(CsvContext);
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Memoize data processing for performance
  const { chartData, allPlayers, allTeams } = useMemo(() => {
    if (!Array.isArray(csvData) || csvData.length === 0) {
      return { chartData: [], allPlayers: [], allTeams: [] };
    }

    // Extract all unique player names
    const players = [...new Set(csvData.map((row) => row["Player Name"]?.trim() || "Unknown"))];

    // Extract all unique team names
    const teams = [...new Set(csvData.map((row) => row["Team Name"]?.trim() || "Unknown"))];

    // Filter rows where Event is "Off-side"
    const offsides = csvData.filter((row) => row.Event === "Off-side");

    // Group offsides by player
    const offsideCounts = {};
    players.forEach((player) => {
      offsideCounts[player] = { player, team: "", count: 0 }; // Initialize all players with 0 count
    });

    offsides.forEach((offside) => {
      const player = offside["Player Name"]?.trim() || "Unknown";
      const team = offside["Team Name"]?.trim() || "Unknown";
      offsideCounts[player].count += 1;
      offsideCounts[player].team = team;
    });

    // Format data for the chart
    const formattedData = Object.values(offsideCounts);

    return { chartData: formattedData, allPlayers: players, allTeams: teams };
  }, [csvData]);

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const filteredData =
    selectedFilter === "All"
      ? chartData
      : allTeams.includes(selectedFilter)
      ? chartData.filter((data) => data.team === selectedFilter)
      : chartData.filter((data) => data.player === selectedFilter);

  return (
    <div>
      <h2>Offsides by Player</h2>
      <div>
        <label htmlFor="filter-select">Filter by: </label>
        <select id="filter-select" value={selectedFilter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <optgroup label="Teams">
            {allTeams.map((team, index) => (
              <option key={`team-${index}`} value={team}>
                {team}
              </option>
            ))}
          </optgroup>
          <optgroup label="Players">
            {allPlayers.map((player, index) => (
              <option key={`player-${index}`} value={player}>
                {player}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
      <ResponsiveContainer width="60%" height={550}>
        <BarChart
          layout="vertical"
          data={filteredData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="player" />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#FF8042" name="Offside Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
