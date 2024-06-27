import Contact from '../db/contact.js';

export const getAllContacts = async (page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', filter = {}) => {
    const skip = (page - 1) * perPage;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    filter.userId = userId;

    const totalItems = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter).sort(sort).skip(skip).limit(perPage);

    return {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages: Math.ceil(totalItems / perPage),
        hasPreviousPage: page > 1,
        hasNextPage: page * perPage < totalItems
    };
};

export const getContactById = async (userId, contactId) => {
    const contact = await Contact.findOne({ _id: contactId, userId });
    return contact;
};

export const createContact = async (userId, contactData) => {
    const contact = new Contact({ ...contactData, userId });
    await contact.save();
    return contact;
};

export const updateContact = async (userId, contactId, updateData) => {
    const updatedContact = await Contact.findOneAndUpdate({ _id: contactId, userId }, updateData, { new: true });
    return updatedContact;
};

export const deleteContact = async (userId, contactId) => {
    const deletedContact = await Contact.findOneAndDelete({ _id: contactId, userId });
    return deletedContact;
};
