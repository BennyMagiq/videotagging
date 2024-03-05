import React, { useContext, useMemo, useState } from 'react';
import { CsvContext } from './Context'; // Adjust the path if needed
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const normalizeTeamName = (team) => {
  if (!team) return 'Unknown Team';
  if (team.toLowerCase().includes('den bosch')) return 'Den Bosch O17';
  if (team.toLowerCase().includes('helmond sport')) return 'Helmond Sport O17';
  return team;
};

const PassAccu = () => {
  const csvData = useContext(CsvContext);
  const [selectedTeam, setSelectedTeam] = useState('All');

  const { chartData, teams } = useMemo(() => {
    if (!Array.isArray(csvData) || csvData.length === 0) {
      return { chartData: [], teams: [] };
    }

    const passes = csvData.filter(row => row.Event === 'Pass');
    const accuracyMap = {};
    const teamSet = new Set();

    passes.forEach(pass => {
      const player = pass['Player Name'];
      const team = normalizeTeamName(pass['Team Name']);
      const isSuccessful = pass['Result'] === 'Successful';

      teamSet.add(team);

      if (!accuracyMap[player]) {
        accuracyMap[player] = { total: 0, successful: 0, team };
      }

      accuracyMap[player].total += 1;
      if (isSuccessful) accuracyMap[player].successful += 1;
    });

    // Ensure "Den Bosch O17" and "Helmond Sport O17" are included in the dropdown
    teamSet.add('Den Bosch O17');
    teamSet.add('Helmond Sport O17');

    const formattedData = Object.entries(accuracyMap).map(([name, stats]) => ({
      name,
      team: stats.team,
      pass_accuracy: Math.round((stats.successful / stats.total) * 100),
    })).sort((a, b) => b.pass_accuracy - a.pass_accuracy);

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
      <h2>Pass Accuracy (%)</h2>
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
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="pass_accuracy" fill="orange" />
      </BarChart>
    </div>
  );
};

export default PassAccu;
