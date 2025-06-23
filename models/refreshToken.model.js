const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const refreshTokenSchema = new Schema({
    _id: { type: String, default: uuidv4, required: true },

    user: { type: String, ref: 'user', required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    userAgent: { type: String },
    ip: { type: String },
}, {
    versionKey: false,
});

module.exports = mongoose.model('refreshToken', refreshTokenSchema, 'refreshTokens');
