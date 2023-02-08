const Models = require("../models");
const async = require("async")
const { Schema } = require("mongoose");
const { query } = require("express");
const Transaction = Models.Transaction;
const Category = Models.Category
const transactionInstance = Models.TransactionInstance
const Account = Models.Account
const testJSON = Models.testJSON
const groupResults = async (req, docs, query) => {
    let group, subGroup
    if (typeof req.userData.group === "object" && req.userData.group.hasOwnProperty("group")) {
        group = group.group
        subGroup = req.userData.subGroup
    } else {
        group = req.userData.group
        subGroup = null
    }

    let model = Models[req.userData.model.toLowerCase() == req.userData.model.substring(0, 1).toUpperCase() + req.userData.model.substring(1)]
    let paths = Object.keys(model.schema.paths)
    if (paths.find(e => e.toLowerCase() == group.toLowerCase()) == -1) {
        throw (new Error({ msg: "no such group path in model" }))
    }

    if (subGroup) {
        let model = Models[req.userData.model.toLowerCase() == req.userData.model.substring(0, 1).toUpperCase() + req.userData.model.substring(1)]
        let paths = Object.keys(model.schema.paths)
        if (paths.find(e => e.toLowerCase() == subGroup.toLowerCase()) == -1) {
            throw (new Error({ msg: "no such subgruop path in group Model" }))
        }
    }

    debugger
    let groupQuery
    console.log('docs', docs);
    if (!group) {
        return docs
    }
    if (query) {
        groupQuery = query.split(";")

    } else {
        groupQuery = ["amount"]
    }
    let groupObj = { keys: [], total: { count: 0 }, data: {} }


    for (let doc of docs) {
        console.log("Group-Doc", doc[group])
        let key
        if (typeof doc[group] === "object") {
            if (doc[group] instanceof Date) {
                let day = ("0" + doc[group].getDate().toString()).substring(doc[group].getDate().toString().length - 1)
                let month = ("0" + doc[group].getMonth().toString()).substring(doc[group].getMonth().toString().length - 1)
                key = `${doc[group].getFullYear()}-${month}-${day}`
            }
            if (doc[group].name) {
                key = doc[group].name
            } else {
                key = doc[group]
            }
        } else {
            key = doc[group]
        }
        console.log("key", key)
        if (!groupObj.data.hasOwnProperty(key)) {
            groupObj.data[key] = { count: 0 }

            groupObj.keys.push(key)
        }
        for (let q of groupQuery) {
            if (!groupObj.data[key].hasOwnProperty(q)) {
                if (typeof doc[q] == "number") {
                    groupObj.data[key][q] = 0
                    groupObj.total[q] = 0
                } else {
                    groupObj.data[key][q] = []
                    groupObj.total[q] = []
                }
            }
            if (doc[q] instanceof Date) {
                debugger
            }
            if (typeof doc[q] == "number") {
                groupObj.total[q] += doc[q]
                groupObj.data[key][q] += doc[q]
                groupObj.total[q] = Number(groupObj.total[q].toFixed(2))
                groupObj.data[key][q] = Number(groupObj.data[key][q].toFixed(2))
            } else {
                try {
                    groupObj.total[q].push(doc[q])
                    groupObj.data[key][q].push(doc[q])
                } catch (err) {
                    debugger
                }

            }




        }
        groupObj.total.count++
        groupObj.data[key].count++




    }
    console.log('groupObj', groupObj);
    return groupObj
}
const groupHandler = (req) => {
    let field = req.query.group || "amount"


    let match = {
        '$match': req.userData.query
    }
    let facet = {
        '$facet': {
            'ROOT': [
                {
                    '$lookup': {
                        'from': 'categories',
                        'localField': 'category',
                        'foreignField': '_id',
                        'as': 'category'
                    }
                }, {
                    '$lookup': {
                        'from': 'accounts',
                        'localField': 'account',
                        'foreignField': '_id',
                        'as': 'account'
                    }
                }, {
                    '$unwind': '$category'
                }, {
                    '$unwind': '$account'
                }, {
                    '$set': {
                        'category_tmp': {
                            'name': '$category.name',
                            '_id': '$category._id'
                        }
                    }
                }, {
                    '$set': {
                        'account_tmp': {
                            'name': '$account.name',
                            '_id': '$account._id'
                        }
                    }
                }, {
                    '$set': {
                        'category': '$category_tmp'
                    }
                }, {
                    '$set': {
                        'account': '$account_tmp'
                    }
                }, {
                    '$unset': 'category_tmp'
                }, {
                    '$unset': 'account_tmp'
                }
            ]
        }
    }

    let unwind = {
        '$unwind': {
            'path': '$ROOT'
        }
    }

    let replaceRoot = {
        '$replaceRoot': {
            'newRoot': '$ROOT'
        }
    }

    let group = {
        '$group': {
            '_id': '$' + req.userData.group,

            'count': {
                '$sum': 1
            },
        }
    }
    if (Transaction.schema.paths[field] instanceof Schema.Types.Number) {
        group['$group'][field] = { '$sum': '$' + field }
    } else {
        group['$group'][field] = { '$push': '$' + field }
    }



    return [match, facet, unwind, replaceRoot, group]
}


