const Adoption = require('../models/Adoption');
const Pet = require('../models/Pet');
const mongoose = require('mongoose');

const adoptPet = async (req, res) => {
    try {
        const { petId } = req.body;
        const userId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(petId)) {
            return res.status(400).json({ message: "Invalid Pet ID" });
        }

        const pet = await Pet.findById(petId);
        if (!pet || pet.status !== 'available') {
            return res.status(400).json({ message: "Pet is no longer available" });
        }

        const existingApplication = await Adoption.findOne({ petId, userId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied" });
        }

        const adoptionRequest = new Adoption({ petId, userId, status: 'pending' });
        await adoptionRequest.save();

        res.status(201).json({ message: "Adoption request submitted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getMyAdoptions = async (req, res) => {
    try {
        const applications = await Adoption.find({ userId: req.user.userId })
            .populate('petId')
            .sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching applications" });
    }
};

const getAdminAdoptions = async (req, res) => {
    try {
        const applications = await Adoption.find()
            .populate('petId', 'name breed imageUrl')
            .populate('userId', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching applications" });
    }
};

const updateAdoptionStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        const application = await Adoption.findById(requestId);
        if (!application) return res.status(404).json({ message: "Request not found" });

        application.status = status;
        await application.save();

        if (status === 'approved') {
            await Pet.findByIdAndUpdate(application.petId, { status: 'adopted' });
            await Adoption.updateMany(
                { petId: application.petId, _id: { $ne: requestId }, status: 'pending' },
                { status: 'rejected' }
            );
        } else if (status === 'rejected') {
            await Pet.findByIdAndUpdate(application.petId, { status: 'available' });
        }
        res.status(200).json({ message: `Success! Application ${status}.` });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    adoptPet,
    getAdminAdoptions,
    getMyAdoptions,
    updateAdoptionStatus
};