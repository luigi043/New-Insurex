describe('Claims Module', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('input[name="email"]').type('admin@insurex.com');
        cy.get('input[name="password"]').type('Admin@123');
        cy.get('button[type="submit"]').click();
        cy.visit('/claims');
    });

    it('should display claims list', () => {
        cy.contains('Claims').should('be.visible');
        cy.get('table').should('exist');
    });

    it('should navigate to submit claim form', () => {
        cy.contains('New Claim').click();
        cy.url().should('include', '/claims/new');
    });

    it('should view claim details and timeline', () => {
        cy.get('button[aria-label="View"]').first().click();
        cy.url().should('match', /\/claims\/[a-zA-Z0-9-]+/);
        cy.contains('Internal Notes').should('be.visible');
    });
});
