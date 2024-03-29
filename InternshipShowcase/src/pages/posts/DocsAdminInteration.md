---
layout: ../../layouts/MDlayout.astro
title: 'Cypress Admin Panel Interaction Docs'
subtitle: 'Cypress Admin Interaction'
---

## Table Of Contents
- [Requirements](#requirements)
- [Steps](#steps)
- [Further Use](#further-use)

## Requirements
First of all we need to be able to use Cypress. So lets start by installing Cypress

NPM install
```terminal
cd /your/project/path
npm init
npm install cypress --save-dev
```

Now that we have Cypress installed we can use the written scripts to start interacting with the admin panel of a shop. In case you don't already have a script at the ready you can use the <a href="https://docs.cypress.io/guides/overview/why-cypress" target="_blank">Cypress Documentation</a> to create your own script. Since Cypress is a testing software we don't need to use all the different function that are build in Cypress. In this case we will be using Cypress to automate a task for us, configuring the setup of a new shop in the admin panel.

## Steps

For this example we will use this script:

```js
describe("Test admin panel, configure things locally", function () {
  it("Visits the site, checks for the trusted shop badge", function () {
    // Visit the local envoirment
    cy.visit("https://app.zonnerij.test/", { timeout: 30000 });

    // Stay idle for 5 seconds so everything loads in
    cy.wait(5000);

    // Locate and close the cookie modal
    cy.get(".action-close").wait(500).click({
      multiple: true,
      force: true,
    });

    // Assert the modal is closed
    cy.get(".action-close").wait(500).should("not.be.visible");

    // Locate the trusted badge and assert it exists
    cy.get('[data-testid="trustmark-container-floating"]')
      .wait(500)
      .should("be.visible");
  });

  it("Visits the admin panel, logs in and make a change to the trusted badge", function () {
    // Visit the admin panel
    cy.visit("https://app.zonnerij.test/fantbeheer/admin", { timeout: 30000 });

    // Log in
    /* Username */
    cy.get("#username").wait(500).type("admin");
    cy.get("#username").wait(500).should("have.value", "admin");

    /* Password */
    cy.get("#login").wait(500).type("password");
    cy.get("#login").wait(500).should("have.value", "password");

    /* Click on the log in button */
    cy.get(".action-login").wait(500).click();

    // Select store
    cy.get('#menu-magento-backend-stores > [onclick="return false;"]')
      .wait(500)
      .click();

    // Select Configuration
    cy.get(".item-system-config > a > span").wait(500).click();

    // Select TrustedBadge
    cy.get(":nth-child(12) > .admin__page-nav-title").wait(500).click();

    cy.get(
      ":nth-child(12) > .admin__page-nav-items > :nth-child(2) > .admin__page-nav-link"
    )
      .wait(500)
      .click();

    // Change the setting
    cy.get("#trustedshops_trustedshops_trustbadge_variant").select("reviews");
    cy.get("#save").wait(500).click();

    // Assert the change was made
    cy.get(".messages > .message").wait(500).should("be.visible");

    // Assert the change was made for the users perspective
    cy.visit("https://app.zonnerij.test/", { timeout: 30000 });

    // Stay idle for 5 seconds so everything loads in
    cy.wait(5000);

    // Locate and close the cookie modal
    cy.get(".action-close").wait(500).click({
      multiple: true,
      force: true,
    });

    // Assert the modal is closed
    cy.get(".action-close").wait(500).should("not.be.visible");

    // Locate the trusted badge and assert it exists
    cy.get('[data-testid="trustmark-container-floating"]')
      .wait(500)
      .should("be.visible");

    // Locate the trusted badge and confirm the change
    cy.get('[data-testid="trustbadge-floating-reviews-container"]')
      .wait(500)
      .should("be.visible");
  });
});
```

In this script we fist check to see if the TrustedBadge container is visible for the user, when this is not the case the first test will fail but it will proceed to the next part of the script. In the next part of the script we will login in the admin panel of the website and change a setting of the store regarding the visuals of the TrustedBadge container. When we visit the admin panel we need to login using the `username: "admin"` with the corresponding `password: "password"`.

>**NOTE**
>This is not the actual username for the admin panel, this is for demonstation purposes only.
>This is not the actual password for the admin panel, this is for demonstration purposes only.

After entering the username we assert that the correct value has been entered. This is also done for the password that is entered. After we logged in to the admin panel of the webshop we can change the settings, in this script we navigate to `Store > Configuration > Trusted Badge > Configuration` then we change the display type of the TrustedBadge container to show the container with review stars. After we changed the value of the setting we click on the save button. Now the changes have been saved in the admin panel, we can see the changes from a user perspective.

## Further use
Now that we know it is possible to change settings in the admin panel using a Cypress script we can start writing a script to setup new shops automaticly. This will relieve the PM's of a very repetetive work routine when a new customer is choosing our firm.