const express = require("express");
const router = express.Router();
const routes = {}
const controller = require("../../controller")
routes.account = require("./account.router.js")
routes.transaction = require("./transaction.router.js")
routes.transactioninstance = require("./transactioninstance.router.js")
routes.category = require("./category.router.js")
console.log("its a catalog")

/// transaction ROUTES ///
router.get("/config", controller.config);
//router.get("/accounts", controller.list);
//router.get("/transactioninstances", controller.list);
//router.get("/categories", controller.list);
router.use("/:model", (req, res, next) => {
    req.userData.model = req.params.model
    let route = req.params.model.toLowerCase()
    if (routes.hasOwnProperty(route)) {
        console.log("ROUTE: " + req.userData.model)
        return routes[route](req, res, next)
    } else {
        req.userData.model = req.params.model
        next()
    }
}, controller.list)

router.delete("/delete/:model", (req, res, next) => {
    if (req.params.model) {
        req.userData.model = req.params.model
        console.log("DELETE ALL: " + req.params.model)
        next()
    }
}, controller.deleteAll)



module.exports = router;
