const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    }
});

module.exports = mongoose.model('Player', playerSchema);