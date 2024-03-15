import React, { useContext, useMemo, useState } from 'react';
import { CsvContext } from './Context'; // Adjust the path if needed
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function DribblesCompletion() {
  const csvData = useContext(CsvContext);
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Memoize processing for performance
  const { chartData, players, teams } = useMemo(() => {
    if (!Array.isArray(csvData) || csvData.length === 0) {
      return { chartData: [], players: [], teams: [] };
    }

    // Filter rows where Event is "Dribbles" (case-insensitive)
    const dribbles = csvData.filter(row => row.Event?.toLowerCase() === 'dribbles');

    // Aggregate dribble outcomes by player and team
    const playerDribbleMap = {};
    const teamSet = new Set();
    const playerSet = new Set();

    dribbles.forEach(dribble => {
      const player = dribble['Player Name']?.trim() || "Unknown";
      const team = dribble['Team Name']?.trim() || "Unknown";
      const result = dribble['Result']?.trim();

      playerSet.add(player);
      teamSet.add(team);

      if (!playerDribbleMap[player]) {
        playerDribbleMap[player] = { team, successful: 0, unsuccessful: 0 };
      }

      if (result === 'Successful') {
        playerDribbleMap[player].successful += 1;
      } else if (result === 'Unsuccessful') {
        playerDribbleMap[player].unsuccessful += 1;
      }
    });

    const formattedData = Object.entries(playerDribbleMap).map(([player, outcomes]) => ({
      name: player,
      team: outcomes.team,
      successful: outcomes.successful,
      unsuccessful: outcomes.unsuccessful,
    }));

    return {
      chartData: formattedData,
      players: ['All', ...Array.from(playerSet)],
      teams: ['All', ...Array.from(teamSet)],
    };
  }, [csvData]);

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const filteredData =
    selectedFilter === 'All'
      ? chartData
      : chartData.filter(
          (data) =>
            data.name === selectedFilter || data.team === selectedFilter
        );

  if (!Array.isArray(csvData) || csvData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Completed Dribbles</h2>
      <div>
        <label htmlFor="filter-select">Filter by Player or Team: </label>
        <select id="filter-select" value={selectedFilter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <optgroup label="Players">
            {players.slice(1).map(player => (
              <option key={player} value={player}>
                {player}
              </option>
            ))}
          </optgroup>
          <optgroup label="Teams">
            {teams.slice(1).map(team => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
      <BarChart
        layout="vertical"
        width={800}
        height={400}
        data={filteredData}
        margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" />
        <Tooltip />
        <Legend />
        <Bar dataKey="successful" fill="#0088FE" name="Successful Dribbles" />
        <Bar dataKey="unsuccessful" fill="#FF00FF" name="Unsuccessful Dribbles" />
      </BarChart>
    </div>
  );
}