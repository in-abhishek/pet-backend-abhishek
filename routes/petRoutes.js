const express = require('express');
const router = express.Router();
const { updatePet,deletePet ,AddNewPet,editPost,getPet,getPetAll} = require('../controllers/petController');
const { isAdmin, isUser } = require('../middleware/authMiddleware');

router.put('/update-pet/:id', isAdmin, updatePet);


router.delete('/pets/:id',isAdmin,deletePet);
router.post('/add-pet',isAdmin,AddNewPet);
router.get('/pets/:id',isUser,getPet);
router.get('/get-edit-pets/:id',isAdmin,editPost);
router.get('/pets',getPetAll);





module.exports = router;