import path from 'path';
import { promises as fs } from 'fs';

import TestResultsModel from '../../models/test-results-model';
import { log } from '../../tools/logger';

export class TestRunnerModel {

  private static = {
    'Google Chrome': 'Chrome',
    'Microsoft Edge': 'Edge',
    'Mozilla Firefox': 'Firefox'
  };

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

        console.log(' ::>> tests are done ');
        // await new Promise(resolve => setTimeout(resolve, 10000));
 
        log('Test Runner Model | Loading third party dependency | cookie-parser loaded ');
        const hoteljsonFile = await this.getTestReport();
        console.log(' ::>> hoteljsonFile    hoteljsonFile   >>>> ', hoteljsonFile);

        TestResultsModel
          .findOneAndUpdate({
            testId: this.testId,
            'results.testRunId': this.testRunId,
          }, {
            $set: {
              'results.$[elem]': {
                ...hoteljsonFile,
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
              console.log('Test result not found.');
              return;
            }
            resolve();
          })
          .catch((error) => {
            console.error('Error updating test result:', error);
          });

      } catch(e) {
        console.info(' ::>> error > 2', e);
      }
    });
  }

  private async getScreenshots(): Promise<void> {
    await Promise.all(this.steps.map(async (step, index) => {
      if (step.groupName) {
        await Promise.all(step.steps.map(async (innerStep, innerIndex) => {
          try {
            innerStep.image = await fs.readFile(`./screenshots/test-${this.testId}-${this.startTime}/screenshot-${index}-${innerIndex}-${innerStep.name}.png`);
            innerStep.thumbnail = await fs.readFile(`./screenshots/test-${this.testId}-${this.startTime}/thumbnails/screenshot-${index}-${innerIndex}-${innerStep.name}.png`);
          } catch(e) {
            innerStep.thumbnail = await fs.readFile('./static/no-image.jpg');
          }
        }));
      } else {
        try {
          step.image = await fs.readFile(`./screenshots/test-${this.testId}-${this.startTime}/screenshot-${index}-${step.name}.png`);
          step.thumbnail = await fs.readFile(`./screenshots/test-${this.testId}-${this.startTime}/thumbnails/screenshot-${index}-${step.name}.png`);
        } catch(e) {
          // @ts-ignore
          innerStep.thumbnail = await fs.readFile('./static/no-image.jpg');
        }
      }
    }));
  }

  private async startTestCafe(): Promise<void> {
    try {
      const createTestCafe = require('testcafe');

      const options = {
        hostname: 'localhost',
        port1:    1337,
        port2:    1338,
      };
      
      const config = {
        disableNativeAutomation: true,
        screenshots: {
          path: "./screenshots/",
          takeOnFails: true
        }
      };
      
      const testcafe = await createTestCafe(options);
      const runner = testcafe.createRunner();

      runner.browsers('chromium:headless');

      await runner
        .reporter('json', './static/reports/report.json')
        .src('./tests/' + this.name + '-test.js')
        .run(config);

      await testcafe.close();


    } catch(e) {
      console.log(e);
    }
  }

  private async getTestReport(): Promise<any> {
    try {
      var hoteljsonFile = require('../../../static/reports/report.json');
      console.log(' ::>> hoteljsonFile >>>>> ', hoteljsonFile);

      const filePath = path.join(__dirname, '../tests/', this.name + '-test.js');
      // const testFile = await fs.readFile(filePath, 'utf-8');
      hoteljsonFile.startTime = this.startTime;
      // hoteljsonFile.generatedTest = testFile;

      // await this.getScreenshots();

      if (!hoteljsonFile.fixtures) {
        hoteljsonFile.fixtures = [{
          tests: [{
            steps: this.steps
          }]
        }];
      } else if (!hoteljsonFile.fixtures[0].tests) {
        hoteljsonFile.fixtures[0].tests = [{
          steps: this.steps
        }]
      } else {
        hoteljsonFile.fixtures[0].tests[0].steps = this.steps;
      }

      return hoteljsonFile;
    } catch(e) {
      console.log(e);
    }
  }
}
