describe('Pie Chart Visual Validation', () => {
    it('should visually validate the pie chart on the dashboard', () => {
      cy.visit('/dashboard'); // Ensure this is the correct URL where the PieChart is rendered
      cy.eyesOpen({
        appName: 'Your App Name',
        testName: 'Pie Chart Visual Test',
        browser: { width: 1024, height: 768 }
      });
      // Assuming you have a specific test id or class for the pie chart for easy selection
      cy.get('.pie-chart-container').should('be.visible'); // Adjust if you use a different selector
      cy.eyesCheckWindow('Dashboard Page - Pie Chart');
      cy.eyesClose();
    });
  });
  