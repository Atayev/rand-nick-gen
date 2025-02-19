const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config();
const { fetchTopPlayers } = require("./scripts/helper");
const { generateAINickname } = require("./scripts/ai");
const app = express();
const PORT = 3000;

/**
 * Fetches a large number of player nicknames from Faceit using pagination.
 */
app.use(express.static(path.join(__dirname, "public")));
// Serve index.html at the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Define an API endpoint to fetch Faceit player nicknames
app.get("/players", async (req, res) => {
  try {
    const players = await fetchTopPlayers(50);
    res.json({ count: players.length, players });
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({ error: "Failed to fetch player nicknames" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post("/generate", async (req, res) => {
  const players = await fetchTopPlayers();
  const randomIndex = Math.floor(Math.random() * players.length);

  const newNickname = await generateAINickname(players);
  console.log(newNickname, "newNickname");
  res.json({ player: newNickname });
});
