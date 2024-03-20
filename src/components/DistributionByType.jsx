import React, { useContext, useMemo, useState } from "react";
import { CsvContext } from "./Context"; // Adjust the path if needed
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DistributionByType() {
  const csvData = useContext(CsvContext);
  const [selectedTeam, setSelectedTeam] = useState("All");

  // Memoize processing for performance
  const { chartData, teamNames } = useMemo(() => {
    if (!Array.isArray(csvData) || csvData.length === 0) {
      return { chartData: [], teamNames: ["All"] };
    }

    // Extract unique team names
    const uniqueTeamNames = ["All", ...new Set(csvData.map((row) => row.Team?.trim() || "Unknown"))];

    // Filter rows where Event is "Gk Distribution"
    const gkDistributions = csvData.filter((row) => row.Event === "Gk Distribution");

    // Group distributions by type and player
    const distributionCounts = {};
    gkDistributions.forEach((distribution) => {
      const type = distribution.Distribution?.trim() || "Unknown";
      const player = distribution["Player Name"]?.trim() || "Unknown";
      const team = distribution.Team?.trim() || "Unknown";

      if (!distributionCounts[player]) {
        distributionCounts[player] = { player, team, Throw: 0, Kick: 0 };
      }

      // Increment counts based on distribution type
      if (type === "Throw") {
        distributionCounts[player].Throw += 1;
      } else if (type === "Kick") {
        distributionCounts[player].Kick += 1;
      }
    });

    // Format data for the chart
    const formattedData = Object.values(distributionCounts);

    return { chartData: formattedData, teamNames: uniqueTeamNames };
  }, [csvData]);

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const filteredData =
    selectedTeam === "All"
      ? chartData
      : chartData.filter((data) => data.team === selectedTeam);

  if (!Array.isArray(csvData) || csvData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Distribution by Type</h2>
      <div>
        <label htmlFor="team-select">Filter by Team: </label>
        <select id="team-select" value={selectedTeam} onChange={handleTeamChange}>
          {teamNames.map((team, index) => (
            <option key={index} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="65%" height={400}>
        <BarChart
          layout="vertical"
          data={filteredData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="player" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Kick" fill="#FF8042" name="gk_distribution_kick" />
          <Bar dataKey="Throw" fill="#0088FE" name="gk_distribution_throw" />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <p>Goal Kick Completion (%)</p>
      </div>
    </div>
  );
}