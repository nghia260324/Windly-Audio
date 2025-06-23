const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');
const removeAccents = require('remove-accents');

const playlistSchema = new Schema({
    _id: { type: String, default: uuidv4, required: true },

    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },

    description: { type: String, default: null },
    thumbnail: { type: String, default: null },

    owner: { type: String, ref: 'user', required: true },  // Người tạo playlist

    songs: [{ type: String, ref: 'song' }],

    isPublic: { type: Boolean, default: true }, // true = ai cũng xem được, false = riêng tư
    isSystem: { type: Boolean, default: false } // Playlist hệ thống tạo
}, {
    versionKey: false,
});

playlistSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        const noAccentName = removeAccents(this.name);
        this.slug = slugify(noAccentName, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('playlist', playlistSchema, 'playlists');
