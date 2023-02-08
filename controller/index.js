const Controllers = {}
const Models = require("../models")
Controllers.account = require("./account.controller.js")
Controllers.transaction = require("./transaction.controller.js")
Controllers.transactioninstance = require("./transactioninstace.controller.js")
Controllers.category = require("./category.controller.js")
let hide = {



    create: (req, res, next) => {

        const model = Model[req.userData.model].model
        let fields = req.userData.fields
        let error
        let data = {}
        for (let f of fields) {
            f = f.name

            data[f] = req.body.hasOwnProperty(f.toLowerCase()) ? req.body[f.toLowerCase()] : ""
        }
        for (let d in data) {
            if (!data[d] && data[d] !== 0) {
                delete data[d]
            }
        }
        const mod = new model(data)

        mod.save(mod).then(data => {

            res.send(data)


        }).catch(err => {
            console.log(err)
            res.status(500).send({
                message:
                    err.message || "some Error occurred while creating " + req.userData.model
            })
        })


    },
    findAll: async (req, res, next) => {
        if (req.query) {

        }
        let model = Model[req.userData.model].model
        let fields = req.userData.fields
        var query = req.query
        var condition = {}
        for (let q in query) {
            condition[q] = { $regex: new RegExp(query[q]), $options: "i" }
        }

        let test = model.find(query)
        req.responseData = test
        next()
        return
        if (req.userData.model == "transactions") {
            test.populate({ path: "account", select: "name" }).populate({ path: "category", select: "name", transform: (doc, id) => doc == null ? id : doc }).exec(function (err, transaction) {
                console.log(err, transaction)
                res.send(transaction)
            })
        } else {
            test.then(data => {
                if (data.length) {
                    data.map(e => e.toJSON())
                }
                res.send(data)

            }).catch(err => {
                console.log(err)
                res.status(500).send({
                    message:
                        err.message || "some Error occurred during findById (" + id + ") in " + req.userData.model
                })
            })
        }


    }





}

Controllers.list = (req, res, next) => {
    let str = req.userData.model
    let modelName = str.toLowerCase() == "categories" ? "Category" : str.substring(0, 1).toUpperCase() + str.substring(1)
    let model = Models[modelName]
    model.find(req.userData.query)
        .exec(function (err, docs) {
            let result = docs.map(e => { return e.toJSON() })
            res.send(result);
        })

}

Controllers.deleteAll = (req, res, next) => {
    let modelNames = Object.keys(Models)
    let model
    if (modelNames.some(e => {
        return e.toLowerCase() == req.userData.model.toLowerCase()
    })) {
        model = Models[modelNames[modelNames.findIndex(e => {
            e.toLowerCase() == req.userData.model.toLowerCase()
        })]]
    } else {
        res.status(500).send({ msg: "INGEN SÅDAN MODELL HITTADES" })
        return
    }

    model.deleteMany({})
        .then(data => {
            res.send({
                message:
                    `${data.deletedCount} ${req.userData.model}s were deleted successfully!`
            })
        }).catch(err => {
            console.log(err)
            res.status(500).send({
                message:
                    err.message || "some Error occurred while deleteing all " + req.userData.model
            })
        })

}
Controllers.config = (req, res, next) => {
    console.log("CONFIG")
    let modelNames = Object.keys(Models)
    let schemas = {}

    for (let m of modelNames) {

        schemas[m] = {}

        for (let p in Models[m].schema.paths) {
            schemas[m][p] = {
                instance: Models[m].schema.paths[p].instance,
                isRequired: Models[m].schema.paths[p].isRequired

            }
        }
    }
    Promise.all([Models.Account.find({}), Models.Category.find({})]).then(data => {
        let result = {
            Schemas: schemas,
            accounts: data[0].map(e => e.toJSON()),
            categories: data[1].map(e => e.toJSON())
        }
        console.log(result)
        res.send(result)
    })

}
module.exports = Controllers
