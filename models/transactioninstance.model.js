const mongoose = require("mongoose")
const Schema = mongoose.Schema

let TransactionInstanceSchema = new Schema({
    name: String


})

TransactionInstanceSchema.virtual("url").get(function () {
    return `catalog/bookinstance/${this._id}`
})

module.exports = mongoose.model("BookInstance", TransactionInstanceSchema)
