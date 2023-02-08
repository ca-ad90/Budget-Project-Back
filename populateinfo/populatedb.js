#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var Models = require("../models")
let url = require("../db/db.config.js")
const fs = require('fs');

var mongoose = require('mongoose');
const { Console } = require("console");
var mongoDB = url.url
console.log("url:" + mongoDB)
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', () => {
    console.log("SUCCESS! Connected to DB")
    populateDB()

});
var accounts = []
var categories = []
var transactions = []
var bookinstance = []

async function clearCollection(modelName) {
    (
        console.log("start clearCollection: " + modelName))
    return new Promise(res => {
        let M = Models[modelName]
        M.deleteMany({})
            .then(data => {
                console.log(`${modelName}: ${data.deletedCount} docs were deleted successfully!`)
                res({
                    status: 200,
                    msg:
                        `${data.deletedCount} ${modelName}s were deleted successfully!`
                })
            })
    })
}
async function clearDB() {
    console.log("START clearDB")
    let p = []
    for (let n in Models) {
        p.push(clearCollection(n))
    }
    return Promise.all(p)
}
async function getData() {
    console.log("\nGet Data Start\n")
    return new Promise((res) => {
        new Promise(res => {
            fs.readFile("./kategorier.json", (err, data) => {
                res(JSON.parse(data))
            })
        }).then(data => {
            console.log("      kategori file read")
            let categories = []
            for (let t in data) {
                for (let cat in data[t]) {
                    let name = cat.trim()
                    let type = t
                    let subcat = []
                    for (let sub in data[t][cat]) {
                        let subObj = {
                            name: sub,
                            subcategories: data[t][cat][sub].map(e => ({ name: e }))
                        }
                        subcat.push(subObj)
                    }
                    categories.push({
                        name: name,
                        type: type,
                        subcategories: subcat
                    })
                }
            }
            console.log("catData end")
            res(categories)
        })
    })
        .then(catData => {
            console.log("   catData formated")
            return new Promise((res) => {
                let accounts = [], transactions = []
                new Promise(res => {
                    fs.readFile("./kontoinfo.json", (err, data) => {
                        res({ catData: catData, data: JSON.parse(data) })
                    })
                }).then(resData => {
                    console.log("   infoData read")
                    let catData = resData.catData
                    let data = resData.data

                    let getCat = () => {
                        let out = {}
                        let n = (max) => Math.floor((Math.random() * (max)))
                        let catName = catData[n(catData.length)].name
                        out.category = catName

                        let currentCat = catData.filter(e => e.name == catName)
                        if (currentCat.length < 1) {
                            out.subcategory = "undefined"
                            out.subsubcategory = "undefined"
                            return out
                        }

                        let subData = currentCat[0].subcategories
                        let subName = subData[n(subData.length)].name
                        out.subcategory = subName

                        let currentSub = subData.filter(e => e == subName)
                        if (currentSub.length < 1) {
                            out.subsubcategory = "undefined"
                            return out
                        }
                        let subSubData = currentSub[0].subcategories
                        let subSubName = subSubData[n(subSubData.length)]

                        out.subsubcategory = subSubName

                        return out
                    }

                    for (let konto of data) {
                        konto.namn = konto.namn.toLowerCase();
                        konto.transactions.map((e) => {
                            e.konto = konto.namn.toLowerCase();
                            return e;
                        });

                        for (let trans of konto.transactions) {
                            let newTransactionObj = {
                                name: trans.text,
                                date: trans.datum,
                                account: trans.konto,
                                amount: trans.belopp,
                                ...getCat()
                            }
                            transactions.push(newTransactionObj)
                        }

                        accounts.push({
                            accountnumber: konto.nummer,
                            clearingnumber: konto.clearing,
                            name: konto.namn,
                            balance: konto.saldo,
                        });
                    }
                    res({
                        Account: accounts,
                        Transaction: [].concat(...transactions),
                        Category: resData.catData
                    })
                });
            })
        })
}
async function saveCollection(modelName, data) {
    console.log("   start save collection: " + modelName)
    let p = []
    let model = Models[modelName]
    for (let d of data) {
        let doc = new model(d)
        p.push(doc.save(doc))
    }

    return Promise.all(p)
}

async function saveDB(data) {
    console.log("\nSave data start \n")
    let p = [
        saveCollection("Category", data.Category),
        saveCollection("Account", data.Account)
    ]
    return Promise.all(p).then(result => {
        let categories = result[0].map(e => e.toJSON())
        let accounts = result[1].map(e => e.toJSON())
        data.Transaction.map(e => {
            let a_id = accounts[accounts.findIndex(a => a.name == e.account)]._id
            let c_id = categories[categories.findIndex(c => c.name.toLowerCase() == e.category.toLowerCase())]._id
            e.account = a_id
            e.category = c_id
            return e
        })
        saveCollection("Transaction", data.Transaction).then(transactions => {
            transactions = transactions.length ? transactions.map(e => e.toJSON()) : transactions.toJSON()
            console.log("EVERYTHING ADDED\n", {
                accounts: accounts,
                categories: categories,
                transactions: transactions,
            })
        })

    })
}

function populateDB() {
    Promise.all([getData(), clearDB()]).then(([newData, clearData]) => {
        saveDB(newData)
    })
}
