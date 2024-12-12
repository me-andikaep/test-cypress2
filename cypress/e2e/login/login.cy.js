describe('Login Page Tests', () => {
  let passedCount = 0;
  let failedCount = 0;
  let totalCount = 0;
  let totalTestDuration = 0; // To accumulate total test duration
  let testStartTime = 0;  // To store the start time of each test
  const fileLogName = 'test-login-cy.log'
  const apiBaseUrl = Cypress.env('API_BASE_URL')

  console.log('apiBaseUrl', apiBaseUrl)
  
  before(() => {
    cy.task('clearLogFile', fileLogName);

    // Log starting test suite
    cy.logTestStart('========================================\nStarting test suite: Login Page Tests\n========================================', fileLogName);
    cy.clearCookies();
    cy.clearLocalStorage();
  });
  
  beforeEach(function () {
    // cy.clearCookies();
    // cy.clearLocalStorage();
    // ini penting sebelum mulai it
    cy.visit('/login');


    testStartTime = Date.now();  // capture start time in milliseconds before each test
    totalCount += 1; // increment total count

    // log starting the individual test
    cy.logTestStart(`Starting test: ${this.currentTest.title}`);
  });
  
  afterEach(function () {
    const testStatus = this.currentTest.state; // use `this.currentTest` properly
    const testEndTime = Date.now();  // capture end time in milliseconds after each test
    const testDuration = (testEndTime - testStartTime) / 1000; // duration in seconds
    totalTestDuration += testDuration;  // accumulate total duration
  
    if (testStatus === 'passed') passedCount += 1;
    if (testStatus === 'failed') failedCount += 1;
  
    // log test result and duration
    cy.logTestFinish(this.currentTest.title, testStatus, testDuration, fileLogName);
  });
  
  after(() => {
    // generate and log the test summary
    cy.logTestSummary(totalCount, passedCount, failedCount, totalTestDuration, fileLogName);
  });

  

  it('should display all elements on the login page', () => {
    cy.get('.mini-img').should('be.visible'); // logo MileApp
    cy.get('.googleLogin').should('be.visible'); // google login button
    cy.get('#__BVID__19').should('be.visible'); // email form
    cy.get('#__BVID__24').should('be.visible'); // password form
    cy.get('span.cursorPointer.text-primary').should('be.visible') // forgot your password button
      .and('have.css', 'margin-top', '-10px');
    cy.get('#baseButtonId').should('be.visible'); // sign-in button
    cy.get('a.card-link[target="_self"]').should('be.visible') // sign-up now link
      .and('have.css', 'font-size', '13px');
    cy.get('.frame-img img').should('be.visible'); // check if the big image is visible
  });

  it('should display an error for incorrect email', () => {
    cy.get('#__BVID__19').type('andika@mile.appp').should('have.value', 'andika@mile.appp');
    cy.get('#__BVID__24').type('password').should('have.value', 'password');
    cy.get('#baseButtonId').click();

    cy.get('.b-toast-danger') // error toast
      .should('be.visible');
  });

  it('should display an error for incorrect password', () => {
    cy.get('#__BVID__19').type('andika@mile.app').should('have.value', 'andika@mile.app');
    cy.get('#__BVID__24').type('passwordd').should('have.value', 'passwordd');
    cy.get('#baseButtonId').click();

    cy.get('.b-toast-danger') // error toast
      .should('be.visible');
  });

  it('should redirect to landing page / mile.app when clik img mileapp', () => {
    cy.get('.mini-img').should('be.visible'); // logo MileApp
    cy.get('.mini-img').click();

    // jika redirectnya beda base url harus menggunakan cy origin
    cy.origin('https://mile.app/', () => {
      cy.location('hostname').should('eq', 'mile.app');
    });
  });

  it('should redirect to forgot password when clik text forgot password', () => {
    cy.get('span.cursorPointer.text-primary').should('be.visible').and('have.css', 'margin-top', '-10px');
    
    cy.get('span.cursorPointer.text-primary').click();

    cy.url().should('include', '/forgot-password');
  });


  it('should redirect to sign up page when clik text sign up now', () => {
    cy.get('a.card-link[target="_self"]').should('be.visible')
    
    cy.get('a.card-link[target="_self"]').click();

    cy.url().should('include', '/signup');
  });

  it('if form password empty and click login show validation error', () => {
    cy.get('#__BVID__24').should('be.visible'); // email form

    cy.get('#__BVID__24').clear();  // ensure the field is empty
  
    // trigger the validation by clicking the sign-in button
    cy.get('#baseButtonId').click();
    cy.get('.invalid-feedback') 
    .should('be.visible')  
    // .and('contain', 'The email field is required.'); bisa tambahkan 
  
  });

  
  it('if form email empty and click login show validation error', () => {
    cy.get('#__BVID__19').should('be.visible'); // email form

    cy.get('#__BVID__19').clear();  // ensure the field is empty
  
    // trigger the validation by clicking the sign-in button
    cy.get('#baseButtonId').click();
    cy.get('.invalid-feedback') 
    .should('be.visible')  
    // .and('contain', 'The email field is required.'); bisa tambahkan 
  
  });

  it('should toggle password visibility when clicking the eye icon', () => {
    cy.get('#__BVID__24').should('have.attr', 'type', 'password');  // initial type should be 'password'
    cy.get('.input-group-append .bi-eye').click();  // click the eye icon on password
  
    cy.get('#__BVID__24').should('have.attr', 'type', 'text');  // after click, type should be 'text'

    // chack again back to type password
    cy.get('.input-group-append .bi-eye-slash').click();  
    cy.get('#__BVID__24').should('have.attr', 'type', 'password');  // check if type changes back to 'password'
  });

  // it('should check API availability', () => {
  //   cy.request('POST', 'https://apiwebdev.mile.app/api/v3/login', {
  //     email: 'andika@mile.app',
  //     password: 'password',
  //   }).then((response) => {
  //     expect(response.status).to.eq(200);
  //   });
  // });

  it('should login successfully with valid credentials', () => {
    cy.intercept('POST', `${apiBaseUrl}/login`).as('loginRequest');

    cy.get('#__BVID__19').type('andika@mile.app').should('have.value', 'andika@mile.app');
    cy.wait(1000)
    cy.get('#__BVID__24').type('password').should('have.value', 'password');
    cy.wait(1000)
    cy.get('#baseButtonId').click();

    // wait for the login request and assert redirect
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    // assert redirect
    cy.url().should('include', '/tasks/task');

  });


});
