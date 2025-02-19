require("dotenv").config();
const axios = require("axios");
const FACEIT_API_KEY = process.env.FACEIT_API_KEY;
const BASE_URL = `https://open.faceit.com/data/v4/rankings/games/cs2/regions/EU`;

const fetchTopPlayers = async (maxPlayers = 50) => {
  try {
    const limit = 50; // Fixed limit (Faceit API allows max 50)
    const estimatedMaxPlayers = 5000; // Adjust this based on real data

    // Ensure the maxOffset is a multiple of `limit`
    const maxOffset = Math.floor(estimatedMaxPlayers / limit) * limit;

    // Generate a random offset (must be a multiple of `limit`)
    const randomOffset =
      Math.floor(Math.random() * (maxOffset / limit)) * limit;

    let url = `${BASE_URL}?offset=${randomOffset}&limit=${maxPlayers}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${FACEIT_API_KEY}` },
    });

    if (!response.statusCode === 200) {
      throw new Error(`API request failed with status ${response.statusCode}`);
    }
    return response.data.items?.map((player) => player.nickname) || [];
  } catch (error) {
    console.error(
      "Error fetching players:",
      error.response?.data || error.message
    );
    return [];
  }
};

module.exports = { fetchTopPlayers };
