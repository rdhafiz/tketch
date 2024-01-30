const mongoose = require("mongoose");


const assigneeSchema = new mongoose.Schema({
    user_id: { type: ObjectId },
});
const labelSchema = new mongoose.Schema({
    label_id: { type: ObjectId },
});
const attachmentSchema = new mongoose.Schema({
    url: { type: String },
    type: { type: String },
});

const commentSchema = new mongoose.Schema({
    comments: { type: String },
    user_id: { type: ObjectId },
});
const projectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    label: {
        type: labelSchema,
    },
    priority: {
        type: String,
    },
    status: {
        type: String,
        default: 'status'
    },
    assignee: {
        type: assigneeSchema,
    },
    attachment: {
        type: attachmentSchema,
    },
    comments: {
        type: commentSchema,
    },
    creator_id: {
        type: ObjectId,
        required: true
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