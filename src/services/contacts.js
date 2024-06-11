import Contact from '../db/contact.js';

export const getAllContacts = async () => {
    const contacts = await Contact.find();
    return contacts;
};

export const getContactById = async (contactId) => {
    const contact = await Contact.findById(contactId);
    return contact;
};

export const createContact = async (contactData) => {
    const contact = new Contact(contactData);
    await contact.save();
    return contact;
};

export const updateContact = async (contactId, updateData) => {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, updateData, {new: true});
    return updatedContact;
};

export const deleteContact = async (contactId) => {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    return deletedContact;
}
