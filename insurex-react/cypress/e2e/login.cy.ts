describe('Authentication Flow', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

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
    });
});
