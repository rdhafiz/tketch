const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    number: {
        type: Number,
        default: null,
    },
    project_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Project',
        required: true
    },
    label_id: [mongoose.SchemaTypes.ObjectId],
    state_id: {
        type: mongoose.SchemaTypes.ObjectId,
        default: null
    },
    priority: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: 'active'
    },
    assignee: {
        type: [String],
        default: []
    },
    attachment: [
        {
            user_id: {type: String, required: true},
            file_name: {type: String, required: true},
            file_path: {type: String, required: true},
            created_at: {type: Date, default: Date.now()}}
    ],
    comments: [
        {
            user_id: {type: String, required: true},
            comment: {type: String, required: true},
            created_at: {type: Date , default: Date.now()},
            updated_at: {type: Date , default: null},
        },
    ],
    creator_id: {
        type: String,
        required: true
    },
    due_at: {
        type: Date,
        default: null,
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

module.exports = mongoose.model("Task", taskSchema);