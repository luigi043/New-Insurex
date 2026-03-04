describe('Login Flow', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should display login page', () => {
        cy.get('h4').should('contain', 'Entrar') || cy.get('h4').should('contain', 'Login');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
    });

    it('should show error on invalid credentials', () => {
        // Mock the API response
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 401,
            body: { message: 'Credenciais inválidas' },
        }).as('loginRequest');

        cy.get('input[name="email"]').type('invalid@example.com');
        cy.get('input[name="password"]').type('wrongpassword');
        cy.get('button[type="submit"]').click();

        cy.wait('@loginRequest');
        cy.get('.MuiAlert-message').should('contain', 'Credenciais inválidas');
    });

    it('should redirect to dashboard on successful login', () => {
        // Mock the API response
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 200,
            body: {
                user: { id: '1', email: 'user@example.com', firstName: 'Test', lastName: 'User', role: 'Admin' },
                accessToken: 'mock-token',
                refreshToken: 'mock-refresh-token',
            },
        }).as('loginRequest');

        cy.intercept('GET', '/api/auth/me', {
            statusCode: 200,
            body: { id: '1', email: 'user@example.com', firstName: 'Test', lastName: 'User', role: 'Admin' }
        });

        cy.get('input[name="email"]').type('user@example.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        cy.wait('@loginRequest');
        cy.url().should('include', '/dashboard');
        cy.get('h4').should('contain', 'Dashboard');
    });
});
