const mongoose = require("mongoose")
let Transaction = require("./transaction.model.js")
let TransactionInstance = require("./transactioninstance.model.js")
let Account = require("./account.model.js")
let Category = require("./category.model.js")





const Models = {
    Transaction: Transaction,
    TransactionInstance: TransactionInstance,
    Account: Account,
    Category: Category,
}

module.exports = Models
