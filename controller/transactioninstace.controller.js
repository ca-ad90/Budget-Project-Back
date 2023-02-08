const BookInstance = require("../models").BookInstance

// Display list of all BookInstances.
exports.list = (req, res) => {
    res.send("NOT IMPLEMENTED: BookInstance list");
};

// Display detail page for a specific BookInstance.
exports.detail = (req, res) => {
    res.send(`NOT IMPLEMENTED: BookInstance detail: ${req.params.id}`);
};

// Display BookInstance create form on GET.
exports.create_get = (req, res) => {
    res.send("NOT IMPLEMENTED: BookInstance create GET");
};

// Handle BookInstance create on POST.
exports.create_post = (req, res) => {
    res.send("NOT IMPLEMENTED: BookInstance create POST");
};

// Display BookInstance delete form on GET.
exports.delete_get = (req, res) => {
    res.send("NOT IMPLEMENTED: BookInstance delete GET");
};

// Handle BookInstance delete on POST.
exports.delete_post = (req, res) => {
    res.send("NOT IMPLEMENTED: BookInstance delete POST");
};

// Display BookInstance update form on GET.
exports.update_get = (req, res) => {
    res.send("NOT IMPLEMENTED: BookInstance update GET");
};

// Handle bookinstance update on POST.
exports.update_post = (req, res) => {
    res.send("NOT IMPLEMENTED: BookInstance update POST");
};
