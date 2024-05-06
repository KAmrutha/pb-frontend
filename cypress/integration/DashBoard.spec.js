describe('Dashboard Functionality', () => {
    it('loads the dashboard and displays the bar chart', () => {
      cy.visit('/dashboard');
      cy.get('[data-testid="bar-chart"]').should('be.visible');  // Assuming you add `data-testid="bar-chart"` to your BarChart component
    });
  });
  