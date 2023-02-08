const Account = require("../models").Account;

// Display list of all Accounts.
exports.list = (req, res) => {
    res.send("NOT IMPLEMENTED: Account list");
};

// Display detail page for a specific Account.
exports.detail = (req, res) => {
    res.send(`NOT IMPLEMENTED: Account detail: ${req.params.id}`);
};

// Display Account create form on GET.
exports.create_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Account create GET");
};

// Handle Account create on POST.
exports.create_post = (req, res) => {
    res.send("NOT IMPLEMENTED: Account create POST");
};

// Display Account delete form on GET.
exports.delete_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Account delete GET");
};

// Handle Account delete on POST.
exports.delete_post = (req, res) => {
    res.send("NOT IMPLEMENTED: Account delete POST");
};

// Display Account update form on GET.
exports.update_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Account update GET");
};

// Handle Account update on POST.
exports.update_post = (req, res) => {
    res.send("NOT IMPLEMENTED: Account update POST");
};
