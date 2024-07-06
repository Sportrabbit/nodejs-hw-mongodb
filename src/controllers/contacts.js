import mongoose from 'mongoose';
import CreateError from 'http-errors';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';

export const getAllContactsControllers = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

        const filter = {userId};
        if (type) filter.contactType = type;
        if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

        const result = await getAllContacts(Number(page), Number(perPage), sortBy, sortOrder, filter);

        res.status(200).json({
            status: 200,
            message: 'Successfully found contacts!',
            data: {
                data: result.data,
                page: result.page,
                perPage: result.perPage,
                totalItems: result.totalItems,
                totalPages: result.totalPages,
                hasPreviousPage: result.hasPreviousPage,
                hasNextPage: result.hasNextPage
            }
        });
    } catch (error) {
        next(error);
    }
};


export const getContactByIdControllers = async (req, res, next) => {
    try {
        const contactId = req.params.contactId;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            throw CreateError(400, 'Invalid contact ID');
        }

        const contact = await getContactById(contactId, userId);

        if (!contact) {
            throw CreateError(404, 'Contact not found')
        }

        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}`,
            data: contact,
        });
    } catch (error) {
        next(error);
    }
};

export const createContactControllers = async (req, res, next) => {
    try {
        const { body, file } = req;

        const contact = await createContact({ ...body, photo: file }, req.user._id);

        res.status(201).json({
          status: 201,
          message: `Successfully created a contact!`,
          data: contact,
        });
    } catch (error) {
        next(error);
    };
};

export const updateContactControllers = async (req, res, next) => {
    try {
        const contactId = req.params.contactId;
        const {name, phoneNumber, email, isFavourite, contactType } = req.body;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            throw CreateError(400, 'Invalid contact ID');
        }

        const updatedContact = await updateContact(contactId, userId, {name, phoneNumber, email, isFavourite, contactType});

        if (!updatedContact) {
            throw CreateError(404, 'Contact not found')
        }

        res.status(200).json({
            status: 200,
            message: 'Successfully patched a contact!',
            data: updatedContact,
        });
    } catch (error) {
        next(error);
    }
}

export const deleteContactControllers = async (req, res, next) => {
    try {
        const contactId = req.params.contactId;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            throw CreateError(400, 'Invalid contact ID');
        }

        const deletedContact = await deleteContact(contactId, userId);

        if (!deletedContact) {
            throw CreateError(404, 'Contact not found')
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
