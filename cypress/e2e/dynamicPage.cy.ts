const collections = [
  { _id: "1", title: "Summer Collection" },
  { _id: "2", title: "Winter Collection" },
];

collections.forEach((collection) => {
  it(`should load and display the ${collection.title} page`, () => {
    cy.intercept(`GET`, `/api/collections/${collection._id}`, {
      statusCode: 200,
      body: {
        _id: collection._id,
        title: collection.title,
        description: `Description of ${collection.title}`,
        image: "/images/sample.jpg",
        products: [],
      },
    }).as("getCollectionDetails");

    cy.visit(`http://localhost:3000/collections/${collection._id}`);
    cy.wait("@getCollectionDetails");

    cy.get("h1").should("contain.text", `${collection.title} Category`);
  });
});
