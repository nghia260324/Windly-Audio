const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const historySchema = new Schema({
    _id: { type: String, default: uuidv4, required: true },
    userId: { type: String, ref: "user", required: true, unique: true },
    songIds: [{ type: String, ref: "song" }],
}, {
    versionKey: false,
});

historySchema.index({ userId: 1 });

module.exports = mongoose.model("history", historySchema, "histories");
