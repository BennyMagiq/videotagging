import React, { useContext, useMemo } from "react";
import { CsvContext } from "./Context"; // Adjust path if needed
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

export default function GkCompletion() {
  const csvData = useContext(CsvContext);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!Array.isArray(csvData) || csvData.length === 0) return [];

    // Filter for GK Distribution events with Kick
    const kicks = csvData.filter(
      row =>
        row.Event === "Gk Distribution" &&
        row.Distribution?.toLowerCase() === "kick"
    );

    // Group by player and count successful/total kicks
    const gkMap = {};
    kicks.forEach(row => {
      const player = row["Player Name"]?.trim() || "Unknown";
      const isSuccess = row.Result === "Successful";
      if (!gkMap[player]) gkMap[player] = { player, total: 0, successful: 0 };
      gkMap[player].total += 1;
      if (isSuccess) gkMap[player].successful += 1;
    });

    // Format for chart
    return Object.values(gkMap).map(gk => ({
      player: gk.player,
      gk_distribution_kick_accuracy: gk.total
        ? Math.round((gk.successful / gk.total) * 100)
        : 0,
    }));
  }, [csvData]);

  if (chartData.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Goal Kick Completion (%)</h2>
      <ResponsiveContainer width="60%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <XAxis dataKey="player" label={{ value: "Player Name", position: "insideBottom", offset: -5 }} />
          <YAxis domain={[0, 100]} label={{ value: "gk_distribution_kick_accuracy (%)", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="gk_distribution_kick_accuracy" fill="#FF9900">
            <LabelList dataKey="gk_distribution_kick_accuracy" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}