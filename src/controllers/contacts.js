import mongoose from 'mongoose';
import CreateError from 'http-errors';
import { updateContactSchema } from '../validation/contactValidation.js';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';
import Contact from '../db/contact.js';

export const getAllContactsControllers = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { page = '1', perPage = '10', sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

        const pageNum = parseInt(page, 10);
        const perPageNum = parseInt(perPage, 10);

        if (isNaN(pageNum) || isNaN(perPageNum) || pageNum <= 0 || perPageNum <= 0) {
            throw CreateError(400, `Invalid pagination values`);
        }

        const filter = { userId };
        if (type) filter.contactType = type;
        if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

        console.log('Filter:', filter);

        const result = await getAllContacts(pageNum, perPageNum, sortBy, sortOrder, filter);

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
            throw CreateError(404, 'Contact not found');
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

        console.log('Received body:', body);
        console.log('Received file:', file);

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
        console.log('Entering updateContactControllers');

        const { contactId } = req.params;
        const { name, phoneNumber, email, isFavourite, contactType } = req.body;
        const userId = req.user._id;
        const file = req.file;

        console.log('Request params:', req.params);
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('User ID:', userId);

        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            console.log('Invalid contact ID:', contactId);
            throw CreateError(400, 'Invalid contact ID');
        }

        const contact = await Contact.findOne({ _id: contactId, userId });
        console.log('Found contact:', contact);

        if (!contact) {
            console.log('Contact not found:', contactId);
            throw CreateError(404, 'Contact not found');
        }

        const { error } = updateContactSchema.validate({ name, phoneNumber, email, isFavourite, contactType });
        if (error) {
            console.log('Validation error:', error.details[0].message);
            throw CreateError(400, error.details[0].message);
        }

        const updateData = { name, phoneNumber, email, isFavourite, contactType };
        if (file) {
            updateData.photo = file.path; // Збереження шляху до файлу в updateData
        }

        console.log('Update Data before file processing:', updateData);
        const updatedContact = await updateContact(userId, contactId, updateData);
        console.log('Update Data after file processing:', updateData);

        if (!updatedContact) {
            console.log('Contact not found:', contactId);
            throw CreateError(404, 'Contact not found');
        }

        res.status(200).json({
            status: 200,
            message: 'Successfully patched a contact!',
            data: updatedContact,
        });
    } catch (error) {
        console.log('Error:', error.message);
        next(error);
    }
};

export const deleteContactControllers = async (req, res, next) => {
    try {
        const contactId = req.params.contactId;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            throw CreateError(400, 'Invalid contact ID');
        }

        const deletedContact = await deleteContact(contactId, userId);

        if (!deletedContact) {
            throw CreateError(404, 'Contact not found');
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
