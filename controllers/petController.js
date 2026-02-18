const Adoption = require('../models/Adoption');
const Pet = require('../models/Pet');
const mongoose = require('mongoose');

const updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body; 

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        const updatedPet = await Pet.findByIdAndUpdate(
            id, 
            { $set: updateData }, 
            { new: true, runValidators: true }
        );

        if (!updatedPet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        res.status(200).json({
            message: "Pet updated successfully!",
            pet: updatedPet
        });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Failed to update pet details" });
    }
};

const deletePet =  async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPet = await Pet.findByIdAndDelete(id);

        if (!deletedPet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        res.json({ message: "Pet deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting pet" });
    }
};

const AddNewPet =  async (req, res) => {
    try {
        const { name, species, breed, age, description, imageUrl, status } = req.body;

        if (!name || !species || !breed || !age) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const newPet = new Pet({
            name,
            species,
            breed,
            age,
            description,
            imageUrl,
            status: status || 'available'
        });

        const savedPet = await newPet.save();
        res.status(201).json({
            message: "Pet added successfully",
            pet: savedPet
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while adding pet" });
    }
};

const getPet =  async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid ID format."
            });
        }

        const pet = await Pet.findById(id);

        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        const application = await Adoption.findOne({
            petId: id,
            userId: userId
        });

        res.status(200).json({
            ...pet._doc,
            alreadyApplied: !!application,
            userApplicationStatus: application ? application.status : null
        });

    } catch (error) {
        console.error("Error fetching pet details:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const editPost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        const pet = await Pet.findById(id);

        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        res.status(200).json({
            pet: pet,
            message: "Pet details fetched successfully"
        });

    } catch (error) {
        console.error("Error fetching pet details:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// get all pets
const getPetAll =  async (req, res) => {
    try {
        const pets = await Pet.find({ status: 'available' }).sort({ createdAt: -1 });
        res.status(200).json(pets);
    } catch (error) {
        console.error("Error fetching pets:", error);
        res.status(500).json({ message: "Failed to fetch pets" });
    }
};

module.exports = {
    updatePet,deletePet,
    AddNewPet,editPost,getPet,getPetAll
};