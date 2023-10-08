import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

import TestResultsModel from '../../models/test-results-model';
import { log } from '../../tools/logger';

export class TestResultModel {

  public testRunId = new ObjectId();
  public testResult;
  public startTime = Date.now();

  constructor(
    private testId: string
  ) {
    this.getModel();
  }

  private async getModel(): Promise<void> {
    this.testResult = await TestResultsModel.findOne({ testId: this.testId });
    this.findOrCreateTestResultForTestPlan();
  }
  
  public async findOrCreateTestResultForTestPlan(): Promise<void> {
    if (!this.testResult) {
      this.newInstance();
    } else {
      this.updateInstance();
    }
    await this.testResult.save();
  }

  private newInstance(): void {
    this.testResult = new TestResultsModel({
      testId: this.testId,
      results: [{
        testRunId: this.testRunId,
        ongoing: true,
        startTime: this.startTime
      }]
    });
  }

  private updateInstance(): void {
    const updateObject = {
      $push: {
        results: {
          testRunId: this.testRunId,
          ongoing: true,
          startTime: this.startTime
        },
      },
    };
    
    console.log(' ::>> update test result model 3 ');
    
    TestResultsModel.findOneAndUpdate(
      { testId: this.testId },
      updateObject,
      { new: true }
    )
      .then((updatedTestResult) => {
        if (!updatedTestResult) {
          console.log('Test result not found.');
          return;
        }
      })
      .catch((error) => {
        console.error('Error updating test result:', error);
      });
  }

  public markAsFailed(): void {
    const updateObject = {
      $push: {
        results: {
          ongoing: false,
          testPassed: false
        },
      },
    };

    console.log(' ::>> update test result model 2 ');
    
    TestResultsModel.findOneAndUpdate(
      { testId: this.testId },
      updateObject,
      { new: true }
    )
      .then((updatedTestResult) => {
        if (!updatedTestResult) {
          log('Error: Test result not found.');
          return;
        }
      })
      .catch((error) => {
        console.error('Error updating test result:', error);
      });
  }
}