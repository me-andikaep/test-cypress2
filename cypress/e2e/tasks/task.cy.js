describe('Menu task', () => {
  let passedCount = 0;
  let failedCount = 0;
  let totalCount = 0;
  let totalTestDuration = 0; 
  let testStartTime = 0; 
  const fileLogName = 'task-cy.log'

  before(() => {
    cy.task('clearLogFile', fileLogName);

    // log starting test suite
    cy.logTestStart('========================================\nStarting test suite: task\n========================================', fileLogName);

    cy.clearCookies();
    cy.clearLocalStorage();
    cy.login();
    // cy.visit('/task/task');

  });
  
  // beforeEach(() => {
  //   // cy.loginSession();
  //   // cy.visit('/task/task');
  //   // cy.wait(2000)
  // });

  beforeEach(function () {
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
  
  it('should show menu task', () => {
    cy.url().should('include', '/tasks/task');
  })

  it('should show navbar sidebar and content', () => {
    cy.get('.mainNavbar').should('be.visible');
    cy.get('#sidenav-main').should('be.visible');
    cy.get('.content').should('be.visible');
    
  })


})