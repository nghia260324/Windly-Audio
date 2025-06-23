const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');
const removeAccents = require('remove-accents');

const songSchema = new Schema({
    _id: { type: String, default: uuidv4, required: true },

    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    artistIds: [{ type: String, ref: 'artist', required: true }],
    duration: { type: Number },

    audioUrl: { type: String, required: true },
    thumbnail: { type: String, default: null },

    isSystem: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    owner: { type: String, ref: 'user', default: null },

    requiresPremium: { type: Boolean, default: false },

    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    favoritesCount: { type: Number, default: 0 },

    genreIds: [{ type: String, ref: 'genre', default: null }],
    tags: { type: [String], default: [] },

    lyricMeta: {
        hasLyric: { type: Boolean, default: false },
        isSynced: { type: Boolean, default: false }
    },

    lyric: {
        type: [
            {
                _id: false,
                time: { type: Number },  // giây
                text: { type: String }
            }
        ],
        default: null
    }
}, {
    timestamps: true,
    versionKey: false,
});

songSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        const noAccentName = removeAccents(this.title);
        this.slug = slugify(noAccentName, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('song', songSchema, 'songs');
