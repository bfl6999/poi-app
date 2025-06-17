describe('Login', () => {
  it('should log in successfully with correct credentials', () => {
    cy.visit('/login');
    cy.get('ion-input[formControlName="email"] input').type('usuario02@gmail.com');
    cy.get('ion-input[formControlName="password"] input').type('password123');
    cy.get('#button-sign-in').should('be.visible').click();
    cy.url().should('include', '/home');
    cy.url().should('not.include', '/login');
    cy.wait(2000);
    cy.contains('POIs'); // Ajustar según contenido real tras login
  });
});
