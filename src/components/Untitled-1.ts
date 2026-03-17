// Extract players with "Gk Distribution" and their distribution types
useEffect(() => {
  const loadData = async () => {
    const response = await fetch("/data.csv"); // Replace with the correct path to your CSV file
    const text = await response.text();

    // Parse CSV data
    const parsedData = Papa.parse(text, { header: true }).data;

    // Filter rows where Event is "Gk Distribution"
    const gkDistributions = parsedData
      .filter((row) => row.Event === "Gk Distribution")
      .map((row) => ({
        player: row["Player Name"]?.trim() || "Unknown",
        type: row.Distribution?.trim() || "Unknown",
      }));

    console.log("Players with Gk Distribution and Types:", gkDistributions);
  };

  loadData();
}, []);