import express from 'express';
var router = express.Router();

import { TestRunnerModel } from "./test-runner-model";
import { TestResultModel } from './test-result-model';

import { TestGenerator } from './test-generator';

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
        // test generated successfully
        // Initiate test runner
        let testRunnerModel = await new TestRunnerModel(
          testResultModel.testRunId,
          testId,
          name,
          steps,
          testResultModel.startTime
        );

        testRunnerModel
          .run()
          .then(() => {
            // test run successfully
            res.status(200).json(testResultModel.testResult)
          });

        res.status(200)
      }
    );
    testGenerator.generate();
  } catch(e) {
    console.info(' ::>> error > 1', e);
    res.status(500).json({ e });
  }
});

  
  
router.post('/all', async (req, res) => {
  const { scriptName } = req.body;
  try {
    const createTestCafe = require('testcafe');

    const options = {
        hostname: 'localhost',
        port1:    1337,
        port2:    1338,
    };

    const testcafe = await createTestCafe(options);

    await testcafe
      .createRunner()
      .reporter('json', './report.json')
      .src('./tests/**/*')
      .browsers('chrome')
      .run({
        "screenshots": {
          "path": "./screenshots/",
          "takeOnFails": true
        },
        disableNativeAutomation: true
      });

    await testcafe.close();

    console.log(' ::>> tests are done ');
    var hoteljsonFile = require("./reports/report.json");
    res.json(hoteljsonFile);
  } catch(e) {
    console.info(' ::>> error > ', e);
  }
});

export default router;