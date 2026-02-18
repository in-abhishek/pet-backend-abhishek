const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');
const { isUser, isAdmin } = require('../middleware/authMiddleware');

router.post('/adopt', isUser, adoptionController.adoptPet);
router.get('/my-adoptions', isUser, adoptionController.getMyAdoptions);
router.get('/admin/adoptions', isAdmin, adoptionController.getAdminAdoptions);
router.post('/admin/update-status', isAdmin, adoptionController.updateAdoptionStatus);

module.exports = router;