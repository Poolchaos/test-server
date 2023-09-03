import { Selector } from 'testcafe';

fixture('Single Agent').page('https://beta.zailab.com');

test('Sign in with 2 agents', async (t) => {
	await t.wait(10000);
	await t.typeText("input[placeholder='Email']", "tiaan+285@zailab.com");
	await t.typeText("input[placeholder='Password']", "Test1234");
	await t.click(Selector('.c-zbutton.c-zbutton--pink.c-zbutton--large.qa-sign-in-button'));
	await t.wait(5000);
	await t.typeText("input[placeholder='Email']", "tiaan+270@zailab.com");
	await t.typeText("input[placeholder='Password']", "test1234");
	await t.click(Selector('.c-zbutton.c-zbutton--pink.c-zbutton--large.qa-sign-in-button'));
	await t.wait(20000);
})