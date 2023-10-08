import express from 'express';
var router = express.Router();

import { TestRunnerModel } from "./test-runner-model";
import { TestResultModel } from './test-result-model';

import { TestGenerator } from './test-generator';
import { log } from '../../tools/logger';

router.post('/', async (req, res) => {
  const { testId, testSuiteId, environment, name, browser, permissions, steps } = req.body;
  try {
    // Save initial test data
    let testResultModel = await new TestResultModel(testId);

    // Start generating tests
    let testGenerator = new TestGenerator(
      environment,
      testId,
      testResultModel.startTime,
      name,
      steps,
      async () => {
        // Success callback
        // - Test generated successfully
        // - Initiate test runner
        let testRunnerModel = await new TestRunnerModel(
          testResultModel.testRunId,
          testId,
          name,
          steps,
          testResultModel.startTime
        );
        log('Start running test...');

        testRunnerModel
          .run()
          .then(() => {
            // test run successfully
            log('Test run complete');
          });
      },
      () => {
        // Fail callback
        testResultModel.markAsFailed();
      }
    );
    testGenerator.generate();
    res.status(200).send();
  } catch(e) {
    console.info(' ::>> error > 1', e);
    res.status(500).json({ e });
  }
});


export default router;