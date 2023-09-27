const mongoose = require('mongoose');

const AuthSchema = require('../schemas/auth-schema');

var AuthModel = mongoose.model('AuthModel', AuthSchema);

module.exports = AuthModel;