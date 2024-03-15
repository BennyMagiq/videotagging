import React, { useContext, useMemo, useState } from "react";
import { CsvContext } from "./Context"; // Adjust the path if needed
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DribblesCompletion = () => {
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

    // Aggregate dribble outcomes by player
    const playerDribbleMap = {};
    dribbles.forEach((dribble) => {
      const player = dribble["Player Name"]?.trim();
      const result = dribble["Result"]?.trim();

      if (!playerDribbleMap[player]) {
        playerDribbleMap[player] = { successful: 0, unsuccessful: 0 };
      }

      if (result === "Successful") {
        playerDribbleMap[player].successful += 1;
      } else if (result === "Unsuccessful") {
        playerDribbleMap[player].unsuccessful += 1;
      }
    });

    // Calculate percentages and format data for the chart
    const formattedData = Object.entries(playerDribbleMap).map(
      ([player, outcomes]) => {
        const total = outcomes.successful + outcomes.unsuccessful;
        const successPercentage = total
          ? ((outcomes.successful / total) * 100).toFixed(2)
          : 0;
        return {
          name: player,
          successPercentage: parseFloat(successPercentage),
        };
      }
    );

    return {
      chartData: formattedData,
      players: ["All", ...Object.keys(playerDribbleMap)],
    };
  }, [csvData]);

  const handlePlayerChange = (event) => {
    setSelectedPlayer(event.target.value);
  };

  const filteredData =
    selectedPlayer === "All"
      ? chartData
      : chartData.filter((data) => data.name === selectedPlayer);

  return (
    <div>
      <h2>Dribble Completion(%)</h2>
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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="category" dataKey="name" />
          <YAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(tick) => `${tick}%`}
          />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Bar
            dataKey="successPercentage"
            fill="#0088FE"
            name="Dribble Success (%)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DribblesCompletion;