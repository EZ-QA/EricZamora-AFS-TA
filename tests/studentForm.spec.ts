import { test, expect } from '@playwright/test';
import students from '../test-data/students.json';
import { StudentFormPage } from '../pages/StudentFormPage';

test.describe('Forms - Student Form Multiple Data Set Submission', () => {

    test('TC01 - Verify Student Registration Form components are displayed', async ({ page }) => {
        //Initialize page object
        const form = new StudentFormPage(page);

        //Navigate to Student Form page
        await form.goto();

        //These assertions ensure the page loaded correctly and core elements are visible
        await expect(page.getByPlaceholder('First Name')).toBeVisible();
        await expect(page.getByPlaceholder('Last Name')).toBeVisible();
        await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
        await expect(page.getByTestId('gender-radio-1')).toBeVisible(); // Gender Radio button for Male
        await expect(page.getByTestId('gender-radio-2')).toBeVisible(); // Gender Radio button for Female
        await expect(page.getByTestId('gender-radio-3')).toBeVisible(); // Gender Radio button for Other
        await expect(page.getByPlaceholder('Mobile Number')).toBeVisible();
        await expect(page.getByLabel('Sports')).toBeVisible(); // Hobbies checkbox for Sports
        await expect(page.getByLabel('Reading')).toBeVisible(); // Hobbies checkbox for Reading
        await expect(page.getByLabel('Music')).toBeVisible(); // Hobbies checkbox for Music
        await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    });

    test('TC02 - Submit Student Form using multiple data sets', async ({ page }) => {
        //Initialize page object
        const form = new StudentFormPage(page);

        for (const student of students) {

            //Navigate to Student Form page
            await form.goto();

            //Fill out the form with data from JSON file using page object functions
            await form.fillBasicInfo(student);
            await form.selectDOB(student.dateOfBirth);
            await form.fillSubjects(student.subjects);
            await form.selectHobbies(student.hobbies);
            await form.uploadPicture(student.picture);
            await form.fillAddress(student.address);
            await form.selectStateCity(student.state, student.city);

            //Submit the form
            await form.submit();

            //Assert that the submitted data matches the input data in the confirmation modal. Multiple assertions included inside
            await form.verifySubmission(student);

            //Close the confirmation modal screen using "Esc" as the "Close" button has no function event to close it.
            await form.closeModal();
        }
    });

});