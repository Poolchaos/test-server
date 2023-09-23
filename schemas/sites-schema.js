const mongoose = require('mongoose');
const { Schema } = mongoose;

const SitesSchema = new Schema({
  id: {
    type: String,
    required: [true, 'ID is required']
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  }
}, { collection: 'organisation-projector.displaySitesView' });

module.exports = SitesSchema;