<<<<<<< HEAD
describe('Authentication Flow', () => {
=======
describe('Login Flow', () => {
>>>>>>> d63fc5bdc80de482702d1cfe0d23b84da79cbd27
    beforeEach(() => {
        cy.visit('/login');
    });

<<<<<<< HEAD
    it('should show validation errors on empty submission', () => {
        cy.get('button[type="submit"]').click();
        cy.contains('Email é obrigatório').should('be.visible');
        cy.contains('Senha é obrigatória').should('be.visible');
    });

    it('should allow user to login with valid credentials', () => {
        // Note: This assumes mock data or a test account exists
        cy.get('input[name="email"]').type('admin@insurex.com');
        cy.get('input[name="password"]').type('Admin@123');
        cy.get('button[type="submit"]').click();

        // Should redirect to dashboard
        cy.url().should('include', '/dashboard');
        cy.contains('Dashboard Overview').should('be.visible');
    });

    it('should navigate to forgot password page', () => {
        cy.contains('Esqueceu a senha?').click();
        cy.url().should('include', '/forgot-password');
=======
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
>>>>>>> d63fc5bdc80de482702d1cfe0d23b84da79cbd27
    });
});
