const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');
const removeAccents = require('remove-accents');

const genreSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, default: '' }
}, {
    // timestamps: true,
    versionKey: false
});

genreSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        const noAccentName = removeAccents(this.name);
        this.slug = slugify(noAccentName, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('genre', genreSchema, 'genres');