function recGruop(docs, groupArr, props) {

    const getLayout = (arr, i) => {
        let tmpObj = { name: arr[i] }
        if (i == arr.length - 1) {
            return tmpObj
        }
        else {
            let j = i + 1
            tmpObj[arr[j]] = getLayout2(arr, j)
            return tmpObj




        }


    }



    data = {}


    for (let doc in docs) {
        function objectThing(layout, doc) {
            let name = doc[layout.name]

        }


        function createLayout(obj, arr, i = 0) {
            let groupName = typeof doc[arr[i]] == "object" ? doc[arr[i]].name : doc[arr[i]]
            if (!obj.hasOwnProperty(doc[groupName])) {
                obj[doc[groupName]] = {}
            }
            for (let p of props) {
                if (!obj.hasOwnProperty(doc[doc[groupName]][p])) {

                    if (typeof doc[p] == "number") {
                        obj[doc[groupName]][doc[gropupName]][p] = 0
                    } else {
                        obj[doc[groupName]][doc[gropupName]][p] = []
                    }
                }
                if (typeof doc[p] == "number") {
                    obj[doc[groupName]][doc[gropupName]][p] += doc[p]
                } else {
                    obj[doc[groupName]][doc[gropupName]][p].push(doc[p])
                }

            }

            if (arr.length < i + 1) {
                let obj = {}
                var j = i + 1
                obj[arr[i]] = createLayout(obj[arr[i]], arr, j)
                return obj

            } else {
                return obj
            }
        }
    }


    let layout = createLayout(groupArr)

    let data = {}

    if (layout.length) {

    }



















}



