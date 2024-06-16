import express from 'express';

import { getAllContactsControllers, getContactByIdControllers, createContactControllers,
    updateContactControllers, deleteContactControllers} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { contactSchema, updateContactSchema } from '../validation/contactValidation.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();

router.get('/contacts', ctrlWrapper(getAllContactsControllers));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdControllers));

router.post('/contacts', validateBody(contactSchema), ctrlWrapper(createContactControllers));

router.patch('/contacts/:contactId', validateBody(updateContactSchema), ctrlWrapper(updateContactControllers));

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactControllers));

export default router;
