import Contact from '../db/contact.js';
import createHttpError from 'http-errors';
import { saveFile } from '../utils/saveFile.js';

export const getAllContacts = async (userId, page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', filter = {}) => {
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

export const createContact = async ({ photo, ...contactData }, userId) => {
    let photoUrl = '';

    if (photo) {
        console.log('Saving file to cloud/local...');
        photoUrl = await saveFile(photo);
        console.log('File saved:', photoUrl);
    }

    const contact = await Contact.create({
        ...contactData,
        userId: userId,
        photoUrl: photoUrl,
    });
    return {
        ...contact.toObject(),
        photoUrl,
    };
};

export const updateContact = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);

    if (!result) {
      next(createHttpError(404, 'Contact not found'));
      return;
    }

    res.json({
      status: 200,
      message: `Successfully patched a contact!`,
      data: result.contact,
    });
};

export const deleteContact = async (userId, contactId) => {
    const deletedContact = await Contact.findOneAndDelete({ _id: contactId, userId });
    return deletedContact;
};
