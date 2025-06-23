const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const favoriteSchema = new Schema({
    _id: { type: String, default: uuidv4, required: true },
    userId: { type: String, ref: "user", required: true },
    itemId: { type: String, required: true },
    itemType: {
        type: String,
        enum: ['song', 'album', 'playlist'],
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

favoriteSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });

module.exports = mongoose.model("favorite", favoriteSchema, "favorites");
