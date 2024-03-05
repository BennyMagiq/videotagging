import React, { useContext, useMemo, useState } from 'react';
import { CsvContext } from './Context'; // Adjust the path as needed
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function PassByLength() {
  const csvData = useContext(CsvContext);
  const [selectedPlayer, setSelectedPlayer] = useState('All');

  // Memoize data processing
  const { chartData, players } = useMemo(() => {
    if (!Array.isArray(csvData) || csvData.length === 0) {
      return { chartData: [], players: [] };
    }

    const passes = csvData.filter(row => row.Event === 'Pass');
    const playerSet = new Set();
    const playerLengthMap = {};

    passes.forEach(pass => {
      const player = pass['Player Name'];
      const length = parseFloat(pass['length_euclidean']);
      playerSet.add(player);

      if (!playerLengthMap[player]) {
        playerLengthMap[player] = { Short: 0, Medium: 0, Long: 0 };
      }

      if (length < 10) {
        playerLengthMap[player].Short += 1;
      } else if (length >= 10 && length < 25) {
        playerLengthMap[player].Medium += 1;
      } else {
        playerLengthMap[player].Long += 1;
      }
    });

    const formattedData = Object.entries(playerLengthMap).map(([player, lengths]) => ({
      name: player,
      Short: lengths.Short,
      Medium: lengths.Medium,
      Long: lengths.Long,
    }));

    return {
      chartData: formattedData,
      players: ['All', ...Array.from(playerSet)],
    };
  }, [csvData]);

  const handlePlayerChange = (event) => {
    setSelectedPlayer(event.target.value);
  };

  const filteredData =
    selectedPlayer === 'All'
      ? chartData
      : chartData.filter(player => player.name === selectedPlayer);

  if (!Array.isArray(csvData) || csvData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Pass Length per Player</h2>
      <div>
        <label htmlFor="player-select">Filter by Player: </label>
        <select id="player-select" value={selectedPlayer} onChange={handlePlayerChange}>
          {players.map(player => (
            <option key={player} value={player}>
              {player}
            </option>
          ))}
        </select>
      </div>
      <BarChart width={800} height={400} data={filteredData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Short" fill="green" name="Short Passes" />
        <Bar dataKey="Medium" fill="blue" name="Medium Passes" />
        <Bar dataKey="Long" fill="orange" name="Long Passes" />
      </BarChart>
    </div>
  );
}
