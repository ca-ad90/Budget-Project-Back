const mongoose = require("mongoose")
const Schema = mongoose.Schema
let CategorySchema = new Schema({

    name: { type: String, default: "undefined" },
    type: { type: String, default: "undefined" },
    subcategories: [{
        name: { type: String, default: "undefined" },
        subcategories: { type: Array, default: ["undefined"] }
    }],

}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})
CategorySchema.virtual("url").get(function () {
    return `catalog/category/${this._id}`
})
CategorySchema.virtual("subcategories_names").get(function () {
    try {
        if (this.subcategories && this.subcategories.length) {
            return this.subcategories.map(e => e.name)
        }
    } catch (err) {
        debugger
    }
})
module.exports = mongoose.model("Category", CategorySchema)
