describe('Search POIs', () => {
  it('should search POIs by name', () => {
    cy.visit('/home');

    // 1. Abrir el ion-select
    cy.get('ion-select').click();

    // 2. Seleccionar "Nombre" desde ion-alert
    cy.get('ion-alert')
      .should('exist')
      .find('button.alert-radio-button')
      .contains('Nombre')
      .click({ force: true });

    // 3. Confirmar con OK
    cy.get('ion-alert')
      .find('button.alert-button')
      .contains('OK')
      .click({ force: true });

    // 4. Esperar que el input esté en el DOM
    cy.get('ion-input[formControlName="name"] input', { timeout: 6000 })
      .should('exist')
      .should('be.visible');

    // 5. Escribir texto
    cy.get('ion-input[formControlName="name"] input')
      .type('Parque', { delay: 100 });

    // 6. Enviar formulario
    cy.get('form').submit();

    // 7. Comprobar resultados
    cy.contains('Parque').should('exist');
  });
});