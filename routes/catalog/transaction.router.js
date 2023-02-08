const express = require("express");
const router = express.Router();
const controller = require("../../controller")
const transactionController = controller.transaction
router.use(transactionController.queryHandler)
router.get("/", transactionController.list)
router.get("/group/:group", (req, res, next) => {
    console.log("GROUP:", req.params.group)
    req.userData.group = req.params.group
    next()
}, transactionController.list)
// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).

router.get("/category/:cat?.:sub?.:subsub?", transactionController.getByCategory)

/*
// POST request for creating Book.
router.post("/create", transactionController.create_post);
// GET request to delete Book.
router.delete("/delete", transactionController.delete_get);
// POST request to update Book.
router.put("/update", transactionController.update_post);
router.patch("/update", transactionController.update_post);

// GET request for one Book.
router.get("/:id", transactionController.detail);

*/



module.exports = router
