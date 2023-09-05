var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const path = require('path');
const ObjectId = mongoose.Types.ObjectId;

const fs = require('fs').promises;
const util = require('util')
const writeFile = util.promisify(fs.writeFile);

const TestResultsModel = require('../models/test-results-model');

router.post('/', async (req, res) => {
  const { testId, testSuiteId, name, browser, permissions, steps } = req.body;
  const testRunId = new ObjectId();
  const startTime = Date.now();

  try {
    // Find existing document by testId
    let testResult = await TestResultsModel.findOne({ testId });

    if (!testResult) {
      // Create a new document if it doesn't exist
      testResult = new TestResultsModel({
        testId,
        results: [{
          testRunId,
          ongoing: true,
          startTime
        }]
      });
    } else {
      const updateObject = {
        $push: {
          results: {
            testRunId,
            ongoing: true,
            startTime
          },
        },
      };
      
      // Use findOneAndUpdate to push the new object into the results array
      TestResultsModel.findOneAndUpdate(
        { testId },
        updateObject,
        { new: true } // Return the updated document
      )
        .then((updatedTestResult) => {
          if (!updatedTestResult) {
            console.log('Test result not found.');
            return;
          }
      
          console.log('Updated test result:', updatedTestResult);
        })
        .catch((error) => {
          console.error('Error updating test result:', error);
        });
    }

    await testResult.save();


    async function runTest() {
      // RUN TEST
      try {
        const createTestCafe = require('testcafe');
  
        const options = {
            hostname: 'localhost',
            port1:    1337,
            port2:    1338,
        };
  
        const testcafe = await createTestCafe(options);
  
        let config = {
          disableNativeAutomation: true
        };
  
        if (permissions.errorScreenshot) {
          config.screenshots = {
            path: "./screenshots/",
            takeOnFails: true
          };
        }
  
        const browserMap = {
          'Google Chrome': 'Chrome',
          'Microsoft Edge': 'Edge',
          'Mozilla Firefox': 'Firefox'
        };
  
        await testcafe
          .createRunner()
          .reporter('json', './reports/' + name + '-report.json')
          .src('./tests/' + name + '-test.js')
          .browsers(browser ? browserMap[browser] : 'Chrome')
          .run(config);
  
        await testcafe.close();
  
        console.log(' ::>> tests are done ');
        var hoteljsonFile = require('../reports/' + name + '-report.json');

        const filePath = path.join(__dirname, '../tests/', name + '-test.js');
        const testFile = await fs.readFile(filePath, 'utf-8');
        hoteljsonFile.startTime = startTime;
        hoteljsonFile.generatedTest = testFile;

        if (permissions.stepScreenshot) {
          await Promise.all(steps.map(async (step, index) => {
            if (step.groupName) {
              await Promise.all(step.steps.map(async (innerStep, innerIndex) => {
                innerStep.image = await fs.readFile(`./screenshots/test-${testId}/screenshot-${index}-${innerIndex}-${innerStep.name}-${startTime}.png`);
                innerStep.thumbnail = await fs.readFile(`./screenshots/test-${testId}/thumbnails/screenshot-${index}-${innerIndex}-${innerStep.name}-${startTime}.png`);
              }));
            } else {
              step.image = await fs.readFile(`./screenshots/test-${testId}/screenshot-${index}-${step.name}-${startTime}.png`);
              step.thumbnail = await fs.readFile(`./screenshots/test-${testId}/thumbnails/screenshot-${index}-${step.name}-${startTime}.png`);
            }
          }));
          hoteljsonFile.fixtures[0].tests[0].steps = steps;
        }

        TestResultsModel.findOneAndUpdate(
          {
            testId,
            'results.testRunId': testRunId,
          },
          {
            $set: {
              'results.$[elem]': {
                ...hoteljsonFile,
                ongoing: false
              },
            },
          },
          {
            arrayFilters: [
              {
                'elem.testRunId': testRunId,
              },
            ],
            new: true,
          }
        )
          .then((updatedTestResult) => {
            if (!updatedTestResult) {
              console.log('Test result not found.');
              return;
            }
            res.json(testResult);
            console.log('Updated test result:', updatedTestResult);
          })
          .catch((error) => {
            console.error('Error updating test result:', error);
          });
  
      } catch(e) {
        console.info(' ::>> error > ', e);
      }
    }
  
    // GENERATE TEST
    try {
      let url;
      if (steps[0].groupName) {
        url = steps[0].url;
      }

      console.log(' ::>> url >>>> ', url);

      let fileContent = '';
      fileContent += `import { Selector } from 'testcafe';\n\n`;
      fileContent += `fixture('Single Agent').page('${url}');\n\n`;
      fileContent += `test('${name}', async (t) => {\n`;

      const addStep = function(step, index) {
        if (step.name === 'wait') {
          fileContent += `\tawait t.wait(${(step.config.durationInSeconds * 1000)});\n`;
        }
        else if (step.name === 'text') {
          fileContent += `\tawait t.typeText("${step.config.selector}", "${step.config.value}");\n`;
        }
        else if (step.name === 'Click Element') {
          fileContent += `\tawait t.click(Selector('${step.config.selector}'));\n`;
        }
        else if (step.name === 'create') {
          fileContent += `\tconst user1Window = await t.openWindow('${step.config.url}', 'Test Window${step.config.identifier}');\n`;
        }
        else if (step.name === 'close window') {
          fileContent += `\tawait t.closeWindow();\n`;
        }
        else if (step.name === 'switch window') {
          fileContent += `\tawait t.switchToWindow("/*  todo: add window  */");\n`;
        }
        else if (step.name === 'Expect Content') {
          fileContent += `\tawait t.expect('${step.config.selector}').ok();\n`;
        }

        if (permissions.stepScreenshot) {
          fileContent += `\tawait t.takeScreenshot({ path: 'test-${testId}/screenshot-${index}-${step.name}-${startTime}.png' });\n`;
        }
      }
  
      steps.forEach((step, index) => {
        if (step.groupName) {
          step.steps.forEach((innerStep, innerIndex) => {
            addStep(innerStep, index + '-' + innerIndex);
          });
        } else {
          addStep(step, index);
        }
      });
  
      fileContent += `})`;
  
  
      const filePath = `tests/${name}-test.js`;
  
      console.info('Attempt writing ');
  
      writeFile(filePath, fileContent);
  
      setTimeout(() => {
        console.log('File written successfully:', filePath);
        // res.status(200).json({]});
        runTest()
      }, 1000);
    } catch(e) {
      console.info(' ::>> failed to write test file', e);
      
      // todo: write error to test
      res.status(500).json({ error: e });
    }

  } catch(e) {
    console.error(e);
    res.status(500).json({ e: 'Internal Server Error' });
  }
});

  

router.get('/results', async (req, res) => {
    const testId = req.query.testId;
    console.info(' ::>> testId >>> ' + testId);
    try {
      const testResults = await TestResultsModel.findOne({ testId });
      res.json(testResults);
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.get('/results/:testId', async (req, res) => {
    const testId = req.params.testId;
    const testResultId = req.query.testResultId;
    console.info(' ::>> testId >>> ' + testId);
    try {
      const testResults = await TestResultsModel.findOne({ testId });
      const specificTest = testResults.results.find(result => result._id.toString() === testResultId);
      res.json(specificTest);
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: 'Internal Server Error' });
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
      var hoteljsonFile = require("../report.json");
      res.json(hoteljsonFile);
    } catch(e) {
      console.info(' ::>> error > ', e);
    }
  });

module.exports = router;