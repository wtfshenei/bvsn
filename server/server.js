require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Map = require("./models/map");
const Player = require("./models/player");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));

// Test Endpoint
app.get("/", (req, res) => {
    res.send("API is running...");
});

app.get("/api/map", async (req, res) => {
    try {
        let map = await Map.findOne();

        if (!map) {
            console.log("No map found. Generating new map...");
            const size = 50;
            const tiles = [];

            for (let x = 0; x < size; x++) {
                for (let y = 0; y < size; y++) {
                    tiles.push({
                        type: ["water", "forest", "sand", "land"][Math.floor(Math.random() * 4)],
                        faction: null,
                        position: { x, y }
                    });
                }
            }

            map = new Map({ size, tiles });
            await map.save();
            console.log("Map saved successfully.");
        }

        res.json(map);
    } catch (err) {
        console.error("Error fetching or creating map:", err);
        res.status(500).json({ error: "Failed to fetch or create map" });
    }
});

app.get("/api/player", async (req, res) => {
    try {
        let player = await Player.findOne(); // Give a name to the player

        // If no player found, create a new player
        if (!player) {
            player = new Player({
                name: "Player1",
                position: { x: 4, y: 4 }, // Initial player position
            });
            await player.save();
        }

        res.json(player);
    } catch (err) {
        console.error("Error fetching player:", err);
        res.status(500).json({ error: "Failed to fetch player" });
    }
});

// Endpoint pour mettre à jour la position du joueur
app.put("/api/player", async (req, res) => {
    const { x, y } = req.body;
    try {
        const player = await Player.findOneAndUpdate(
            { name: "Shenei" },
            { position: { x, y } },
            { new: true } // Assure que la réponse inclut les nouvelles coordonnées
        );
        res.json(player);
    } catch (err) {
        console.error("Error updating player position:", err);
        res.status(500).json({ error: "Failed to update player position" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});