import express from 'express';

import { getAllContactsControllers, getContactByIdControllers,
    createContactControllers, updateContactControllers,
    deleteContactControllers} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const contactsRouter = () => {
    const app = express();

    app.get('/contacts', ctrlWrapper(getAllContactsControllers));

    app.get('/contacts/:contactId', ctrlWrapper(getContactByIdControllers));

    app.post('/contacts', ctrlWrapper(createContactControllers));

    app.patch('/contacts/:contactId', ctrlWrapper(updateContactControllers));

    app.delete('/contacts/:contactId', ctrlWrapper(deleteContactControllers));
};

