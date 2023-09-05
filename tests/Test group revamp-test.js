import { Selector } from 'testcafe';

fixture('Single Agent').page('https://conversations.zailab.com/');

test('Test group revamp', async (t) => {
	await t.wait(20000);
	await t.typeText("input[placeholder='Email']", "meryam+@zailab.com");
	await t.typeText("input[placeholder='Password']", "Test1234");
	await t.click(Selector('.c-zbutton.c-zbutton--pink.c-zbutton--large.qa-sign-in-button'));
	await t.wait(20000);
	await t.expect('.o-page-header__title.is-dashboard').ok();
})