import { Page, expect } from '@playwright/test';

/**
 * Using POM for Select Menu page to handling all UI interactions
 */
export class SelectMenuPage {
    readonly page: Page;
    readonly url = 'https://demoqa.com/select-menu';

    constructor(page: Page) {
        this.page = page;
    }

    //========== Page Navigation ========== 

    //Navigates to Select Menu page and verifies page is loaded correctly.
    async navigateTo() {
        await this.page.goto(this.url);

        //Validate navigate correctly on the target URL
        await expect(this.page).toHaveURL(this.url);

        //Validate a page component that confirm page loaded successfully
        await expect(
            this.page.getByRole('heading', { name: 'Select Menu' })
        ).toBeVisible();
    }

    //========== Component Assertions ========== 

    async validateSelectMenuComponents() {
        //Grouped dropdown check for visibility and interaction
        await expect(this.page.getByText('Select Value')).toBeVisible();
        await expect(this.page.getByText('Select Value')).not.toBeDisabled();

        //Single dropdown check for visibility and interaction
        await expect(this.page.getByText('Select One')).toBeVisible();
        await expect(this.page.getByText('Select One')).not.toBeDisabled();

        //Old Style Single dropdown check for visibility, interaction, and available options
        const oldSelect = this.page.getByTestId('oldSelectMenu');
        await expect(oldSelect).toBeVisible();
        await expect(oldSelect).toBeEnabled();
        await expect(oldSelect.locator('option')).toHaveCount(11);

        //Multi select dropdown check for visibility
        await expect(this.page.getByText('Select...')).toBeVisible();

        //Old style multi select dropdown check for visibility, interaction, and available options
        const cars = this.page.getByTestId('cars');
        await expect(cars).toBeVisible();
        await expect(cars).toBeEnabled();
        await expect(cars.locator('option')).toHaveCount(4);
    }

    //========== Dropdown Interactions ========== 

    //Selecting option 1 from the Group that was set
    async selectGroupedValue(value: string) {
        //Open selected grouped dropdown
        const input = this.page.getByTestId('react-select-2-input');
        await input.click();
        await input.fill(value);

        //Concatenating option 1 to select the corresponding Group+Option combination
        await this.page.getByText(`${value}, option 1`, { exact: true }).click();
    }

    //Asserting if data has been selected successfully
    async assertGroupedValue(expected: string) {
        await expect(
            this.page.getByText(expected, { exact: true })
        ).toBeVisible();
    }

    //Selecting base on data that was set
    async selectSingleValue(value: string) {
        //Open single select dropdown
        const input = this.page.getByTestId('react-select-3-input');
        await input.click();
        await input.fill(value);

        //Concatenating data to "." to select the corresponding information
        await this.page.getByText(`${value}.`, { exact: true }).click();
    }

    //Asserting if data has been selected successfully
    async assertSingleValue(expected: string) {
        await expect(
            this.page.getByText(`${expected}.`, { exact: true })
        ).toBeVisible();
    }

    //Selecting base on data that was set
    async selectOldStyle(value: string, expectedValue: string) {
        //Select value in native dropdown
        const oldSelect = this.page.getByTestId('oldSelectMenu');
        await oldSelect.selectOption(value);

        //Ensuring option has been selected
        await expect(oldSelect).toHaveValue(expectedValue);
    }

    //Asserting if data has been selected successfully
    async assertOldStyleValue(expectedValue: string) {
        const oldSelect = this.page.getByTestId('oldSelectMenu');
        await expect(oldSelect).toHaveValue(expectedValue);
    }

    //Selecting base on multiple items set
    async selectMultiReact(values: string[]) {
        //Open multi select dropdown
        const multiSelect = this.page.getByTestId('react-select-4-input');

        //Using loop to select each declared data
        for (const value of values) {
            await multiSelect.click();

            //Precheck to make sure option shows before selecting
            const listbox = this.page.getByTestId('react-select-4-listbox');
            await expect(listbox).toBeVisible();

            //Select option
            await listbox.getByRole('option', { name: value }).click();
        }
    }

    //Asserting if multiple data has been selected successfully
    async assertMultiSelected(values: string[]) {

        const selectedChips = this.page.locator('[class*="multiValue"]');
        await expect(selectedChips).toHaveCount(values.length);

        //Using loop to check and compare the selection against expected
        for (let i = 0; i < values.length; i++) {
            await expect(selectedChips.nth(i)).toContainText(values[i]);
        }
    }

    //Selecting base on multiple items set
    async selectCars(values: string[]) {
        // Select multiple values in native multi-select
        const cars = this.page.getByTestId('cars');
        await cars.selectOption(values);
    }
    
    //Asserting if multiple data has been selected successfully
    async assertCars(values: string[]) {
        // Validate selected values in native multi-select
        const cars = this.page.getByTestId('cars');
        await expect(cars).toHaveValues(values);
    }
}