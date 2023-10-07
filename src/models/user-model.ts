import mongoose from 'mongoose';
import UserSchema from '../schemas/user-schema';

var UserModel = mongoose.model('UserModel', UserSchema);

export default UserModel;