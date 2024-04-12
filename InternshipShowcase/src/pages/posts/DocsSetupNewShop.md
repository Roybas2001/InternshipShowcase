---
layout: ../../layouts/MDLayout.astro
title: 'Setup new shop script'
subtitle: 'Automated new shop script'
---

## Table of Contents


## Requirements
First of all we need to be able to use Cypress. So lets start by installing Cypress

NPM Install
```terminal
cd /your/project/path
npm init
npm install cypress --save-dev
```

Now that we have Cypress installed we can start looking at the list of action our script needs to preform. In this page:
<a href="https://webfant.atlassian.net/wiki/spaces/HI/pages/646676484/New+customer+environment+default+config"
    target="_blank">New Customer environment default config</a> all the steps that need to be taken are written down.
When you have read the documentation page we can start to write our script with the clear goals in mind.

## Steps
Lets start at the top of the to do list:

* Stores > Configuration > Admin > Security
    * Admin Account Sharing: yes
    * Admin Session Lifetime (seconds): 5400
    * Lockout Time (minutes): 90
    * Password Lifetime (days): *empty*
    * Password Change: Recommended

### Script setup

Lets start by defining how the script will look code wise. We have 3 main options:
- Every part of the todo list is in a seperate file
- Every part of the todo list is in the same file and in the same scenario
- _Every part of the todo list is in the same file but in different scenario's_


We will be making every test in the same file but in different scenario's. So for every test we need to visit the admin
panel and log in, we can make this by creating a `beforeEach()` function. But what do we need to do after we visit the
admin panel? We need to log in, and when we look at the to do list we will need to go to `Stores > Configuration` for
all settings except for 1 setting.

To keep the script clear and sort of stand alone from users, we will create a new file in which we keep the different arguments that will be used. So think about `cy.get(~argument~)` and `cy.type(~argument~)`. We will call this file: `NewShopSetupVariables.js`, we also need to import the variables to the script so we'll just export every variable.

#### Arguments File

```javascript
// Input Variables
export const username = "admin"; // For demonstration purposes
export const password = "admin"; // For demonstration purposes
export const adminUrl = "https://app.zonnerij.test/admin"; // For demonstration purposes
export const cookiePath = "/";
export const cookieDomain = "https://www.webfant.io/";
export const userRoleName = "WinkelEigenaar";

/* Getter Variables */
// Before Each
export const loginUsernameSelector = "#username";
export const loginPasswordSelector = "#login";
export const loginButtonSelector = ".action-login";
export const storesMenuSelector = '#menu-magento-backend-stores > [onclick="return false;"]';
export const storesMenuConfigSelector = ".item-system-config > a > span";

// Stores > Configuration > Advanced > Admin > Security
export const menuConfigAdvancedSelector = ":nth-child(24) > .admin__page-nav-title > strong";
export const menuConfigAdvancedSecuritySelector = ":nth-child(24) > .admin__page-nav-items > :nth-child(1) > .admin__page-nav-link > span";

// Stores > Configuration > General > General
export const menuConfigGeneralSelector = ":nth-child(2) > .admin__page-nav-title";
export const menuConfigGeneralGeneralSelector = ":nth-child(2) > .admin__page-nav-items > :nth-child(1) > .admin__page-nav-link > span";

// Stores > Configuration > General > Web
export const menuConfigGeneralWebSelector = ":nth-child(2) > .admin__page-nav-items > :nth-child(2) > .admin__page-nav-link > span";
export const menuConfigGeneralWebCookiePathSelector = "#web_cookie_cookie_path";
export const menuConfigGeneralWebCookieDomainSelector = "#web_cookie_cookie_domain";

// Stores > Configuration > Catalog > Catalog > Search Engine Optimization
export const menuConfigCatalogSelector = ":nth-child(5) > .admin__page-nav-title > strong";
export const menuConfigCatalogCatalogSelector = "._show > .admin__page-nav-items > .separator-top > .admin__page-nav-link > span";
export const systemSelector = '#menu-magento-backend-system > [onclick="return false;"] > span';
export const systemCacheSelector = ".item-system-cache > a > span";

// System > User Roles
export const systemUserRoleSelector = ".item-system-acl-roles > a > span";
export const systemUserRoleAddSelector = "#add > span";
export const systemUserRoleAddRoleNameSelector = "#role_name";
export const systemUserRoleAddRolePasswordSelector = "#current_password";
export const systemUserRoleResourcesSelector = "#role_info_tabs_account > :nth-child(1)";
export const systemUserRoleCustomSelector = "#all";
export const disableSettingsArr = [
    '[data-id="Magento_Config::dev"] > a > .jstree-checkbox',
    '[data-id="Magento_Config::config_system"] > a > .jstree-checkbox',
    '[data-id="Magento_Backend::store"] > a > .jstree-checkbox',
    '[data-id="Magento_User::acl"] > :nth-child(3) > .jstree-checkbox',
  ];

// Save button
export const saveButton = ".ui-button-text > span";
```

In this file we have put every argument for this specific case. We seperated everything nicely to the corresponding script scenario.

#### Helper function

