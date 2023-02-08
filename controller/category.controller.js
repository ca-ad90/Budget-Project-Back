const Category = require("../models").Category;

// Display list of all Category.
exports.list = (req, res) => {
    res.send("NOT IMPLEMENTED: Category list");
};

// Display detail page for a specific Category.
exports.detail = (req, res) => {
    res.send(`NOT IMPLEMENTED: Category detail: ${req.params.id}`);
};

// Display Category create form on GET.
exports.create_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Category create GET");
};

// Handle Category create on POST.
exports.create_post = (req, res) => {
    res.send("NOT IMPLEMENTED: Category create POST");
};

// Display Category delete form on GET.
exports.delete_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Category delete GET");
};

// Handle Category delete on POST.
exports.delete_post = (req, res) => {
    res.send("NOT IMPLEMENTED: Category delete POST");
};

// Display Category update form on GET.
exports.update_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Category update GET");
};

// Handle Category update on POST.
exports.update_post = (req, res) => {
    res.send("NOT IMPLEMENTED: Category update POST");
};
