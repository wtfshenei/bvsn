const mongoose = require("mongoose");

const tileSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ["water", "forest", "sand", "land"]
    },
    faction: {
        type: String,
        enum: ["red", "blue", "green", null]
    },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    }
});

const mapSchema = new mongoose.Schema({
    name: { type: String, default: "Main Map" },
    size: { type: Number, required: true },
    tiles: [tileSchema]
});

module.exports = mongoose.model("Map", mapSchema);