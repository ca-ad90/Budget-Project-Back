const mongoose = require("mongoose")
const Schema = mongoose.Schema

let AccountSchema = new Schema({
    accountnumber: { type: String, required: true, unique: true, },
    clearingnumber: { type: String, required: true },
    name: { type: String, required: true },
    balance: { type: Number, required: true },

}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

AccountSchema.virtual("url").get(function () {
    return `api/account/${this._id}`
})

module.exports = mongoose.model("Account", AccountSchema)
