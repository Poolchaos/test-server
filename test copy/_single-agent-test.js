import { Selector } from 'testcafe';

fixture('Single Agent').page('https://beta.zailab.com');

test('Sing in with an agent', async t => {
  // Open two browser windows

  // User1 signs in with specific credentials
  await t.typeText('input[placeholder="Email"]', 'tiaan+285@zailab.com');
  await t.typeText('input[placeholder="Password"]', 'Test1234');
  await t.click(Selector('.c-zbutton.c-zbutton--pink.c-zbutton--large.qa-sign-in-button'));

  await t.wait(15000); // Adjust the wait time as needed
});

test('Sign in with an agent and make an outbound call', async t => {
  // Open two browser windows

  // User1 signs in with specific credentials
  await t.typeText('input[placeholder="Email"]', 'tiaan+285@zailab.com');
  await t.typeText('input[placeholder="Password"]', 'Test1234');
  await t.click(Selector('.c-zbutton.c-zbutton--pink.c-zbutton--large.qa-sign-in-button'));

  // await t.eval(() => {
  //   browserStack.qaNotify.allow();
  //   browserStack.qaMicrophone.allow();
  // });
  
  await t.wait(15000); // Adjust the wait time as needed
  
  await t.typeText('iframe input.js-number-input', '0712569431');
  await t.click(Selector('iframe .button.green-button.au-target'));

  await t.wait(20000); // Adjust the wait time as needed

  // Perform other actions to initiate and receive calls
});

