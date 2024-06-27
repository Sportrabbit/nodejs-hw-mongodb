import mongoose from 'mongoose';
import CreateError from 'http-errors';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';

export const getAllContactsControllers = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

        const filter = {userId: req.user._id};
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
        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            throw CreateError(400, 'Invalid contact ID');
        }

        const contact = await getContactById({_id: contactId, userId: req.user._id});

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
        const {name, phoneNumber, email, isFavourite, contactType } = req.body;

        if (!name || !phoneNumber) {
            throw CreateError(400, 'Name and phone number are required');
        }

        const newContact = await createContact({name, phoneNumber, email, isFavourite, contactType, userId: req.user._id});

        res.status(201).json({
            status: 201,
            message: 'Successfully created a contact!',
            data: newContact,
        });
    } catch (error) {
        next(error);
    }
};

export const updateContactControllers = async (req, res, next) => {
    try {
        const contactId = req.params.contactId;
        const {name, phoneNumber, email, isFavourite, contactType } = req.body;

        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            throw CreateError(400, 'Invalid contact ID');
        }

        const updatedContact = await updateContact({ _id: contactId, userId: req.user._id }, {name, phoneNumber, email, isFavourite, contactType});

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

        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            throw CreateError(400, 'Invalid contact ID');
        }

        const deletedContact = await deleteContact({ _id: contactId, userId: req.user._id });

        if (!deletedContact) {
            throw CreateError(404, 'Contact not found')
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
