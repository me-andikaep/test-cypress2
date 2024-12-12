describe('Menu team', () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.login();
    // cy.visit('/task/task');

  });

  it('should show menu task', () => {
    cy.url().should('include', '/tasks/task');
  })

  it('should show menu team', () => {
    cy.visit('/setting/team');
    cy.url().should('include', '/setting/team');
  })

  it('create team', () => {
    cy.get('button#baseButtonId').should('be.visible');
    cy.get('button#baseButtonId').click();

    cy.get('#dialogTeam')
      .should('be.visible');
    
    cy.get('input[placeholder="Write team name"]').type('depok').should('have.value', 'depok');

    cy.get('button[type="submit"]').click();
  })


})