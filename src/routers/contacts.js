import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { upload } from '../middlewares/upload.js';
import  validateBody  from '../middlewares/validateBody.js';
import { contactSchema, updateContactSchema } from '../validation/contactValidation.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
    getAllContactsControllers,
    getContactByIdControllers,
    createContactControllers,
    updateContactControllers,
    deleteContactControllers
} from '../controllers/contacts.js';

const router = express.Router();

router.use(authenticate);

router.get('/contacts', ctrlWrapper(getAllContactsControllers));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdControllers));

router.post('/contacts', upload.single('photo'), validateBody(contactSchema), ctrlWrapper(createContactControllers));

router.patch('/contacts/:contactId', validateBody(updateContactSchema), ctrlWrapper(updateContactControllers));

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactControllers));

export default router;
