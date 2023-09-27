import mongoose from 'mongoose';
import UsersSchema from '../schemas/sites-schema';

var SitesModel = mongoose.model('SitesModel', UsersSchema);

export default SitesModel;