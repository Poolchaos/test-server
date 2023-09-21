const mongoose = require('mongoose');

const RequestsSchema = require('../schemas/requests-schema');

var RequestsModel = mongoose.model('RequestsModel', RequestsSchema);

module.exports = RequestsModel;