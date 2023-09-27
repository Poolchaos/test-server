const mongoose = require('mongoose');

const OrganisationsSchema = require('../schemas/organisations-schema');

var OrganisationsModel = mongoose.model('OrganisationsModel', OrganisationsSchema);

module.exports = OrganisationsModel;