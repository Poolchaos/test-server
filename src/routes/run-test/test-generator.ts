import fs, { promises } from 'fs';
import path from 'path';
import util from 'util';

import { log } from '../../tools/logger';

const writeFile = util.promisify(fs.writeFile);

export class TestGenerator {

  constructor(
    private environment,
    private testId,
    private startTime: number,
    private name: string,
    private steps: any,
    private testFileDoneCallback: Function,
    private testFileFailedCallback: Function
  ) {}
  
  public async generate(): Promise<void> {
    // GENERATE TEST
    try {
      let fileContent = '';
      fileContent += `import { Selector } from 'testcafe';\n\n`;
      fileContent += `fixture('${this.name}').page('${this.environment.url}');\n\n`;
      fileContent += `test('${this.name}', async (t) => {\n`;

      fileContent += `\tconst appSelector = Selector('input[placeholder="Email"]');\n`;
      fileContent += `\tawait appSelector.with({ visibilityCheck: true })();\n`;

      const addStep = (step, index) => {
        if (step.type === 'text') {
          if (step.predefined) {
            fileContent += `\tawait t.typeText(\'input[placeholder="${step.config.label}"]\', "${step.config.value}");\n`;
          }
        }

        if (step.type === 'click') {
          if (step.config.value) {
            fileContent += `\tconst buttonSelector = Selector('button').withText('${step.config.value}');\n`;
            fileContent += `\tawait t.click(buttonSelector);\n`;
          }
        }

        if (step.type === 'expect') {
          if (step.config.value) {
            if (step.config.value === 'dashboard') {
              fileContent += `\tconst hudBarSelector = Selector('.o-hud-statusbar__level.o-hud-statusbar__level--two-front.is-border-and-pattern');\n`;
              fileContent += `\tawait hudBarSelector.with({ visibilityCheck: true })();\n`;
            }
          }
        }


        // take screenshots
        fileContent += `\tawait t.takeScreenshot({ path: 'test-${this.testId}/${this.startTime}/screenshot-${index}-${step.name}.png' });\n`;




        // if (step.name === 'wait') {
        //   fileContent += `\tawait t.wait(${(step.config.durationInSeconds * 1000)});\n`;
        // }
        // else if (step.name === 'text') {
        //   fileContent += `\tawait t.typeText("${step.config.selector}", "${step.config.value}");\n`;
        // }
        // else if (step.name === 'Click Element') {
        //   fileContent += `\tawait t.click(Selector('${step.config.selector}'));\n`;
        // }
        // else if (step.name === 'Press Keyboard Key') {
        //   fileContent += `\tawait t.pressKey('${step.config.selector}');\n`;
        // }
        // else if (step.name === 'create') {
        //   fileContent += `\tconst user1Window = await t.openWindow('${step.config.url}', 'Test Window${step.config.identifier}');\n`;
        // }
        // else if (step.name === 'close window') {
        //   fileContent += `\tawait t.closeWindow();\n`;
        // }
        // else if (step.name === 'switch window') {
        //   fileContent += `\tawait t.switchToWindow("/*  todo: add window  */");\n`;
        // }
        // else if (step.name === 'Expect Content') {
        //   fileContent += `\tawait t.expect('${step.config.selector}').ok();\n`;
        // }

        // else if (step.name === 'Trigger an API call') {

        //   fileContent += `\tconst response = t.request.${step.config.method.toLowerCase()}({\n`;
        //   fileContent += `\t\turl: '${step.config.URL}',\n`;
        //   fileContent += `\t\tmethod: '${step.config.method}',\n`;
        //   fileContent += `\t\ttimeout: 30000,\n`;
        //   fileContent += `\t\theaders: ${JSON.stringify(step.config.headers)},\n`;
        //   fileContent += `\t\tbody: ${JSON.stringify(step.config.body)},\n`;
        //   fileContent += `\t\trawResponse: true\n`;
        //   fileContent += `\t});\n`;
    
        //   fileContent += `\tawait t.expect(response.status).eql(202)\n`;

        // }

      }
  
      this.steps.forEach((step, index) => {
        if (step.groupName) {
          step.steps.forEach((innerStep, innerIndex) => {
            addStep(innerStep, index + '-' + innerIndex);
          });
        } else {
          addStep(step, index);
        }
      });
  
      fileContent += `})`;
  
      const currentDirectory = process.cwd();

      // Define the file path relative to the current directory
      const fileName = `${this.name}-test.js`;
      const testPath = path.join(currentDirectory, 'tests');
      const filePath = path.join(testPath, fileName);

      if (!fs.existsSync(testPath)) {
        fs.mkdirSync(testPath);
      }
  
      log('Test suite generated. Writing to file...', fileContent);
      // @ts-ignore
      try {
        await writeFile(filePath, fileContent);
        log('File has been written:', filePath);
        this.testFileDoneCallback();
      } catch (error) {
        console.error('Error writing file:', error);
        this.testFileFailedCallback();
      }
    } catch(e) {
      console.info(' ::>> failed to write test file', e);
      // res.status(500).json({ error: e });
      throw e;
    }
  }
}