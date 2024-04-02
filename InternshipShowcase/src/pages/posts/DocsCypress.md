---
layout: ../../layouts/MDLayout.astro
title: 'Cypress Docs'
subtitle: 'Cypress usage Documentation'
---

<h2 align="left" style="color: #ff0029;">Table of Contents</h2>

- [Requirements](#requirements)
- [Steps](#steps)  
    - [config](#config)
    - [E2E Testing](#e2etesting)

<br>
<h2 align="left" id="requirements" style="color: #ff0029;">Requirements</h2>

npm install
```terminal
cd /your/project/path
npm init
npm install cypress --save-dev
```

<br>

<h2 align="left" id="steps" style="color: #ff0029;">Steps</h2>

### Lets start by opening the app
```terminal
npx cypress open
```

We can also add a custom npm script to acces the app
```json
{
    "scripts": {
        "cy:open": "cypress open",
    }
}
```

Now we can enter in the terminal:
```terminal
npm run cy:open
```

<br>

### Choosing a testing type

<br>

We will choose E2E testing (End 2 end testing). Cypress will automaticly scaffold out a set of configuration files appropriate to your chosen test type.

<br>

### Chosing a browser
<br>

We will select Electron so we don't need to log in to anything.

<br>

<h3 align="left" id="config" style="color: #ff0029;"><strong>Editing the config file</strong></h3>
Now that we have the basics set up we can dive in the config file of cypress and add some things to make our life a lot better.

```js
module.exports = defineConfig({
    defaultCommandTimeout: 10000,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 0,
    e2e: {
        experimentalStudio: true,
        viewportHeight: 794,
        viewportWidth: 1440,
    }
})
```
<br>

### DefaultCommandTimeout
What does this do? This is the time cypress will wait for the DOM based commands are considered timed out. The default amount is 4000 miliseconds > 4 seconds. Sometimes this is too short so make the waiting time 10000 miliseconds > 10 seconds.

<br>

### ExpirimentalMemoryManagement
Enables support for improved memory management within Chromium-based browsers. Default is false.

<br>

### NumTestsKeptInMemory
The number of tests for which snapshots and command data are kept in memory. numTestsKeptInMemory is set to 50 by default during cypress open and set to 0 by default during cypress run. Reduce this number if you are experiencing high memory consumption in your browser during a test run. We set the default amount to be 0 so no tests are kept in memory.

<br>

<h2 align="left" id="e2etesting" style="color: #ff0029;">E2E Testing</h2>

<br>

### ExperimentalStudio
Cypress Studio provides a visual way to generate tests within Cypress, by recording interactions against the application under test. This is still experimental so every test made this way needs to be verified by the creator to make sure it was made correctly. When creating a test this way no assertions are created. So they have to be created mannualy.

<br>

### Making our first test
Visit a webpage
```js
describe('Cypress Test', function() {
    it('Visits the kitchen sink from cypress', function() {
        // Telling cypress to visit the specified URL.
        cy.visit('https://example.cypress.io');
    });
});
```
Query for an element in a webpage
```js
describe('Cypress Test', function() {
    it('Visits the kitchen sink from cypress', function() {
        // Telling cypress to visit the specified URL.
        cy.visit('https://example.cypress.io');

        // Searching for an element in the webpage
        cy.contains('type');
    });
});
```

Click an element
```js
describe('Cypress Test', function() {
    it('Visits the kitchen sink from cypress', function() {
        // Telling cypress to visit the specified URL.
        cy.visit('https://example.cypress.io');

        // Searching for an element in the webpage
        // And click on the element
        cy.contains('type').click();
    });
});
```

Making an assertion
```js
describe('Cypress Test', function() {
    it('Visits the kitchen sink from cypress', function() {
        // Telling cypress to visit the specified URL.
        cy.visit('https://example.cypress.io');

        // Searching for an element in the webpage
        // And click on the element
        cy.contains('type').click();

        // Assert that we are on the correct URL
        // The url should include: '/commands/actions'
        cy.url().should('include', '/commands/actions');
    });
});
```

Adding more commands and assertions
```js
describe('Cypress Test', function() {
    it('Visits the kitchen sink from cypress', function() {
        // Telling cypress to visit the specified URL.
        cy.visit('https://example.cypress.io');

        // Searching for an element in the webpage
        // And click on the element
        cy.contains('type').click();

        // Assert that we are on the correct URL
        // The url should include: '/commands/actions'
        cy.url().should('include', '/commands/actions');

        // Getting an input, and type into it
        // We can get elements based on the CSS class
        cy.get('.action-email').type('fake@email.com');

        // Verify that the value has been updated
        // Since we check an input field it is stored in a value
        cy.get('.action-email').should('have.value', 'fake@email.com');
    });
});
```
<br>


We can also created more then one test in a file

<br>

This will first visit the url, Succeed the test and start on the second test.
```js
describe('Cypress Test', function() {
    it('Visits the kitchen sink from cypress', function() {
        // Telling cypress to visit the specified URL.
        cy.visit('https://example.cypress.io');
    });

    it('Visit the kitchen sink and execute some commands and assertions', function() {
        // Visit the URL
        cy.visit('https://example.cypress.io');

        // Searching for an element in the webpage
        // And click on the element
        cy.contains('type').click();

        // Assert that we are on the correct URL
        // The url should include: '/commands/actions'
        cy.url().should('include', '/commands/actions');

        // Getting an input, and type into it
        // We can get elements based on the CSS class
        cy.get('.action-email').type('fake@email.com');

        // Verify that the value has been updated
        // Since we check an input field it is stored in a value
        cy.get('.action-email').should('have.value', 'fake@email.com');
    });
});
```

<br>

Executions to be made before each test

<br>


Sometimes we need to preform the same action before each test. This would be a lot of work to mannually add this to every test. So thats where the `beforeEach()` function comes in.

<br>

```js
describe('Cypress test with beforeEach', function() {
    beforeEach('It will do this before every test', function() {
        cy.visit('https://example.cypress.io');
    })

    it('Looks for the element "type"', function() {
        cy.contains('type');
    });

    it('Looks for the element and clicks it', function() {
        cy.contains('type').click();
    });
});
```
<br>

We can also use default javascript in the test to make things easier for us.

<br>

Lets say that we need to check 20 items. We can write 20 lines of code to check it or we can use a for loop.
```js
describe('Opening and closing 20 elements', function() {
    beforeEach('visiting the homepage', function() {
        cy.visit('https://example.cypress.io');
    });

    it('Loops over some things', function() {
        // NOTE this is not on the kitchen sink from cypress
        // This is just an example
        for (let i =0; i < 20; i++) {
        // Based on the index of the for loop
        // it will open the item in the ui-accordion
        cy.get("#ui-accordion-6-header-" + i + " > .trigger")
          .wait(500)
          .click();

        // After opening it, it will close the same item.
        cy.get("#ui-accordion-6-header-" + i + " > .trigger")
          .wait(500)
          .click();
        }
    })
});
```

<br>

We could also implement an array to loop through
```js
const arrayNames = [
    "Test0",
    "Test1",
    "Test2",
    "Test3",
    "Test4",
]

describe('Opening and closing 20 elements', function() {
    beforeEach('visiting the homepage', function() {
        cy.visit('https://example.cypress.io');
    });

    it('Loops over some things', function() {
        // NOTE this is not on the kitchen sink from cypress
        // This is just an example
        for (let i =0; i < arrayNames.length; i++) {
            // Based on the index it will search for the indexed item in the array
            cy.get("#search").wait(500).type(arrayNames[i]);

            // Clear the search bar for the next search input.
            cy.get("#search").wait(500).type("{selectall}{backspace}");
        }

        // It will search for every item in the array we just made
    })
});
```

<br>

### One big file
When you have one big test file, there can be an instance that the test fails for some reason. That is not what you want to see ofcourse. So lets make an isolation test file.

<br>

```js
describe('Isolation testing', function() {
    beforeEach('Visit the specified URL', function() {
        cy.visit('~Specified URL~');
    });

    // Paste the test that needs to be executed in isolation.
});
```

<br>

In this file we can paste the test that needs to be reran below the comment. This file should only contain the failed tests that need to be reran. We created this file for the reason that there are no other tests that we need to wait for.

<br>

### Checklist for testing (HIVE)

<br>

When testing the HIVE we can make one standard test that we will use for every website launched off the HIVE dashboard. Since the sites will use the same build up elements we can test every page with just one test.

<br>

**NOTE**
> - Check if the classes will be the same "name" in the different layouts
> - Check if the IDs will be the same "name" in the different layouts