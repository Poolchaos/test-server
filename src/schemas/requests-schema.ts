import mongoose from 'mongoose';
const { Schema } = mongoose;

const RequestsSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: [true, 'No identifier specified']
  },
  name: String,
  url: {
    type: String,
    required: [true, 'URL is required']
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE'], // Include other HTTP methods as needed
    required: [true, 'HTTP method is required']
  },
  queryParams: {
    type: Map, // Use a Map to store key-value pairs of query parameters
    of: String
  },
  body: {
    type: Schema.Types.Mixed, // Use Mixed for flexible JSON body data
    default: null
  },
  headers: {
    type: Map, // Use a Map to store key-value pairs of headers
    of: String
  }
}, { collection: 'api-call-configs' });

export default RequestsSchema;