const mongoose = require('mongoose');

const EnvironmentsSchema = require('../schemas/environments-schema');

var EnvironmentsModel = mongoose.model('EnvironmentsModel', EnvironmentsSchema);

module.exports = EnvironmentsModel;