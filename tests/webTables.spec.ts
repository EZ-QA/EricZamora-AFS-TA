import { test, expect } from '@playwright/test';
import { WebTablesPage } from '../pages/WebTablesPage';

test.describe('Web Tables - Edit and Verify Changes are Saved', () => {

    test('TC01 - Verify Web Tables components are displayed', async ({ page }) => {
        //Initialize page object
        const webTables = new WebTablesPage(page);

        //This will navigate to Web Tables page
        await webTables.goto();

        //These assertions ensure the page loaded correctly and core elements are visible
        await expect(webTables.addButton).toBeVisible();
        await expect(webTables.searchBox).toBeVisible();
        await expect(webTables.table).toBeVisible();
    });

    test('TC02 - Edit existing record and validate updated values', async ({ page }) => {
        //Initialize page object
        const webTables = new WebTablesPage(page);

        //This will navigate to Web Tables page
        await webTables.goto();

        //Using getRows() function to retrieve all rows of the table (including header row)
        const rows = await webTables.getRows();

        //Counting rows to ensure data exists in the table
        const count = await rows.count();

        //Assertion to ensure there are row data found. +1 because header is included in the count
        expect(count).toBeGreaterThan(1);

        //Using getFirstRowValues() to extract current values of the first data row for later comparison
        const before = await webTables.getFirstRowValues();
        console.log('Original Record:', before);

        //Using openEditFirstRow() to click the Edit button of the first data row
        await webTables.openEditFirstRow();

        //Generate random data for edit entry
        const updated = {
            firstName: Math.random().toString(36).substring(2, 10),
            lastName: Math.random().toString(36).substring(2, 10),
            email: `${Math.random().toString(36).substring(2, 10)}@test.com`,
            age: (Number(before.age) + 5).toString(),
            salary: (Number(before.salary) + 5000).toString(),
            department: Math.random().toString(36).substring(2, 10)
        };

        //Filling the form with the generated random data using fillEditForm() function
        await webTables.fillEditForm(updated);
        console.log('Updated Record:', updated);

        //Using submitForm() to click the Submit button to save the changes
        await webTables.submitForm();

        //Using getFirstRowValues() to extract updated values of the first data row for comparison
        const after = await webTables.getFirstRowValues();
        console.log('Record after Update:', after);
        
        //Final assertions to compare generated data has been updated correctly in the table
        expect(after.firstName).toBe(updated.firstName);
        expect(after.lastName).toBe(updated.lastName);
        expect(after.email).toBe(updated.email);
        expect(after.age).toBe(updated.age);
        expect(after.salary).toBe(updated.salary);
        expect(after.department).toBe(updated.department);
    });

});