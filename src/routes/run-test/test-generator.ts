import { promises as fs } from 'fs';
import util from 'util';

const writeFile = util.promisify(fs.writeFile);

export class TestGenerator {

  constructor(
    private testId,
    private startTime: number,
    private name: string,
    private steps: any,
    private testFileDoneCallback: Function
  ) {}
  
  public generate(): void {
    // GENERATE TEST
    try {
      let url;
      if (this.steps[0].groupName) {
        url = this.steps[0].url;
      }

      let fileContent = '';
      fileContent += `import { Selector } from 'testcafe';\n\n`;
      fileContent += `fixture('Single Agent').page('${url}');\n\n`;
      fileContent += `test('${this.name}', async (t) => {\n`;

      fileContent += `\tconst appSelector = Selector('input[placeholder='Email']');\n`;
      fileContent += `\tawait appSelector.with({ visibilityCheck: true })();\n`;

      const addStep = (step, index) => {
        if (step.type === 'text') {
          
        }




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


        // take screenshots
        // fileContent += `\tawait t.takeScreenshot({ path: 'test-${this.testId}-${this.startTime}/screenshot-${index}-${step.name}.png' });\n`;
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
  
  
      const filePath = `tests/${this.name}-test.js`;
  
      console.info('Attempt writing ');
      // @ts-ignore
      writeFile(filePath, fileContent);
  
      setTimeout(() => {
        console.log('File written successfully:', filePath);
        this.testFileDoneCallback()
      }, 1000);
    } catch(e) {
      console.info(' ::>> failed to write test file', e);
      // res.status(500).json({ error: e });
      throw e;
    }
  }
}