In 4 of the 5 scenario's we will need to open a dropdown menu (in case it isn't open by default), to do this we need to preform a coditional check to see if the menu is open or not. We can preform this action 4 times in each scenario, but if we make helper function that preforms this action we can achieve a cleaner code base. After we open every dropdown menu we will need to preform another conditional check. With the coditional check we see if the setting is accesable for cypress to change it or not. When the check fails we will need to click on the specific checkbox to be able to change the setting.

```javascript
function theOneFunctionToRuleThemAll(properties) {
  const { selectAction, checkboxes } = properties;

  // Open the tabs
  cy.get(".section-config").then(($element) => {
    const isOpen = $element.hasClass("active");
    if (!true && isOpen) {
      cy.get(".section-config > div.entry-edit-head > a").click({
        multiple: true,
        force: true,
      });
    }
  });

  // When the setting has a checkbox perform these action
  if (checkboxes) {
    checkboxes.forEach(
      ({ checkboxSelector, actionSelector, actionType, value }) => {
        cy.get(checkboxSelector).then(($checkbox) => {
          const isChecked =
            window.getComputedStyle($checkbox[0], "::after").content !== "none";
          if (isChecked) {
            cy.get(checkboxSelector).click({ force: true });
          }

          const options = {
            select: () => cy.get(actionSelector).select(value, { force: true }),
            type: () =>
              cy
                .get(actionSelector)
                .clear({ force: true })
                .type(value, { force: true }),
            clear: () => cy.get(actionSelector).clear({ force: true }),
            default: () => cy.get(actionSelector).click(),
          };

          (options[actionType] || options.default)();
        });
      }
    );
  }

  // If a select is nessecary we preform this action
  if (selectAction) {
    cy.get(selectAction.selectorVar).select(selectAction.value, {
      force: true,
    });
  }
}
```

Now that we have every argument ready for use we can start writing the script scenario's. To speed up the process of the scenario scripts we can chain the commands together.

### Admin Security Scenario

First we present the whole script and then we break each component down, and explain the choices behind the approach

**The script**
```javascript
  it("Changes settings in Stores > Config > Adv. > Admin > Security", function () {
    // Select Advanced
    cy.get(variables.menuConfigAdvancedSelector)
      .click({ force: true })
      .get(variables.menuConfigAdvancedSecuritySelector)
      .click({ force: true })
      .then(() => {
        theOneFunctionToRuleThemAll({
          checkboxes: [
            {
              checkboxSelector: "#admin_security_admin_account_sharing_inherit",
              actionSelector: "#admin_security_admin_account_sharing",
              actionType: "select",
              value: "1",
            },
            {
              checkboxSelector: "#admin_security_session_lifetime_inherit",
              actionSelector: "#admin_security_session_lifetime",
              actionType: "type",
              value: "5400",
            },
            {
              checkboxSelector: "#admin_security_lockout_threshold_inherit",
              actionSelector: "#admin_security_lockout_threshold",
              actionType: "type",
              value: "90",
            },
            {
              checkboxSelector: "#admin_security_password_lifetime_inherit",
              actionSelector: "#admin_security_password_lifetime",
              actionType: "clear",
            },
            {
              checkboxSelector: "#admin_security_password_is_forced_inherit",
              actionSelector: "#admin_security_password_is_forced",
              actionType: "select",
              value: "0",
            },
          ],
        });
      })
      .get(variables.saveButton)
      .click({ force:true });
  });
```

The script made for this scenario starts by selecting the Advanced setting, then the specific Admin section of the settings. We chain the helper function to this, we append multiple properties to the helper function so we can preform more than 1 setting change while only calling the function once. After the helper function we will save the settings. After all the settings we need to change have been changed we save the settings.

### General General Scenario

First we present the whole script and then we break each component down, and explain the choices behind the approach

**The script**
```javascript
  it("Changes settings in Stores > Config > General > General", function () {
    // Select General Options
    cy.get(variables.menuConfigGeneralSelector)
      .click({ force: true })
      .get(variables.menuConfigGeneralGeneralSelector)
      .click({ force: true })
      .then(() => {
        theOneFunctionToRuleThemAll({
          checkboxes: [
            {
              checkboxSelector: "#general_country_default_inherit",
              actionSelector: "#general_country_default",
              actionType: "select",
              value: "NL",
            },
            {
              checkboxSelector: "#general_locale_weight_unit_inherit",
              actionSelector: "#general_locale_weight_unit",
              actionType: "select",
              value: "kgs",
            },
            {
              checkboxSelector: "#general_locale_firstday_inherit",
              actionSelector: "#general_locale_firstday",
              actionType: "select",
              value: "1",
            },
          ],
          selectAction: {
            selectorVar: "#general_locale_code",
            value: "nl_NL",
          },
        });
      })
      .get(variables.saveButton)
      .click({ force:true });
  });
```
The script made for this scenario starts by selecting the General setting, then the specific General section of the settings. We chain the helper function to this, we append multiple properties to the helper function so we can preform more than 1 setting change while only calling the function once. After the helper function we will save the settings. After all the settings we need to change have been changed we save the settings.

### General Web Scenario

