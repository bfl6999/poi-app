describe('Insert POI from form', () => {
  before(() => {
    cy.visit('/login');
    cy.get('ion-input[formControlName="email"] input').type('usuario02@gmail.com');
    cy.get('ion-input[formControlName="password"] input').type('password123');
    cy.get('#button-sign-in').click();
    cy.url().should('include', '/home');
  });

  it('should insert a new POI from the form', () => {
    const id = Date.now();

    // 👉 Mock de geolocalización ANTES de cargar la página
    cy.visit('/add-poi', {
      onBeforeLoad(win) {
        cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((cb) => {
          cb({
            coords: {
              latitude: 37.3886,     // Coordenadas de Sevilla, por ejemplo
              longitude: -5.9823
            }
          });
        });
      }
    });

    cy.get('ion-input[formControlName="name"] input').type(`Test POI ${id}`);
    cy.get('ion-input[formControlName="location"] input').type('Sevilla');
    cy.get('ion-textarea[formControlName="description"] textarea').type('Insertado por Cypress');
    cy.get('ion-input[formControlName="imageUrl"] input').type('https://blog.fuertehoteles.com/wp-content/uploads/2020/04/catedral-sevilla.jpg');

    // Esperar que el botón esté habilitado
    cy.get('#button-add-poi').should('not.be.disabled');

    cy.get('#button-add-poi').click();

    // Volver a Home y comprobar que se insertó
    cy.visit('/home');
    cy.contains(`Test POI ${id}`).should('exist');
  });
});