const mongoose = require("mongoose");

const stateSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    project_id: {
        type: String,
        required: true,
    },
    creator_id: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: null,
    },
});

module.exports = mongoose.model("State", stateSchema);