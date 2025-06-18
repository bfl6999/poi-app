describe('Search POIs', () => {
  it('should search POIs by name', () => {
    cy.visit('/home');

    // Abrir el ion-select
    cy.get('ion-select', { timeout: 10000 })
      .should('exist')
      .and('be.visible')
      .click({ force: true });

    // Seleccionar opción "Nombre"
    cy.get('ion-alert').should('exist');
    cy.get('ion-alert button.alert-radio-button')
      .contains('Nombre')
      .click({ force: true });

    // Confirmar la selección
    cy.get('ion-alert button.alert-button')
      .contains('OK')
      .click({ force: true });

    // Esperar a que el campo de nombre esté visible y disponible
    cy.get('[data-cy="input-name"] input', { timeout: 10000 })
      .should('exist')
      .and('be.visible')
      .focus()
      .type('Parque', { delay: 50 });

    // Enviar formulario
    cy.get('form').submit();

    // Verificar resultado
    cy.contains('Parque', { timeout: 10000 }).should('exist');
  });
});