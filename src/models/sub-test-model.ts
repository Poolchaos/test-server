import mongoose from 'mongoose';
import SubTestSchema from '../schemas/sub-test-schema';

var SubTestModel = mongoose.model('SubTestModel', SubTestSchema);

export default SubTestModel;