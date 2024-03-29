import path from 'path';
import { promises as fs } from 'fs';

import TestResultsModel from '../../models/test-results-model';
import { error, log } from '../../tools/logger';

const environment = process.env.NODE_ENV;

export class TestRunnerModel {

  // private static = {
  //   'Google Chrome': 'Chrome',
  //   'Microsoft Edge': 'Edge',
  //   'Mozilla Firefox': 'Firefox'
  // };
  private shareDrivePath = environment === 'development' ? './screenshots/' : './share/';

  constructor(
    private testRunId: any,
    private testId: string,
    private name: string,
    private steps: any,
    private startTime: any
  ) {}

  public async run(): Promise<void> {
    return new Promise(async resolve => {

      // RUN TEST
      try {

        await this.startTestCafe();

        log('Test run complete');
        log('Loading test report...');
 
        const testReportJsonFileContent = await this.getTestReport();

        log('Test report loaded', testReportJsonFileContent);

        console.log(' ::>> update test result model 1 ');

        TestResultsModel
          .findOneAndUpdate({
            testId: this.testId,
            'results.testRunId': this.testRunId,
          }, {
            $set: {
              'results.$[elem]': {
                ...testReportJsonFileContent,
                ongoing: false
              },
            },
          }, {
            arrayFilters: [
              {
                'elem.testRunId': this.testRunId,
              },
            ],
            new: true,
          })
          .then((updatedTestResult) => {
            if (!updatedTestResult) {
              log('Test result not found');
              return;
            }
            resolve();
          })
          .catch((error) => {
            error('Error updating test result:', error);
            console.log(' ::>> get empty report file >>>>> 1 ');
            this.emptyReportFile();
          });

      } catch(e) {
        console.info('Error:', e);
        console.log(' ::>> get empty report file >>>>> 2 ');
        this.emptyReportFile();
      }
    });
  }

  private async getScreenshots(): Promise<void> {
    let errorCounter = 0;
    await Promise.all(this.steps.map(async (step, index) => {
      //   await Promise.all(step.steps.map(async (innerStep, innerIndex) => {
      //     try {
      //       innerStep.image = await fs.readFile(`${this.shareDrivePath}test-${this.testId}-${this.startTime}/screenshot-${index}-${innerIndex}-${innerStep.name}.png`);
      //       innerStep.thumbnail = await fs.readFile(`${this.shareDrivePath}test-${this.testId}-${this.startTime}/thumbnails/screenshot-${index}-${innerIndex}-${innerStep.name}.png`);
      //     } catch(e) {
      //       console.log('Error finding screenshot in group due to', e);
      //     }
      //   }));
      try {
        step.image = `${this.shareDrivePath}${this.startTime}/${this.testId}/screenshot-${index}-${step.name}.png`;
        step.thumbnail = `${this.shareDrivePath}${this.startTime}/${this.testId}/thumbnails/screenshot-${index}-${step.name}.png`;
      } catch(e) {
        console.log('Error finding screenshot. Looking for error screenshot', e);
        try {
          errorCounter++;
          step.error = {
            image: `${this.shareDrivePath}${this.startTime}/${this.testId}/errors/${errorCounter}.png`,
            thumbnail: `${this.shareDrivePath}${this.startTime}/${this.testId}/errors/thumbnails/${errorCounter}.png`
          };
        } catch (e) {
          error('Failed to load image due to ', e);
        }
      }
    }));
  }

  private async startTestCafe(): Promise<void> {
    log('Starting Test Cafe...')
    try {
      const createTestCafe = require('testcafe');

      const options = {
        hostname: 'localhost',
        port1:    1337,
        port2:    1338,
      };
      
      const config = {
        screenshots: {
          path: this.shareDrivePath,
          pathPattern: `${this.startTime}/${this.testId}` + '/${FILE_INDEX}.png',
          takeOnFails: true,
          thumbnails: true
        },
        disableScreenshots: false,
        browserInitTimeout: 180000,
        // pageLoadTimeout: 600000
      };
      
      const testcafe = await createTestCafe(options);

      // disable-dev-shm-usage

      try {
        await testcafe
          .createRunner()
          .reporter('json', './static/reports/report.json')
          .src('./tests/' + this.name + '-test.js')
          .browsers(environment === 'development' ? 'chrome' : 'chromium:headless --disable-dev-shm-usage --no-sandbox')
          .run(config);

        log('Test Cafe Finished, closing connection');

      } catch(e) {
        error('Error: Encountered an issue while running testCafe test');

        TestResultsModel
          .findOneAndUpdate({
            testId: this.testId,
            'results.testRunId': this.testRunId,
          }, {
            $set: {
              'results.$[elem]': {
                ongoing: false,
                error: e
              },
            },
          }, {
            arrayFilters: [
              {
                'elem.testRunId': this.testRunId,
              },
            ],
            new: true,
          })
          .then(() => {
            throw e;
          });

      }
      await testcafe.close();

      log('Test Cafe conenction closed');

    } catch(e) {
      error(e);
    }
  }

