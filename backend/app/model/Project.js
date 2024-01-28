const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    creator_id: {
        type: String,
        required: true
    },
    members_id: {
      type: [String],
      required: true
    },
    icon: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: 'active'
    },
    deleted_at: {
        type: Date,
        default: null,
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

module.exports = mongoose.model("Project", projectSchema);