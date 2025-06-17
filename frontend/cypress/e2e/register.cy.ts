describe('Register', () => {
  it('should register a new user', () => {
    cy.visit('/register');
    cy.get('ion-input[formControlName="name"] input').type(`user${Date.now()}`);
    cy.get('ion-input[formControlName="email"] input').type(`user${Date.now()}@example.com`);
    cy.get('ion-input[formControlName="password"] input').type('testpassword');
    cy.get('ion-input[formControlName="confirmPassword"] input').type('testpassword');
    cy.get('#button-register').should('be.visible').click();

    cy.url().should('not.include', '/register');
    cy.contains('POIs');
  });
});