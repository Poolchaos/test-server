import mongoose from 'mongoose';
import EnvironmentsSchema from '../schemas/environments-schema';

var EnvironmentsModel = mongoose.model('EnvironmentsModel', EnvironmentsSchema);

export default EnvironmentsModel;