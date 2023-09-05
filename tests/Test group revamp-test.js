import { Selector } from 'testcafe';

fixture('Single Agent').page('https://conversations.zailab.com/');

test('Test group revamp', async (t) => {
	await t.wait(20000);
	await t.takeScreenshot({ path: 'test-64f6ef230bb305897b7868d8/screenshot-0-0-wait-1693934048646.png' });
	await t.typeText("input[placeholder='Email']", "meryam+@zailab.com");
	await t.takeScreenshot({ path: 'test-64f6ef230bb305897b7868d8/screenshot-0-1-text-1693934048646.png' });
	await t.typeText("input[placeholder='Password']", "Test1234");
	await t.takeScreenshot({ path: 'test-64f6ef230bb305897b7868d8/screenshot-0-2-text-1693934048646.png' });
	await t.click(Selector('.c-zbutton.c-zbutton--pink.c-zbutton--large.qa-sign-in-button'));
	await t.takeScreenshot({ path: 'test-64f6ef230bb305897b7868d8/screenshot-0-3-Click Element-1693934048646.png' });
	await t.wait(20000);
	await t.takeScreenshot({ path: 'test-64f6ef230bb305897b7868d8/screenshot-0-4-wait-1693934048646.png' });
	await t.expect('.o-page-header__title.is-dashboard').ok();
	await t.takeScreenshot({ path: 'test-64f6ef230bb305897b7868d8/screenshot-0-5-Expect Content-1693934048646.png' });
})