import mongoose from 'mongoose';
import AuthSchema from '../schemas/auth-schema';

var AuthModel = mongoose.model('AuthModel', AuthSchema);

export default AuthModel;