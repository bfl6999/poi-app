describe('Insert POI from form', () => {
  before(() => {
    cy.visit('/login');
    cy.get('ion-input[formControlName="email"] input').type('usuario02@gmail.com');
    cy.get('ion-input[formControlName="password"] input').type('password123');
    cy.get('#button-sign-in').click();
    cy.url().should('include', '/home');
  });

  it('should insert a new POI from the form', () => {
    cy.contains('Añadir POI').click();
    const id = Date.now();

    cy.get('ion-input[formControlName="name"] input').type(`Test POI ${id}`);
    cy.get('ion-input[formControlName="location"] input').type('Sevilla');
    cy.get('ion-textarea[formControlName="description"] textarea').type('Insertado por Cypress');
    cy.get('ion-input[formControlName="imageUrl"] input').type('https://blog.fuertehoteles.com/wp-content/uploads/2020/04/catedral-sevilla.jpg')
    cy.get('#button-add-poi').should('be.visible').click();
    cy.visit('/home');
    cy.contains(`Test POI ${id}`).should('exist');
  });
});