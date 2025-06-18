describe('Search POIs', () => {
  it('should search POIs by name', () => {
    cy.visit('/home');

    // Abre el filtro de búsqueda
    cy.get('[data-cy="search-filter"]').click();

    // Espera y selecciona "Nombre"
    cy.get('ion-alert').should('exist');
    cy.get('ion-alert button.alert-radio-button').contains('Nombre').click({ force: true });
    cy.get('ion-alert button.alert-button').contains('OK').click({ force: true });

    // Esperar a que el ion-input se monte y acceder al input interno
    cy.get('[data-cy="input-name"]', { timeout: 10000 })
      .should('exist')
      .then(($ionInput) => {
        const input = $ionInput[0].shadowRoot?.querySelector('input');
        expect(input).to.exist;
        cy.wrap(input).type('Parque', { delay: 50 });
      });

    // Enviar formulario
    cy.get('form').submit();

    // Validar que haya resultados
    cy.contains('Parque', { timeout: 10000 }).should('exist');
  });
});