  private async getTestReportFileContent(): Promise<any> {
    let testReportJsonFileContent = {}; // Initialize with an empty object
    let attempts = 0;
    const maxAttempts = 20; // Maximum number of retry attempts
    const retryInterval = 1000; // Delay between retry attempts in milliseconds (1 second)
  
    // Add a loop that retries until the condition is met or the maximum attempts are reached
    while (Object.keys(testReportJsonFileContent).length === 0 && attempts < maxAttempts) {
      try {
        let fileContent = await fs.readFile('./static/reports/report.json', 'utf8');

        if (!fileContent) {
          throw new Error('Error generating file content. Check for previous errors. ');
        }

        testReportJsonFileContent = JSON.parse(fileContent);
        console.log(' ::>> testReportJsonFileContent >>>>> ', testReportJsonFileContent);
        
        // Exit the loop if the condition is met
        if (Object.keys(testReportJsonFileContent).length !== 0) {
          break;
        }
        
        // Increment the attempts counter
        attempts++;
        
        // Wait for the specified retry interval before the next attempt
        await new Promise(resolve => setTimeout(resolve, retryInterval));
      } catch (_error) {
        error('Error reading test report JSON file:', _error);
      }
    }
    
    return testReportJsonFileContent;
  };
  
  public async emptyReportFile() {
    const filePath = path.join(__dirname, 'static/reports/report.json');
  
    try {
      const emptyObject = {};
      const jsonString = JSON.stringify(emptyObject, null, 2);
  
      await fs.writeFile(filePath, jsonString, 'utf8');
      log('File has been overwritten with an empty object.');
    } catch (_error) {
      error('Error writing file:', _error);
    }
  }

  private async getTestReport(): Promise<any> {
    try {
      const currentDirectory = __dirname;
      log(`Loading test report on environment ${environment === 'development' ? 'local' : 'dev1'} from directory: ${currentDirectory}`);

      // var testReportJsonFileContent = require('../../../static/reports/report.json');
      var testReportJsonFileContent = await this.getTestReportFileContent();
      log('Test Report ', JSON.stringify(testReportJsonFileContent, function(key, value) {
        // Customize the output for specific keys
        if (key === 'tests' && Array.isArray(value)) {
          // Log the array elements instead of just [Array]
          return value.map((test, index) => ({
            [`Test ${index + 1}`]: test,
          }));
        }
        return value;
      }, 2));

      if (!testReportJsonFileContent) {
        console.log(' ::>> get empty report file >>>>> 3 ');
        this.emptyReportFile();
      }

      // const filePath = path.join(__dirname, '../tests/', this.name + '-test.js');
      // const testFile = await fs.readFile(filePath, 'utf-8');
      testReportJsonFileContent.startTime = this.startTime;
      // testReportJsonFileContent.generatedTest = testFile;

      await this.getScreenshots();

      if (!testReportJsonFileContent.fixtures) {
        testReportJsonFileContent.fixtures = [{
          tests: [{
            steps: this.steps
          }]
        }];
      } else if (!testReportJsonFileContent.fixtures[0].tests) {
        testReportJsonFileContent.fixtures[0].tests = [{
          steps: this.steps
        }]
      } else {
        testReportJsonFileContent.fixtures[0].tests[0].steps = this.steps;
      }

      return testReportJsonFileContent;
    } catch(e) {
      error(e);
      console.log(' ::>> get empty report file >>>>> 4 ');
      this.emptyReportFile();
    }
  }
}
