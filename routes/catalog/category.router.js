const express = require("express");
const router = express.Router();
const controller = require("../../controller")
const categoryController = controller.category

router.get("/create", categoryController.create_get);

//POST request for creating category.
router.post("/create", categoryController.create_post);

// GET request to delete category.
router.get("/:id/delete", categoryController.delete_get);

// POST request to delete category.
router.post("/:id/delete", categoryController.delete_post);

// GET request to update category.
router.get("/:id/update", categoryController.update_get);

// POST request to update category.
router.post("/:id/update", categoryController.update_post);

// GET request for one category.
router.get("/:id", categoryController.detail);



module.exports = router
