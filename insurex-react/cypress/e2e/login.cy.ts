describe('Login Flow', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should display the login page correctly', () => {
        cy.get('h4').should('contain', 'Login');
        cy.get('button').should('contain', 'Entrar');
    });

    it('should show error on invalid credentials', () => {
        cy.get('input[type="email"]').type('wrong@example.com');
        cy.get('input[type="password"]').type('wrongpassword');
        cy.get('button[type="submit"]').click();

        // We expect an alert or error message to appear
        cy.get('.MuiAlert-root').should('be.visible');
    });

    it('should have a link to registration', () => {
        cy.get('a').contains('Não tem uma conta?').should('be.visible');
    });
});
