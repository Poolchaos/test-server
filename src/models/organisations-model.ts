import mongoose from 'mongoose';
import OrganisationsSchema from '../schemas/organisations-schema';

var OrganisationsModel = mongoose.model('OrganisationsModel', OrganisationsSchema);

export default OrganisationsModel;