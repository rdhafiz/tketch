const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        reuired: [true, 'First Name field is required'],
    },
    last_name: {
        type: String,
        reuired: [true, 'Last Name field is required'],
    },
    email: {
        type: String,
        reuired: [true, 'Email field is required'],
    },
    password: {
        type: String,
        reuired: [true, 'Password field is required'],
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