describe("Navigation Tests", () => {
  it("should navigate to collections page", () => {
    cy.viewport(1280, 720);
    cy.visit("http://localhost:3000");
    cy.get('a[href*="collections"]').click({ multiple: true });
    cy.url().should("include", "/collections");
    cy.get("h1").should("exist");
  });
});
