import mongoose from 'mongoose';
import RequestsSchema from '../schemas/requests-schema';

var RequestsModel = mongoose.model('RequestsModel', RequestsSchema);

export default RequestsModel;