const mongoose = require("mongoose");
const {array} = require("joi");

const memberSchema = new mongoose.Schema({
    user_id: { type: ObjectId, required: true },
});

const projectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    creator_id: {
        type: ObjectId,
        required: true
    },
    member_id: {
      type: memberSchema,
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