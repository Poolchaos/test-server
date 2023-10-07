import mongoose from 'mongoose';

//Define a schema
var Schema = mongoose.Schema;

const TestResultSchema = new Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Test ID is required'],
  },
  results: [
    {
      testRunId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      url: {
        type: String
      }, 
      ongoing: {
        type: Boolean,
        default: true
      }, 
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      },
      userAgents: [
        {
          type: String,
        },
      ],
      passed: {
        type: Number,
      },
      total: {
        type: Number,
      },
      skipped: {
        type: Number,
      },
      fixtures: [
        {
          type: mongoose.Schema.Types.Mixed,
        },
      ]
    },
  ],
}, { collection : 'test-results' });

export default TestResultSchema;