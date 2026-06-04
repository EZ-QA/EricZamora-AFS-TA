import { test } from '@playwright/test';
import { SelectMenuPage } from '../pages/SelectMenuPage';

test.describe('Widgets - Select Menu Dropdown Selection (POM)', () => {

    test('TC01 - Verify Select Menu components are displayed', async ({ page }) => {
        //Initialize page object
        const selectMenu = new SelectMenuPage(page);

        //Navigate to Select-menu page
        await selectMenu.navigateTo();

        //These assertions ensure the page loaded correctly and core elements are visible
        await selectMenu.validateSelectMenuComponents();
    });

    test('TC02 - Select values from each dropdown type and verify', async ({ page }) => {
        //Initialize page object
        const selectMenu = new SelectMenuPage(page);

        //Navigate to Select-menu page
        await selectMenu.navigateTo();

        //Grouped dropdown selection and assertion
        await selectMenu.selectGroupedValue('Group 1');
        await selectMenu.assertGroupedValue('Group 1, option 1');

        //Single dropdown selection and assertion
        await selectMenu.selectSingleValue('Mr');
        await selectMenu.assertSingleValue('Mr');

        //Old style dropdown selection and assertion
        await selectMenu.selectOldStyle('Purple', '4');
        await selectMenu.assertOldStyleValue('4');

        //Multi select dropdown and assertion
        await selectMenu.selectMultiReact(['Green', 'Red']);
        await selectMenu.assertMultiSelected(['Green', 'Red']);

        //Old style multi select dropdown and assertion
        await selectMenu.selectCars(['volvo', 'saab']);
        await selectMenu.assertCars(['volvo', 'saab']);
    });

});