First we present the whole script and then we break each component down, and explain the choices behind the approach

**The script**
```javascript
  it("Changes settings in Stores > Config > General > Web", function () {
    // Select General Options
    cy.get(variables.menuConfigGeneralSelector)
      .click({ force: true })
      .get(variables.menuConfigGeneralWebSelector)
      .click({ force: true })
      .then(() => {
        theOneFunctionToRuleThemAll({
          checkboxes: [
            {
              checkboxSelector: "#web_cookie_cookie_lifetime_inherit",
              actionSelector: "#web_cookie_cookie_lifetime",
              actionType: "type",
              value: "86400",
            },
            {
              checkboxSelector: "#web_cookie_cookie_restriction_inherit",
              actionSelector: "#web_cookie_cookie_restriction",
              actionType: "select",
              value: "1",
            },
          ],
        });
      })
      .then(() => {
        // Cookie Path: /
        cy.get(variables.menuConfigGeneralWebCookiePathSelector)
          .clear({ force: true })
          .type(variables.cookiePath, { force: true })
          .get(variables.menuConfigGeneralWebCookieDomainSelector)
          .clear({ force: true })
          .type(variables.cookieDomain, { force: true });
      })
      .get(variables.saveButton)
      .click({ force:true});
  });
```
The script made for this scenario starts by selecting the General setting, then the specific Web section of the settings. We chain the helper function to this, we append multiple properties to the helper function so we can preform more than 1 setting change while only calling the function once. After the helper function we will save the settings. After all the settings we need to change have been changed we save the settings.

### Catalog Catalog SEO

First we present the whole script and then we break each component down, and explain the choices behind the approach

**The script**
```javascript
  it("Changes Stores > Configuration > Catalog > Catalog > Search Engine Optimization", function () {
    // Select the Catalog Options
    cy.get(variables.menuConfigCatalogSelector)
      .click({ force: true })
      .get(variables.menuConfigCatalogCatalogSelector)
      .click({ force: true })
      .then(() => {
        theOneFunctionToRuleThemAll({
          checkboxes: [
            {
              checkboxSelector: "#catalog_seo_product_url_suffix_inherit",
              actionSelector: "#catalog_seo_product_url_suffix",
              actionType: "clear",
            },
            {
              checkboxSelector: "#catalog_seo_category_url_suffix_inherit",
              actionSelector: "#catalog_seo_category_url_suffix",
              actionType: "clear",
            },
          ],
        });
      })
      .get(variables.saveButton)
      .click({ force:true})
      .get(variables.systemSelector)
      .click({ force: true })
      .get(variables.systemCacheSelector)
      .click({ force: true })
      .get(variables."#flush_magento > span")
      .click({ force:true});
  });
```
The script made for this scenario starts by selecting the Catalog setting, then the specific Catalog section of the settings. We chain the helper function to this, we append multiple properties to the helper function so we can preform more than 1 setting change while only calling the function once. After the helper function we will save the settings. After all the settings we need to change have been changed we save the settings.

### User Role Creation

First we present the whole script and then we break each component down, and explain the choices behind the approach

**The script**
```javascript
  it("Creates the user role 'Store Owner'", function () {
    // Click on system
    cy.get(variables.systemSelector)
      .click({ force: true })
      .get(variables.systemUserRoleSelector)
      .click({ force: true })
      .get(variables.systemUserRoleAddSelector)
      .wait(500)
      .click({ force: true })
      .get(variables.systemUserRoleAddRoleNameSelector)
      .clear()
      .type(variables.userRoleName)
      .get(variables.systemUserRoleAddRolePasswordSelector)
      .clear()
      .type(variables.password)
      .get(variables.systemUserRoleResourcesSelector)
      .click({ force: true })
      .get(variables.systemUserRoleCustomSelector)
      .select("0", { force: true })
      .get(".jstree-no-dots > li")
      .each(($checkbox) => {
        const isOpened = $checkbox.hasClass("jstree-closed");
        const isChecked = $checkbox.hasClass("jstree-checked");
        if (!isOpened && !isChecked) {
          cy.wrap($checkbox).find("> a").click({ force: true }); // Click on the checkbox's label
        } else if (isOpened) {
          cy.wrap($checkbox)
            .find("> ins.jstree-icon")
            .click({ multiple: true }) // Click on the checkbox's icon to open it
            .find("> a")
            .click({ force: true});
        }
      })
      .then(() => {
        for (let i = 0; i < variables.disableSettingsArr.length; i++) {
          cy.get(variables.disableSettingsArr[i]).click({ force: true });
        }
      });
      .get(variables.saveButton)
      .click({ force:true});
  });
```
The script made for this scenario starts by selecting the System setting in the side bar, then the specific User Roles section of the settings. When we are on the User Roles page we click on the button to add a new user, we fill out the required form that needs a Role name and the password of the account that is currently logged in. After that we need to disable some specific settings for the Store Owner Role, there is a list of things to Store Owner Role shouldn't see in the admin panel. The list: <a href="https://webfant.atlassian.net/browse/HI-229" target="_blank">HI-229 | Magento admin user roles</a>. After all the settings we need to change have been changed we save the settings.