const group2 = async (req, docs, query) => {


    let group, subGroup
    if (typeof req.userData.group === "object" && req.userData.group.hasOwnProperty("group")) {
        group = req.userData.group
        subGroup = req.userData.subGroup
    } else {
        group = req.userData.group
        subGroup = null
    }
    if (!group) {
        return docs
    }
    let model = Models[req.userData.model.substring(0, 1).toUpperCase() + req.userData.model.substring(1)]
    console.log(model, req.userData.model.substring(0, 1).toUpperCase() + req.userData.model.substring(1))
    let paths = Object.keys(model.schema.paths)
    if (paths.findIndex(e => {
        console.log(e, e.toLowerCase())
        return e.toLowerCase() == group.toLowerCase()
    }) == -1) {
        throw (new Error({ msg: "no such group path in model" }))
    }

    if (subGroup) {
        let model = Models[req.userData.model.toLowerCase() == req.userData.model.substring(0, 1).toUpperCase() + req.userData.model.substring(1)]
        let paths = Object.keys(model.schema.paths)
        if (paths.findIndex(e => e.toLowerCase() == subGroup.toLowerCase()) == -1) {
            throw (new Error({ msg: "no such subgruop path in group Model" }))
        }
    }
    let groupQuery



    if (query) {
        groupQuery = query.split(";")

    } else {
        groupQuery = ["amount"]
    }

    let groupObj = { keys: [], total: { count: 0 }, data: {} }

    for (let doc of docs) {
        console.log("Group-Doc", doc[group])
        // Get and Define Current Group name (key)
        let key
        if (typeof doc[group] === "object") {
            if (doc[group] instanceof Date) {
                let day = ("0" + doc[group].getDate().toString()).substring(doc[group].getDate().toString().length - 1)
                let month = ("0" + doc[group].getMonth().toString()).substring(doc[group].getMonth().toString().length - 1)
                key = `${doc[group].getFullYear()}-${month}-${day}`
            }
            if (doc[group].name) {
                key = doc[group].name
            } else {
                key = doc[group]
            }
        } else {
            key = doc[group]
        }
        console.log("key", key)


        // Create Key on Group Object if it doesnt have it already
        if (!groupObj.data.hasOwnProperty(key)) {
            groupObj.data[key] = { count: 0 }
            groupObj.keys.push(key)
        }

        //Loop each grouping prop
        for (let q of groupQuery) {

            // Create prop in current Group
            if (!groupObj.data[key].hasOwnProperty(q)) {
                if (typeof doc[q] == "number") {
                    groupObj.data[key][q] = 0
                    groupObj.total[q] = 0
                } else {
                    groupObj.data[key][q] = []
                    groupObj.total[q] = []
                }
            }


            if (typeof doc[q] == "number") {
                groupObj.total[q] += doc[q]
                groupObj.data[key][q] += doc[q]
                groupObj.total[q] = Number(groupObj.total[q].toFixed(2))
                groupObj.data[key][q] = Number(groupObj.data[key][q].toFixed(2))
            } else {
                try {
                    groupObj.total[q].push(doc[q])
                    groupObj.data[key][q].push(doc[q])
                } catch (err) {
                    debugger
                }

            }
        }
        groupObj.total.count++
        groupObj.data[key].count++
    }



    console.log('groupObj', groupObj);
    return groupObj

}

