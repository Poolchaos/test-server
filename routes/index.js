var express = require('express');
var router = express.Router();
const fs = require('fs').promises;
const util = require('util')
var mongoose = require('mongoose');
const TestSuiteModel = require('../models/test-suite-model');
const TestResultsModel = require('../models/test-results-model');
const ObjectId = mongoose.Types.ObjectId;

const writeFile = util.promisify(fs.writeFile);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const uri = "mongodb://127.0.0.1:27017"; // Use the IPv4 loopback address

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

router.post('/testsuites', async (req, res) => {
  try {
    const { name } = req.body;
    const doc = {
      _id: new ObjectId(),
      name: name,
      tests: []
    };
    
    const newTestSuite = new TestSuiteModel(doc);
    newTestSuite.save();
    res.json(doc);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/testsuites', async (req, res) => {
  try {
    const testSuites = await TestSuiteModel.find();
    res.json(testSuites);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/testsuites/:testSuiteId', async (req, res) => {
  try {
    const testSuiteId = req.params.testSuiteId;
    const deletedTestSuite = await TestSuiteModel.findOneAndRemove({ _id: new ObjectId(testSuiteId) });

    if (!deletedTestSuite) {
      return res.status(404).json({ error: 'Test Suite not found' });
    }
    res.json({ message: 'Test Suite deleted successfully' });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/testsuites/:testSuiteId', async (req, res) => {
  try {
    console.log(' ::>> insert new test ');
    const testSuiteId = req.params.testSuiteId;
    const requestData = {
      testId: new ObjectId(),
      ...req.body
    };
    console.log(' ::>> insert new test ', JSON.stringify(requestData));
    
    // Find the test suite by its _id and update the "tests" field
    const updatedTestSuite = await TestSuiteModel.findOneAndUpdate(
      { _id: new ObjectId(testSuiteId) }, // Match by _id
      { $push: { tests: requestData } }, // Add requestData to the "tests" array
      { new: true } // Return the updated document
    );

    if (!updatedTestSuite) {
      return res.status(404).json({ error: 'Test Suite not found' });
    }

    // Respond with the updated test suite
    res.json(updatedTestSuite);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/testsuites/:testSuiteId/test/:testId', async (req, res) => {
  try {
    const testSuiteId = req.params.testSuiteId;
    const testId = req.params.testId;

    const testSuite = await TestSuiteModel.findOne({ _id: new ObjectId(testSuiteId) });

    if (!testSuite) {
      return res.status(404).json({ error: 'Test Suite not found' });
    }

    const specificTest = testSuite.tests.find(test => test.testId.toString() === testId);

    if (!specificTest) {
      return res.status(404).json({ error: 'Test not found in the Test Suite' });
    }

    res.json(specificTest);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/run-test', async (req, res) => {
  const { testId, name, browser, url, errorScreenshot, steps } = req.body;
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
          url,
          startTime
        }]
      });
    } else {
      const updateObject = {
        $push: {
          results: {
            testRunId,
            ongoing: true,
            url,
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
  
        if (errorScreenshot) {
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
        hoteljsonFile.startTime = startTime;





        TestResultsModel.findOneAndUpdate(
          {
            testId,
            'results.testRunId': testRunId,
          },
          {
            $set: {
              'results.$[elem]': {
                ...hoteljsonFile,
                ongoing: false,
                url,
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
      let fileContent = '';
      fileContent += `import { Selector } from 'testcafe';\n\n`;
      fileContent += `fixture('Single Agent').page('${url}');\n\n`;
      fileContent += `test('${name}', async (t) => {\n`;
  
      steps.forEach((step, index) => {
        if (step.name === 'wait') {
          fileContent += `\tawait t.wait(${(step.config.durationInSeconds * 1000)});\n`;
        }
        else if (step.name === 'text') {
          fileContent += `\tawait t.typeText("${step.config.selector}", "${step.config.value}");\n`;
        }
        else if (step.name === 'click') {
          fileContent += `\tawait t.click(Selector('${step.config.target}'));\n`;
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


router.get('/testresults', async (req, res) => {
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

router.get('/testresults/:testId', async (req, res) => {
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

router.post('/run-all-tests', async (req, res) => {
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
