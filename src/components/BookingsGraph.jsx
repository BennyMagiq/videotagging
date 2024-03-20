import React, { useContext, useMemo } from "react";
import { CsvContext } from "./Context"; // Adjust the path if needed
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function BookingsGraph() {
  const csvData = useContext(CsvContext);

  // Memoize chart data calculation for performance
  const chartData = useMemo(() => {
    if (!Array.isArray(csvData) || csvData.length === 0) return [];

    // Filter rows where Booking column has values
    const bookings = csvData.filter((row) => row.Booking?.trim());

    // Group bookings by player
    const bookingCounts = {};
    bookings.forEach((booking) => {
      const player = booking["Player Name"]?.trim() || "Unknown";
      const bookingType = booking.Booking?.trim();

      if (!bookingCounts[player]) {
        bookingCounts[player] = { player, yellow: 0, red: 0 };
      }

      if (bookingType === "Yellow Card") {
        bookingCounts[player].yellow += 1;
      } else if (bookingType === "Red Card") {
        bookingCounts[player].red += 1;
      }
    });

    // Format data for the chart
    return Object.values(bookingCounts);
  }, [csvData]);

  if (!Array.isArray(csvData) || csvData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Player Bookings</h2>
      <ResponsiveContainer width="45%" height={400}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="player" />
          <Tooltip />
          <Legend />
          <Bar dataKey="yellow" fill="#FFD700" name="Yellow Cards" />
          <Bar dataKey="red" fill="#FF4500" name="Red Cards" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}