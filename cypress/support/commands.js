// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/*
===================
  this is logging function 
===================
*/

const fs = require('fs');
const path = require('path');
const apiBaseUrl = Cypress.env('API_BASE_URL')

Cypress.Commands.add('logTestStart', function (message, fileName) {


  cy.task('logToFile', {
    filename: fileName,
    message,
  });
});

Cypress.Commands.add('logTestFinish', function (testName, testStatus, duration, fileName) {
  cy.task('logToFile', {
    filename: fileName,
    message: `Test finished: ${testName} - Status: ${testStatus} - Duration: ${duration.toFixed(2)} seconds`,
  });
});

Cypress.Commands.add('logTestSummary', function (totalCount, passedCount, failedCount, totalTestDuration, fileName) {
  const totalSeconds = totalTestDuration;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = (totalSeconds % 60).toFixed(2);

  const formattedDuration = `${hours} hours ${minutes} minutes ${seconds} seconds`;

  const summary = `
========================================
Test suite completed: Login Page Tests
========================================
│ Tests:        ${totalCount}
│ Passing:      ${passedCount}
│ Failing:      ${failedCount}
│ Duration:     ${formattedDuration}
========================================
`;

  cy.task('logToFile', {
    filename: fileName,
    message: summary,
  });
});

/* 
===================
  end logging function 
=================== 
*/

// Cypress.Commands.add('login', (username, password) => {
//   cy.request('POST', `${apiBaseUrl}/login`, {
//     email: username,
//     password: password
//   }).then((response) => {
//     // Menyimpan token di localStorage atau cookies
//     window.localStorage.setItem('authToken', response.body.token); // jika menggunakan token
//     // atau jika aplikasi menggunakan cookies:
//     // cy.setCookie('authToken', response.body.token);
//   });
// });

Cypress.Commands.add('login', () => {
  cy.visit('/login');
  
  cy.intercept('POST', `${apiBaseUrl}/login`).as('loginRequest');

  cy.get('#__BVID__19').type(Cypress.env('email')).should('have.value', Cypress.env('email'));
  cy.wait(1000)
  cy.get('#__BVID__24').type(Cypress.env('password')).should('have.value', Cypress.env('password'));
  cy.wait(1000)
  cy.get('#baseButtonId').click();

  // wait for the login request and assert redirect
  cy.wait('@loginRequest').then((interception) => {
    expect(interception.response.statusCode).to.eq(200);
  });
});

Cypress.Commands.add('loginSession', () => {
   // Clear sessionStorage manually
  //  cy.window().then((win) => {
  //   win.sessionStorage.clear();
  //  })
  
  cy.session('loginSession', () => {
    cy.visit('/login');
    
    // Intercept login request and alias it for later use
    cy.intercept('POST', `${apiBaseUrl}/login`).as('loginRequest');
    
    // Input credentials and submit the form
    cy.get('#__BVID__19')
      .type(Cypress.env('email'))
      .should('have.value', Cypress.env('email'));

    cy.get('#__BVID__24')
      .type(Cypress.env('password'))
      .should('have.value', Cypress.env('password'));

    cy.get('#baseButtonId').click();

    // Wait for the login request to complete and assert the response status
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
  }, {
    cacheAcrossSpecs: true, // Cache session across specs
  });
});
