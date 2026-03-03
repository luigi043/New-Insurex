describe('Assets Module', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('input[name="email"]').type('admin@insurex.com');
        cy.get('input[name="password"]').type('Admin@123');
        cy.get('button[type="submit"]').click();
        cy.visit('/assets');
    });

    it('should display asset list', () => {
        cy.contains('Assets').should('be.visible');
        cy.get('table').should('exist');
    });

    it('should navigate to asset creation wizard', () => {
        cy.contains('New Asset').click();
        cy.url().should('match', /\/assets\/(new|edit\/new)/);
    });

    it('should filter assets by search', () => {
        cy.get('input[placeholder="Search assets..."]').type('Laptop');
        cy.wait(500);
        cy.get('table').should('exist');
    });
});