exports.queryHandler = async (req, res, next) => {
    let query = {}
    if (req.query && Object.keys(req.query).length > 0) {

        for (let q in req.query) {
            if (q == "group") { continue }
            query[q] = {}
            let queryObj = { $in: [] }
            let val
            if (typeof req.query[q] === "string") {
                val = [req.query[q].split(";").map(e => e.replace(/"|'/g, ""))]
            } else {
                val = req.query[q].map(e => e.split(";").map(e => e.replace(/"|'/g, "")))
            }
            for (v of val) {
                for (let value of v) {
                    switch (q) {

                        case "amount":
                            if (value.indexOf("<") != -1) {
                                queryObj.$lte = Number(value.replace(/[^\d\.]/g, ""))
                            } else if (value.indexOf(">") != -1) {
                                queryObj.$gte = Number(value.replace(/[^\d\.]/g, ""))
                            } else {
                                queryObj.$in.push(Number(value.replace(/[^\d\.]/g, "")))
                            }
                            break;

                        case "date":
                            let d
                            if (value.indexOf("from:") != -1 || (v.length === 2 && value === v[0])) {
                                d = new Date(value.replace(/[^,-\d]/g, "").split(/,|-/g).map(e => Number(e)))
                                queryObj.$gte = d
                            } else if (value.indexOf("to:") != -1 || (v.length === 2 && value === v[1])) {
                                d = new Date(value.replace(/[^,-\d]/g, "").split(/,|-/g).map(e => Number(e)))
                                queryObj.$lte = d

                            } else if (v.length == 1 && value.indexOf("month:") != -1) {

                                let date = value.replace(/[^,-\d]/g, "").split(/,|-/g).map(e => Number(e))
                                queryObj.$gte = new Date(date[0], date[1], 1)
                                queryObj.$lt = new Date(date[0], date[1] + 1, 1)
                            } else {
                                let date = value.replace(/[^,-\d]/g, "").split(/,|-/g).map(e => Number(e))
                                queryObj.$gte = new Date(date[0], date[1], date[2])
                                queryObj.$lt = new Date(date[0], date[1], date[2] + 1)
                            }
                            break;
                        case "account":
                        case "category":
                            if (!(value instanceof Schema.Types.ObjectId)) {
                                try {
                                    let x = new RegExp(value, "i")
                                    let n = await Models[q.substring(0, 1).toUpperCase() + q.substring(1)].find({ name: x }).exec()
                                    queryObj.$in.push(n[0]._id)
                                } catch (err) {
                                    res.status(500).send(err)
                                    return

                                }

                            } else {
                                queryObj.$in.push(value)
                            }
                            break;
                        default:
                            queryObj.$in.push(value)
                            break;
                    }
                }


            }
            if (queryObj.$in.length < 1) {
                delete queryObj.$in
            }
            query[q] = queryObj
        }
        req.userData.query = query

    }
    req.userData.query = query
    console.log("query", query)
    next()
}
exports.index = async (req, res) => {
    async.parallel(
        {
            transaction_count(callback) {
                Transaction.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
            },
            transaction_instance_count(callback) {
                transactionInstance.countDocuments({}, callback);
            },
            transaction_instance_available_count(callback) {
                transactionInstance.countDocuments({ status: "Available" }, callback);
            },
            account_count(callback) {
                Account.countDocuments({}, callback);
            },
            category_count(callback) {
                Category.countDocuments({}, callback);
            },
        },
        (err, results) => {
            if (testJSON) {
                res.send(results)
                return
            }
            res.render(results);
        }
    );
};

exports.byQuery = async (req, res, next) => {
    let find = Transaction.find(req.userData.query)

    find.populate("category", "name").populate("account", "name").sort("date").exec((err, docs) => {
        if (docs.length) {

            res.send(docs)
        } else {
            res.status(500).send(err)
        }
    })

}

exports.getByCategory = async (req, res, next) => {
    let params = {
        category: req.params.cat,
        subcategory: req.params.sub,
        subsubcategory: req.params.subsub
    }
    Object.keys(params).forEach(e => {
        if (!params[e]) {
            delete params[e]
        }
    })

    let query = Transaction.find({})

    for (let p in params) {
        let str
        if (params[p] instanceof Schema.Types.ObjectId) {
            str = params[p]
        } else {
            str = new RegExp(params[p], "i")
        }
        query.where(p).equals(str)
    }
    query.populate("category", "name").populate("account", "name").exec((err, docs) => {
        if (docs.length) {
            res.send(docs)
        }
    })

}

// Display list of all transactions.

exports.list = async (req, res) => {
    if (req.userData.group) {
        Transaction.aggregate(groupHandler(req)).exec(function (error, docs) {
            console.log(docs)
            let returnData = { keys: [], total: { count: 0, sum: 0 }, data: {} }
            docs.forEach((e, i) => {
                let name = e._id.name ? e._id.name : e._id
                returnData.data[name] = { ...e }
                returnData.total.count += e.count
                returnData.total.sum += e.amount
                returnData.keys.push(name)
                delete returnData.data[name]._id
            })
            res.send(returnData)

        })
    } else {
        Transaction.find(req.userData.query)
            .populate("account", "name")
            .populate("category", "name")
            .exec(async function (err, docs) {
                if (err) {
                    res.status(400).send(err)
                } else {
                    console.log("docs", docs)
                    docs = await group2(req, docs, req.query.group)

                    res.send(docs);
                }

            })
    }


};
exports.create_post = (req, res) => {
    res.send("NOT IMPLEMENTED: transaction create POST");
};
/*  Inte min kod */
/*
// Display detail page for a specific transaction.
exports.detail = (req, res) => {
    let id = req.params.id

    Transaction.findById(id).populate("category", "name").populate("account", "name").exec((err, docs) => {
        res.render(docs)
    })

};

// Handle transaction create on POST.


// Display transaction delete form on GET.
exports.delete_get = (req, res) => {
    res.send("NOT IMPLEMENTED: transaction delete GET");
};

// Handle transaction delete on POST.
exports.delete_post = (req, res) => {
    res.send("NOT IMPLEMENTED: transaction delete POST");
};

// Display transaction update form on GET.
exports.update_get = (req, res) => {
    res.send("NOT IMPLEMENTED: transaction update GET");
};

// Handle transaction update on POST.
exports.update_post = (req, res) => {
    res.send("NOT IMPLEMENTED: transaction update POST");
};
*/
