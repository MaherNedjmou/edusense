const express = require("express");
const router = express.Router();

const planController = require("../controller/SubscribeCon");

router.post("/", planController.createPlan);

router.get("/", planController.getPlans);

router.get("/:id", planController.getPlanById);

router.put("/:id", planController.updatePlan);

router.delete("/:id", planController.deletePlan);

module.exports = router;
