/// <reference types="cypress" />

describe('Search POIs by Name', () => {
  beforeEach(() => {
    cy.visit('/home');
  });

  it('Debe permitir buscar POIs por nombre', () => {
    /* 1-4. Seleccionar filtro “Nombre” */
    cy.get('ion-select[data-cy="search-filter"]').click({ force: true });
    cy.get('ion-alert').should('exist');
    cy.contains('button.alert-radio-button', 'Nombre').click({ force: true });
    cy.contains('button.alert-button', /^ok$/i).click({ force: true });

    /* 5. Confirmar que el select muestra “Nombre” */
    cy.get('ion-select[data-cy="search-filter"]')
      .shadow()
      .find('.select-text')
      .should('contain', 'Nombre');

    /* 6. Escribir en el campo de nombre (dentro del shadow DOM) */
    cy.get('ion-input[data-cy="input-name"] input').type('Parque')


    /* 7. Enviar formulario */
    cy.get('form').submit();

    /* 8. Validar resultado */
    cy.contains('ion-card-title', 'Parque', { timeout: 10000 }).should('exist');
  });
});