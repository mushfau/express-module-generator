const fs = require('fs');

if (process.argv.length < 3) {
    process.exit(1);
}
const module_name = process.argv[2];


let router =
    "const express = require('express');\n" +
    "const router = express.Router();\n" +
    "const controller = require('../controllers/" + module_name + "')\n" +
    "const validator = require('../validators/" + module_name + "')\n\n" +
    "router.post('/', validator.create, controller.create);\n" +
    "router.get('/', validator.readAll, controller.readAll);\n" +
    "router.get('/:id', validator.readOne, controller.readOne);\n" +
    "router.put('/:id', validator.update, controller.update);\n" +
    "router.delete('/:id', validator.delete, controller.delete);\n\n" +
    "module.exports = router;"

fs.writeFile(`${'./routes/'}/${module_name}${'.js'}`, router, function (err) {
    if (err) throw err;
    console.log('route file created');
});

/*************************************************************************/
const function_names = ["create", "readAll", "readOne", "update", "delete"];

let constoller =
    "const " + toTitleCase(module_name) + " = require('../schemas/" + module_name + "');\n\n";

function_names.map((function_name) => {
    constoller +=
        "exports." + function_name + " = function (req, res) {\n" +
        "    var responseJSON = { success: false, result: [], messages: [], pagination: [] };\n" +
        "    res.status(200).json(responseJSON);\n" +
        "}\n\n"
})

fs.writeFile(`${'./controllers/'}/${module_name}${'.js'}`, constoller, function (err) {
    if (err) throw err;
    console.log('controller file created');
});

/*************************************************************************/

let schema =
    "const mongoose = require('mongoose');\n" +
    "const Schema = mongoose.Schema;\n\n" +
    "const schema = new mongoose.Schema({ name: String }, { timestamps: true });\n\n" +
    "module.exports = mongoose.model('" + toTitleCase(module_name) + "', schema);\n"

fs.writeFile(`${'./schemas/'}/${module_name}${'.js'}`, schema, function (err) {
    if (err) throw err;
    console.log('schema file created');
});


/*************************************************************************/

let validators = "";

function_names.map((function_name) => {
    validators +=
        "exports." + function_name + " = function (req, res, next) {\n" +
        "   let errorResponse = { success: false, result: [], messages: [], pagination: [] };\n\n" +
        "   //req.check('name').notEmpty().withMessage('name should not be empty');\n\n" +
        "   let errors = req.validationErrors();\n\n" +

        "   if (errors) {\n" +
        "       errorResponse.messages = errors;\n" +
        "       res.status(400).send(errorResponse);\n" +
        "   } else {\n" +
        "       next();\n" +
        "   }\n" +
        "}\n\n"
})

fs.writeFile(`${'./validators/'}/${module_name}${'.js'}`, validators, function (err) {
    if (err) throw err;
    console.log('validators file created');
});



function toTitleCase(s) {
    return s.replace(/(^\w|\s+\w){1}/g, function (str) { return str.toUpperCase() });
}
