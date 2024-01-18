const mongoose = require("mongoose");
const {array} = require("joi");


const projectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    creator_id: {
        type: String,
        required: true
    },
    member_id: {
      type: [String],
      required: true
    },
    icon: {
        type: String,
    },
    status: {
        type: String,
        default: 'Active'
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