import { Page, expect } from '@playwright/test';
import path from 'path';

/**
 * Using POM for Student Form page to handling all UI interactions
 */
export class StudentFormPage {

  readonly page: Page;
  readonly url = 'https://demoqa.com/automation-practice-form';

  //Initialize page object
  constructor(page: Page) {
    this.page = page;
  }

  //========== Page Navigation ========== 

  //Navigates to Student Form page and verifies page is loaded correctly.
  async goto() {
    await this.page.goto(this.url);

    //Validate navigate correctly on the target URL
    await expect(this.page).toHaveURL(this.url);

    //Validate a page component that confirm page loaded successfully
    await expect(this.page.getByRole('heading', { name: 'Practice Form' }))
      .toBeVisible();
  }

  //========== Form Input ========== 

  //Fill out basic information fields
  async fillBasicInfo(student: any) {
    await this.page.getByPlaceholder('First Name').fill(student.firstName);
    await this.page.getByPlaceholder('Last Name').fill(student.lastName);
    await this.page.getByPlaceholder('name@example.com').fill(student.email);

    //Select gender radio button using visible label text
    await this.page.getByText(student.gender, { exact: true }).click();

    //Fill in mobile number
    await this.page.getByPlaceholder('Mobile Number').fill(student.mobile);
  }

  //Splitting the DOB string before filling the date picker fields
  async selectDOB(dateOfBirth: string) {

    // Split raw DOB string into usable parts
    const [dayMonth, year] = dateOfBirth.split(',');
    const [day, month] = dayMonth.trim().split(' ');

    // Open date picker
    await this.page.getByTestId('dateOfBirthInput').click();

    // Select month, year, day from dropdowns
    await this.page.locator('.react-datepicker__month-select')
      .selectOption(month);
    await this.page.locator('.react-datepicker__year-select')
      .selectOption(year);
    await this.page.locator(
      `.react-datepicker__day--0${day.padStart(2, '0')}:not(.react-datepicker__day--outside-month)`
    ).click();
  }

  //Filling subjects, could be multiple subjects so using loop to handle array input
  async fillSubjects(subjects: string[]) {

    const input = this.page.getByTestId('subjectsInput');

    for (const subject of subjects) {
      await input.click();
      await input.fill(subject);

      //Select dropdown suggestion
      await this.page.getByText(subject, { exact: true }).click();
    }
  }

  //Filling hobbies, could be multiple hobbies so using loop to handle array input
  async selectHobbies(hobbies: string[]) {

    for (const hobby of hobbies) {
      await this.page.getByText(hobby, { exact: true }).click();
    }
  }

  //Upload profile picture from test-data folder
  async uploadPicture(fileName: string) {

    //Declare and merge file path + filename
    const filePath = path.join(__dirname, '../test-data', fileName);

    await this.page.getByTestId('uploadPicture').setInputFiles(filePath);
  }

  //Fill current address field from test-data JSON file
  async fillAddress(address: string) {
    await this.page.getByPlaceholder('Current Address').fill(address);
  }

  //Selecting State and City from dropdowns
  async selectStateCity(state: string, city: string) {

    await this.page.getByTestId('state').click();
    await this.page.getByText(state, { exact: true }).click();

    await this.page.getByTestId('city').click();
    await this.page.getByText(city, { exact: true }).click();
  }

  //Submit the form by clicking the Submit button
  async submit() {
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }

  // ================= ASSERTIONS =================

  //This function verifies the submission modal asserting all the submitted data is displayed correctly.
  async verifySubmission(student: any) {

    const modal = this.page.locator('.modal-content');

    //Asserting successful submission from title of modal
    await expect(this.page.getByTestId('example-modal-sizes-title-lg'))
      .toHaveText('Thanks for submitting the form');

    //Asserting field values from the modal content
    await expect(modal).toContainText(`${student.firstName} ${student.lastName}`);
    await expect(modal).toContainText(student.email);
    await expect(modal).toContainText(student.gender);
    await expect(modal).toContainText(student.mobile);

    //Already following the format of DOB in JSON therefore no splitting or reformat needed for assertion 
    await expect(modal).toContainText(student.dateOfBirth);

    //Subjects are in array format, using loop to assert each
    for (const subject of student.subjects) {
      await expect(modal).toContainText(subject);
    }

    //Hobbies are in array format, using loop to assert each
    for (const hobby of student.hobbies) {
      await expect(modal).toContainText(hobby);
    }

    //Asserting field values from the modal content
    await expect(modal).toContainText(student.address);
    await expect(modal).toContainText(student.state);
    await expect(modal).toContainText(student.city);
  }

  // ================= CLOSE MODAL =================

  //This function will just close the modal in a not conventional way of using Escape button. The close button is not working on the UI.
  async closeModal() {
    await this.page.keyboard.press('Escape');
  }
}