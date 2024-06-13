import express from 'express';

import { getAllContactsControllers, getContactByIdControllers,
    createContactControllers, updateContactControllers,
    deleteContactControllers} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/contacts', ctrlWrapper(getAllContactsControllers));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdControllers));

router.post('/contacts', ctrlWrapper(createContactControllers));

router.patch('/contacts/:contactId', ctrlWrapper(updateContactControllers));

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactControllers));

export default router;
