import express from 'express'
import { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getUsers, deleteUser, updateUser, getUserById } 
from '../controllers/userController.js';
import { protect,admin } from '../middleware/authMiddleware.js';

const router=express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.post('/logout', logoutUser)
router.post('/auth', authUser)

/*And then as far as the routes I want to protect, let's see, we have our profile, right?

So obviously to get the user profile or to update, we need to be registered.

So we want to protect those.

So what we can do is before the function name, we're just going to put in the protect middleware.

So that's to get user profile.

And then here when we have a dot put and update user profile, also going to add in protect there as

well. */
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.route('/:id').delete(protect, admin,deleteUser).get(protect, admin,getUserById).put(protect, admin,updateUser);

export default router;