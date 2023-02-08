const express = require("express");
const router = express.Router();
const controller = require("../../controller")
const transactionInstaceController = controller.transactioninstance
router.get(
    "/create",
    transactionInstaceController.create_get
);

// POST request for creating BookInstance.
router.post(
    "/create",
    transactionInstaceController.create_post
);

// GET request to delete BookInstance.
router.get(
    "/:id/delete",
    transactionInstaceController.delete_get
);

// POST request to delete BookInstance.
router.post(
    "/:id/delete",
    transactionInstaceController.delete_post
);

// GET request to update BookInstance.
router.get(
    "/:id/update",
    transactionInstaceController.update_get
);

// POST request to update BookInstance.
router.post(
    "/:id/update",
    transactionInstaceController.update_post
);

// GET request for one BookInstance.
router.get("/:id", transactionInstaceController.detail);

module.exports = router
