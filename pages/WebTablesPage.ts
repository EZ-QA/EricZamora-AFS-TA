import { Page, expect } from '@playwright/test';

/**
 * Using POM for Web Tables page to handling all UI interactions
 */
export class WebTablesPage {

    readonly url = 'https://demoqa.com/webtables';
    constructor(private page: Page) { }

    //========== Element Locators mainly for load assertions only ========== 

    //Web table element mainly for assertions - only for checking components of WebTables page
    readonly table = this.page.getByRole('table');

    //Button used to add a new record to the table - only for checking components of WebTables page
    readonly addButton = this.page.getByRole('button', { name: 'Add' });

    //Search input for filtering table records - only for checking components of WebTables page
    readonly searchBox = this.page.getByPlaceholder('Type to search');

    //========== Page Navigation ========== 

    //Navigates to Web Tables page and verifies page is loaded correctly.
    async goto() {
        await this.page.goto(this.url);

        //Validate navigate correctly on the target URL
        await expect(this.page).toHaveURL(this.url);

        //Validate a page component that confirm page loaded successfully
        await expect(
            this.page.getByRole('heading', { name: 'Web Tables' })
        ).toBeVisible();
    }

    //========== Table Handling ==========

    //Used for counting rows of the WebTables (include header row)
    async getRows() {
        return this.page.getByRole('row');
    }

    //This will directly returns the first row data of the table (exclude header row)
    async getFirstDataRow() {
        const rows = await this.getRows();
        return rows.nth(1);
    }

    //This will directly returns the values of the first row data of the table in an object format (exclude header row)
    async getFirstRowValues() {
        const row = await this.getFirstDataRow();
        const cells = row.getByRole('cell');

        return {
            firstName: await cells.nth(0).textContent(),
            lastName: await cells.nth(1).textContent(),
            age: await cells.nth(2).textContent(),
            email: await cells.nth(3).textContent(),
            salary: await cells.nth(4).textContent(),
            department: await cells.nth(5).textContent(),
        };
    }

    //========== Functions - Edit ==========

    //Will click the Edit button of the first row data of the table (exclude header row)
    async openEditFirstRow() {
        const row = await this.getFirstDataRow();
        await row.getByTitle('Edit').click();
    }

    //Will fill the form with the provided data
    async fillEditForm(data: {
        firstName: string;
        lastName: string;
        email: string;
        age: string;
        salary: string;
        department: string;
    }) {
        await this.page.getByPlaceholder('First Name').fill(data.firstName);
        await this.page.getByPlaceholder('Last Name').fill(data.lastName);
        await this.page.getByPlaceholder('name@example.com').fill(data.email);
        await this.page.getByPlaceholder('Age').fill(data.age);
        await this.page.getByPlaceholder('Salary').fill(data.salary);
        await this.page.getByPlaceholder('Department').fill(data.department);
    }

    //For clicking Submit button to save the changes after filling the form
    async submitForm() {
        await this.page.getByRole('button', { name: 'Submit' }).click();
    }
}