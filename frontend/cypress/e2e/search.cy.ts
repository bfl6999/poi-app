describe('Search POIs', () => {
  it('should search POIs by name', () => {
    cy.visit('/home');
    cy.get('ion-select').click();
    // 2. Esperar el modal y hacer click en "Nombre"
    cy.get('ion-alert')
      .should('be.visible')
      .find('button.alert-radio-button')
      .contains('Nombre')
      .click({ force: true });

    // 3. Confirmar con OK
    cy.get('ion-alert')
      .find('button.alert-button')
      .contains('OK')
      .click({ force: true });

    // 4. Esperar input por nombre y buscar
    cy.get('ion-input[formControlName="name"] input')
      .should('exist')
      .type('Parque');

    cy.get('form').submit();
    cy.contains('Parque').should('exist');
  });

  // Pendiente subir otros filtros 

});
