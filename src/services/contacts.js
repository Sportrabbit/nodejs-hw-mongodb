import Contact from '../db/contact.js';

export const getAllContacts = async (page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', filter = {}) => {
    const skip = (page - 1) * perPage;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

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

export const getContactById = async (filter) => {
    const contact = await Contact.findOne(filter);
    return contact;
};

export const createContact = async (contactData) => {
    const contact = new Contact(contactData);
    await contact.save();
    return contact;
};

export const updateContact = async (filter, updateData) => {
    const updatedContact = await Contact.findByIdAndUpdate(filter, updateData, {new: true});
    return updatedContact;
};

export const deleteContact = async (filter) => {
    const deletedContact = await Contact.findByIdAndDelete(filter);
    return deletedContact;
}
