const mongoose = require('mongoose');

const UsersSchema = require('../schemas/sites-schema');

var SitesModel = mongoose.model('SitesModel', UsersSchema);

module.exports = SitesModel;