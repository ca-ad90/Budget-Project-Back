const express = require("express");
const router = express.Router();
const controller = require("../../controller")
const accountController = controller.account


router.get("/create", accountController.create_get);

// POST request for creating Author.
router.post("/create", accountController.create_post);

// GET request to delete Author.
router.get("/:id/delete", accountController.delete_get);

// POST request to delete Author.
router.post("/:id/delete", accountController.delete_post);

// GET request to update Author.
router.get("/:id/update", accountController.update_get);

// POST request to update Author.
router.post("/:id/update", accountController.update_post);

// GET request for one Author.
router.get("/:id", accountController.detail);

module.exports = router
