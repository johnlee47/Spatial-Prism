import express from 'express';

import {getUsers, deleteUsers, editUsers } from '../controller/admin/users.js';
import auth from '../middleware/auth.js'
import {admin} from '../middleware/role.js'
const router = express.Router();


router.get('/users',auth, admin,  getUsers);
router.patch(`/users/:id`,auth, admin,  editUsers);
router.delete('/users/:id',auth, admin, deleteUsers);

export default router;