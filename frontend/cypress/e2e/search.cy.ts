describe('Search POIs', () => {
  it('should search POIs by name', () => {
    cy.visit('/home');

    // 1. Abrir selector de filtro
    cy.get('ion-select', { timeout: 10000 }).should('exist').click({ force: true });

    // 2. Seleccionar opción "Nombre"
    cy.get('ion-alert').should('be.visible');
    cy.get('ion-alert button.alert-radio-button')
      .contains('Nombre')
      .click({ force: true });

    cy.get('ion-alert button.alert-button')
      .contains('OK')
      .click({ force: true });

    // 3. Esperar a que input "Nombre" esté visible
    cy.get('[data-cy="input-name"]', { timeout: 10000 })
      .should('exist')
      .and('be.visible')
      .type('Parque', { delay: 50 });

    // 4. Enviar formulario
    cy.get('form').submit();

    // 5. Verificar resultado
    cy.contains('Parque', { timeout: 10000 }).should('exist');
  });
});