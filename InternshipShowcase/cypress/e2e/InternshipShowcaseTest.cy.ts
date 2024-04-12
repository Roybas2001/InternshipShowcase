describe("It tests the links in the Internship Showcase Site", function () {
  it("Test InternshipShowcase", function () {
    cy.visit("http://localhost:4321/");
    cy.get('.dark-null-gradient > .py-5 > .w-full > .list-none > :nth-child(1) > a').click();
    cy.get('.dark-null-gradient > .py-5 > .w-full > .list-none > :nth-child(2) > a').click();
    cy.get('.list-none > :nth-child(3) > a').click();
    cy.get('.sm\\:block').click();
  })
});
