const mongoose = require("mongoose")
const Schema = mongoose.Schema
const category = require("./category.model")
const account = require("./account.model")

let TransactionSchema = new Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    amount: { type: Number, required: true },
    category: {
        type: Schema.Types.ObjectId, ref: "Category"
    },
    subcategory: { type: String, defalut: "undefined" },
    subsubcategory: { type: String, defalut: "undefined" },
    _hide: { type: Boolean, default: false },
    tags: Array,
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

TransactionSchema.virtual("_url").get(function () {
    return `catalog/transaction/${this._id}`
})
TransactionSchema.virtual("_catagory_url").get(function () {
    return `catalog/transaction/category/${this.category.name}`
})
let number = 0
function accountUpdate(next, doc) {
    let accountId = doc.account
    let amount = doc.amount
    account.findOne({ _id: accountId })
        .then(data => {
            let balance
            try {
                balance = Number((Number(data.balance) + Number(amount)).toFixed(2))
                number++
            } catch (err) {
                console.log(
                    `-------------------------------------------------
                                  ERROR!!!!
-------------------------------------------------`)
                console.log("number: " + number)
                console.log(doc)
                console.error(err)
                throw new Error(err)
            }

            account.findByIdAndUpdate(accountId, { balance: balance }, { useFindAndModify: false }).then(data => {
                if (!data) {
                    throw new Error({
                        message: `Cannot update ${req.userData.model} with id:${id}. Document may not been found`
                    })
                } else {
                    next()
                }
            }).catch(err => {
                console.log(err)
                throw new Error({
                    message:
                        err.message || "some Error occurred while updating account balance with ID: " + id
                })
            })
        })
}
async function fieldValidation(doc, b) {
    let cat = await category.findById(doc.category)
    cat = cat.toJSON()
    if (doc.subcategory !== null && doc.subcategory !== "undefined") {
        let subCat = cat.subcategories.map(e => e.name)
        if (!subCat.some(e => e == doc.subcategory)) {
            throw new Error("Invalid subCategory")
        } else {
            if (doc.subsubcategory !== null && doc.subsubcategory !== "undefined") {
                let subCat2 = cat.subcategories.filter(e => e.name == doc.subcategory)[0].subcategories.map(e => e.name)
                if (!subCat2.some(e => e == doc.subsubcategory)) {
                    console.log("---------------------------------------\nERROR\n---------------------------------")
                    console.log(subCat2, doc.subsubcategory)
                    throw new Error("invalid subsubcategory!")
                }
            }
        }
    }
}
TransactionSchema.pre('save', accountUpdate)
TransactionSchema.post("validate", fieldValidation)

module.exports = mongoose.model("Transaction", TransactionSchema)
