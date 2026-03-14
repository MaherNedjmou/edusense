const SubscribePlan = require("../model/Subscribe");

// CREATE
const createPlan = async (req, res) => {
    try {
        const plan = await SubscribePlan.create(req.body);
        res.json(plan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL
const getPlans = async (req, res) => {
    try {
        const plans = await SubscribePlan.find();
        res.json(plans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ONE
const getPlanById = async (req, res) => {
    try {
        const plan = await SubscribePlan.findById(req.params.id);
        res.json(plan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
const updatePlan = async (req, res) => {
    try {
        const plan = await SubscribePlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(plan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
const deletePlan = async (req, res) => {
    try {
        await SubscribePlan.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createPlan,
    getPlans,
    getPlanById,
    updatePlan,
    deletePlan
};
