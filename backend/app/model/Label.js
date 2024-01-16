const mongoose = require("mongoose");

const labelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: null,
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

module.exports = mongoose.model("Label", labelSchema);