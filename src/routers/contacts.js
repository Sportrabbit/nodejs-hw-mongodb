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

router.get('/', ctrlWrapper(getAllContactsControllers));

router.get('/:contactId', ctrlWrapper(getContactByIdControllers));

router.post('/', upload.single('photo'), validateBody(contactSchema), ctrlWrapper(createContactControllers));

router.patch('/:contactId', upload.single('photo'), validateBody(updateContactSchema), ctrlWrapper(updateContactControllers));

router.delete('/:contactId', ctrlWrapper(deleteContactControllers));

export default router;
