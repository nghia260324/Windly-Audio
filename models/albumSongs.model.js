const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const albumSongSchema = new Schema({
    _id: { type: String, default: uuidv4 },

    albumId: { type: String, ref: 'album', required: true },
    songId: { type: String, ref: 'song', required: true },

    trackNumber: { type: Number },
    addedAt: { type: Date, default: Date.now },
}, {
    versionKey: false,
    timestamps: true,
});

albumSongSchema.index({ albumId: 1, songId: 1 }, { unique: true });

module.exports = mongoose.model('albumSong', albumSongSchema, 'albumSongs');
