import React, { useContext, useMemo, useState } from 'react';
import { CsvContext } from './Context'; // Adjust the path if needed
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

/* eslint-disable no-unused-expressions */

const ShortOutcome = () => {
  const csvData = useContext(CsvContext);
  const [selectedTeam, setSelectedTeam] = useState('All');

  const { chartData, teams } = useMemo(() => {
    if (!Array.isArray(csvData) || csvData.length === 0) {
      return { chartData: [], teams: [] };
    }

    // Filter rows where Event is "Shots"
    const shots = csvData.filter(row => row.Event === 'Shots');

    const accuracyMap = {};
    const teamSet = new Set();

    shots.forEach(shot => {
      const player = shot['Player Name'];
      const team = shot['Team Name'];
      const outcome = shot['Shot outcome'];

      teamSet.add(team);

      if (!accuracyMap[player]) {
        accuracyMap[player] = { total: 0, successful: 0, goals: 0, team };
      }

      accuracyMap[player].total += 1;
      if (outcome === 'On Target') {
        accuracyMap[player].successful += 1;
      }
      if (outcome === 'Goal') {
        accuracyMap[player].goals += 1;
      }
    });

    const formattedData = Object.entries(accuracyMap).map(([name, stats]) => ({
      name,
      team: stats.team,
      shot_accuracy: Math.round((stats.successful / stats.total) * 100),
      goals: stats.goals,
    })).sort((a, b) => b.shot_accuracy - a.shot_accuracy);

    return {
      chartData: formattedData,
      teams: ['All', ...Array.from(teamSet)],
    };
  }, [csvData]);

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const filteredData = selectedTeam === 'All'
    ? chartData
    : chartData.filter(player => player.team === selectedTeam);

  return (
    <div>
      <h2>Shot Outcome</h2>
      <div>
        <label htmlFor="team-select">Filter by Team: </label>
        <select id="team-select" value={selectedTeam} onChange={handleTeamChange}>
          {teams.map(team => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>
      <BarChart width={800} height={400} data={filteredData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100} />
        <YAxis domain={[0,1,2,3]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="shot_accuracy" fill="blue" name="Shot Accuracy (%)" />
        <Bar dataKey="goals" fill="green" name="Goals Made" />
      </BarChart>
    </div>
  );
};

export default ShortOutcome;``