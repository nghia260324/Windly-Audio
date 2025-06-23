const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');
const removeAccents = require('remove-accents');

const albumSchema = new Schema({
    _id: { type: String, default: uuidv4, required: true },

    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },

    coverImage: { type: String, default: null }, // ảnh bìa album
    description: { type: String, default: null },

    artists: [{ type: String, ref: 'artist', required: true }], // nghệ sĩ tham gia
    releaseDate: { type: Date, default: Date.now },

    isPublic: { type: Boolean, default: false },
    requiresPremium: { type: Boolean, default: false },
    // songs: [{ type: String, ref: 'song' }], // danh sách bài hát thuộc album
}, {
    versionKey: false,
});

albumSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        const noAccentName = removeAccents(this.name);
        this.slug = slugify(noAccentName, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('album', albumSchema, 'albums');
