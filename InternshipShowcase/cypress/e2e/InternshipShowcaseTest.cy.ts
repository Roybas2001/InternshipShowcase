it("Test InternshipShowcase", function () {
  cy.visit("http://localhost:4321/");
  cy.wait(5000);
  cy.get(
    ".dark-null-gradient > .py-5 > .w-full > .list-none > :nth-child(1) > a"
  ).wait(500).click();
  cy.get(
    ".dark-null-gradient > .py-5 > .w-full > .list-none > :nth-child(2) > a"
  ).wait(500).click();
  cy.get(".list-none > :nth-child(3) > a").wait(500).click();
  cy.get('.sm\\:block').wait(500).click();
  cy.get('.dark-null-gradient > .py-5 > .w-full > .list-none > :nth-child(2) > a').wait(500).click();
  cy.get('#readme > .mt-4').wait(500).click();
  cy.get('.dark-null-gradient > .py-5 > .w-full > .gap-2 > .text-white').wait(500).click();
  cy.get('#pixelmatchwe > .mt-4').wait(500).click();
  cy.get('.dark-null-gradient > .py-5 > .w-full > .gap-2 > .text-white').wait(500).click();
  cy.get('#cypress > .mt-4').wait(500).click();
  cy.get('.dark-null-gradient > .py-5 > .w-full > .gap-2 > .text-white').wait(500).click();
  cy.get('#cypressadminpanel > .mt-4').wait(500).click();
  cy.get('.sm\\:block').wait(500).click();
  cy.get('#newshopsetup > .mt-4').wait(500).click();
  cy.get('.sm\\:block').wait(500).click();
});
