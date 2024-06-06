import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    isFavourite: {
        type: Boolean,
        default: false
    },
    contactType: {
        type: String,
        enum: ['work', 'home', 'personal'],
        default: 'personal',
        required: true
    }
}, {
    timestamps: true // Додає поля createdAt і updatedAt
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
