describe('Search POIs', () => {
  it('should search POIs by name', () => {
    cy.visit('/home');

    // Selecciona filtro "Nombre"
    cy.get('[data-cy="search-filter"]').click({ force: true });
    cy.get('ion-alert button.alert-radio-button').contains('Nombre').click({ force: true });
    cy.get('ion-alert button.alert-button').contains('OK').click({ force: true });

    // Espera a que el ion-input esté completamente renderizado y accede a su input interno
    cy.get('[data-cy="input-name"]')
      .should('exist')
      .find('input') // accede al input real que Ionic proyecta internamente
      .should('be.visible')
      .type('Parque', { delay: 50 });

    // Enviar búsqueda
    cy.get('form').submit();

    // Verifica resultado
    cy.contains('Parque', { timeout: 10000 }).should('exist');
  });
});