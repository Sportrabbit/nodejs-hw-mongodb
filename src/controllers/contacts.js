import mongoose from 'mongoose';
import CreateError from 'http-errors';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';

export const getAllContactsControllers = async (req, res, next) => {
    try {
        const contacts = await getAllContacts();
        console.log('Contacts:', contacts);

        res.status(200).json({
            status: 200,
            message: 'Successfully found contacts!',
            data: contacts,
        });
    } catch (error) {
        next(error);
    }
};

export const getContactByIdControllers = async (req, res, next) => {
    try {
        const contactId = req.params.contactId;
        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            throw CreateError(404, 'Invalid contact ID');
        }

        const contact = await getContactById(contactId);

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

        const newContact = await createContact({name, phoneNumber, email, isFavourite, contactType});

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
            throw CreateError(404, 'Invalid contact ID');
        }

        const updatedContact = await updateContact(contactId, {name, phoneNumber, email, isFavourite, contactType});

        if (!updateContact) {
            throw CreateError(404, 'Contact not found')
        }

        res.status(200).json({
            status: 200,
            message: 'Successfully patched a contact!',
            data: updateContact,
        });
    } catch (error) {
        next(error);
    }
}

export const deleteContactControllers = async (req, res, next) => {
    try {
        const contactId = req.params.contactId;

        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            throw CreateError(404, 'Invalid contact ID');
        }

        const deletedContact = await deleteContact(contactId);

        if (!deleteContact) {
            throw CreateError(404, 'Contact not found')
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }


}
