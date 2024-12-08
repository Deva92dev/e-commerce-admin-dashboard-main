describe("Collection Pages", () => {
  beforeEach(() => {
    Cypress.env("NODE_ENV", "test");
  });
  const collections = [
    { id: "1", title: "Summer Collection" },
    { id: "2", title: "Winter Collection" },
    { id: "3", title: "Casual Collection" },
  ];
  collections.forEach((collection) => {
    it(`should load and display the ${collection.title} page`, () => {
      cy.visit(`/collections/${collection.id}`);
      cy.get("h1").should("contain.text", `${collection.title} Category`);
    });
  });
  it("should show 404 for non-existent collection", () => {
    cy.viewport(1280, 720);
    cy.visit("/collections/999", { failOnStatusCode: false });
    cy.get("h1").should("contain.text", "404");
  });
});
