describe('Policies Module', () => {
    beforeEach(() => {
        // Login before each test
        cy.visit('/login');
        cy.get('input[name="email"]').type('admin@insurex.com');
        cy.get('input[name="password"]').type('Admin@123');
        cy.get('button[type="submit"]').click();
        cy.visit('/policies');
    });

    it('should display the policy list', () => {
        cy.contains('Policies').should('be.visible');
        cy.get('table').should('exist');
    });

    it('should search for policies', () => {
        cy.get('input[placeholder="Search policies..."]').type('POL-');
        // Wait for debounce/fetch
        cy.wait(500);
        // Even if no results, table should still exist
        cy.get('table').should('exist');
    });

    it('should navigate to create policy page', () => {
        cy.contains('New Policy').click();
        cy.url().should('include', '/policies/new');
        cy.contains('Policy Information').should('be.visible');
    });

    it('should view policy details', () => {
        // Click on the first "Visibility" icon in the table
        cy.get('button[aria-label="View"]').first().click();
        cy.url().should('match', /\/policies\/[a-zA-Z0-9-]+/);
        cy.contains('Policy Details').should('be.visible');
    });
});
