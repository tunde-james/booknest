import express from 'express';

import MyUserController from '../controllers/my-user-controller.js';

const router = express.Router();

router.get('/me', MyUserController.getCurrentUser)
router.post('/signup', MyUserController.createUser);
router.post('/login', MyUserController.LoginUser)
router.post('/logout', MyUserController.LogoutUser)


export default router;
