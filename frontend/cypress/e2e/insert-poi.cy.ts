/// <reference types="cypress" />


describe('Insert POI from form', () => {
  const email = 'usuario02@gmail.com';
  const pass  = 'password123';
  const poiName = `Test POI ${Date.now()}`;   // ← nombre único

  /* 1️⃣  Mantener sesión de login entre tests  -------------------- */
  beforeEach(() => {
    cy.session([email, pass], () => {
      cy.visit('/login');
      cy.get('ion-input[formControlName="email"] input').type(email);
      cy.get('ion-input[formControlName="password"] input').type(pass);
      cy.get('#button-sign-in').click();
      cy.url().should('include', '/home');
    });
  });

  /* 2️⃣  Caso de prueba ------------------------------------------- */
  it('debe insertar un nuevo POI desde el formulario', () => {
    cy.intercept('POST', '/api/pois').as('createPoi');

    cy.visit('/add-poi', { onBeforeLoad: stubGeo });

    cy.get('ion-input[formControlName="name"] input').type(poiName);
    cy.get('ion-input[formControlName="location"] input').type('Sevilla');
    cy.get('ion-textarea[formControlName="description"] textarea')
      .type('Añadido por Cypress');
    cy.get('ion-input[formControlName="imageUrl"] input')
      .type('https://blog.fuertehoteles.com/wp-content/uploads/2020/04/catedral-sevilla.jpg');

    cy.get('#button-add-poi').should('not.be.disabled').click();

    cy.wait('@createPoi').its('response.statusCode').should('eq', 201);

    cy.visit('/home');                                      // por si la app no navega sola
    cy.contains(poiName, { includeShadowDom: true }).should('exist');
  });
});

/* ------------------------------------------------------------------
 *  Helper: falsifica permisos y geolocalización
 * -----------------------------------------------------------------*/
function stubGeo(win: Window) {
  const originalQuery = win.navigator.permissions?.query;
  if (originalQuery) {
    cy.stub(win.navigator.permissions, 'query').callsFake((params: any) => {
      if (params?.name === 'geolocation') {
        return Promise.resolve({ state: 'granted' });
      }
      return originalQuery.call(win.navigator.permissions, params);
    });
  } else {
    // polyfill si no existe navigator.permissions en headless
    (win as any).navigator.permissions = {
      query: (p: any) =>
        Promise.resolve({ state: p?.name === 'geolocation' ? 'granted' : 'prompt' })
    };
  }

  /* b) getCurrentPosition → coordenadas de Sevilla */
  cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((cb) => {
    cb({
      coords: {
        latitude: 37.3886,
        longitude: -5.9823
      }
    });
  });
}
