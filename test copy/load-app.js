import { Selector } from 'testcafe';
import browserStack from 'testcafe-browser-provider-browserstack';

fixture('WebRTC Calls').page('https://beta.zailab.com');

test('User1 makes a call to User2 and answers', async t => {
  // Open two browser windows

  // User1 signs in with specific credentials
  await t.typeText('input[placeholder="Email"]', 'tiaan+285@zailab.com');
  await t.typeText('input[placeholder="Password"]', 'Test1234');
  await t.click(Selector('.c-zbutton.c-zbutton--pink.c-zbutton--large.qa-sign-in-button'));

  await t.eval(() => {
    browserStack.qaNotify.allow();
    browserStack.qaMicrophone.allow();
  });
  
  await t.wait(5000); // Adjust the wait time as needed
  
  // User2 signs in with specific credentials
  const user1Window = await t.openWindow('https://beta.zailab.com', 'User1 Window');
  // await t.switchToWindow(user1Window);
  await t.typeText('input[placeholder="Email"]', 'tiaan+270@zailab.com');
  await t.typeText('input[placeholder="Password"]', 'Test1234');
  await t.click(Selector('.c-zbutton.c-zbutton--pink.c-zbutton--large.qa-sign-in-button'));

  await t.eval(() => {
    browserStack.qaNotify.allow();
    browserStack.qaMicrophone.allow();
  });

  // Wait for the login process to complete
  await t.wait(20000); // Adjust the wait time as needed

  // Perform other actions to initiate and receive calls
});

// fixture`TestController.openWindow`
//     .page`https://www.example.com/`;

// test('Open the TestCafe website', async t => {
//     await t
//         .openWindow('https://devexpress.github.io/testcafe')
//         .openWindow('./documentation');
// });
