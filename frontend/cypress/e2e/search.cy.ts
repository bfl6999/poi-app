describe('Search POIs by Name', () => {
  beforeEach(() => {
    cy.visit('/home');
  });

  it('Debe permitir buscar POIs por nombre', () => {
    // 1. Abrir ion-select de filtro
    cy.get('ion-select[data-cy="search-filter"]', { timeout: 10000 })
      .should('exist')
      .click({ force: true });

    // 2. Esperar que se abra el ion-alert con opciones (Nombre, Lugar, Fecha)
    cy.get('ion-alert', { timeout: 10000 }).should('exist');

    // 3. Seleccionar la opción "Nombre"
    cy.get('ion-alert')
      .find('button.alert-radio-button')
      .contains('Nombre')
      .click({ force: true });

    // 4. Confirmar selección con el botón OK
    cy.get('ion-alert')
      .find('button.alert-button')
      .contains(/^ok$/i) // insensible a mayúsculas/minúsculas
      .click({ force: true });

    // 5. Comprobar que la selección se actualizó visualmente
    cy.get('ion-select[data-cy="search-filter"]')
      .shadow()
      .find('.select-text')
      .should('contain', 'Nombre');

    // 6. Esperar el input correspondiente al nombre y escribir
    cy.get('[formcontrolname="name"] input')
      .should('be.visible')
      .type('Parque', { delay: 30 });

    // 7. Enviar el formulario
    cy.get('form').submit();

    // 8. Validar que se muestre un POI con ese nombre
    cy.contains('ion-card-title', 'Parque', { timeout: 10000 }).should('exist');
  });
});