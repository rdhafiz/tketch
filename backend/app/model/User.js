const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        default: null,
    },
    avatar: {
        type: String,
        default: null,
    },
    activation_code: {
        type: String,
        default: null,
    },
    reset_code: {
        type: String,
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

module.exports = mongoose.model("User", userSchema);