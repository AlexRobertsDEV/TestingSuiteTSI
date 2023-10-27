// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-file-upload';

Cypress.Commands.add('waitForLoadingAndSelect', (loadingSelector, selectSelector, timeout = 1000000) => {
    // Ensure the loading element exists and is visible
    cy.get(loadingSelector, { timeout: timeout }).should('exist').and('be.visible');
  
    // Wait for the loading element to not be visible
    cy.get(loadingSelector, { timeout: timeout }).should('not.exist');
  
    // Wait for the select element to be visible
    cy.get(selectSelector, { timeout: timeout }).should('be.visible');
  });


  Cypress.Commands.add('confirmNoLoadScreen', (loadingSelector, selectSelector, timeout = 1000000) => {
    // Wait for the loading element to not be visible
    cy.get(loadingSelector, { timeout: timeout }).should('not.exist');
  
    // Wait for the select element to be visible
    cy.get(selectSelector, { timeout: timeout }).should('be.visible');
  });
  
  Cypress.Commands.add('clickCompanyButton', (companyName) => {
    const companyNameForContract = `complete registration for ${companyName}`;
    cy.get(`button[aria-label="${companyNameForContract}"]`)
      .should('exist')
      .click();
  });
  
  Cypress.Commands.add('waitForVisibleAndInteract', (selector, action, value) => {
    cy.get(selector, { timeout: 10000 })
      .should('be.visible')
      .scrollIntoView()
      .then(($el) => {
        if (action === 'type') {
          cy.wrap($el).type(value);
        } else if (action === 'click') {
          cy.wrap($el).click();
        }
        // Add other actions as needed
      });
  });
  
  Cypress.Commands.add('getInputValue', (selector) => {
    cy.get(selector)
      .invoke('val')
      .then((value) => {
        cy.log('Input Value: ' + value);
        return cy.wrap(value);
      });
  });

  Cypress.Commands.add('checkStringInElement', (selector, textToCheck) => {
    cy.get(selector).each(($el) => {
      const text = $el.text();
      if (text.includes(textToCheck)) {
        expect(text).to.include(textToCheck);
      }
    });
  });
  

//   Cypress.Commands.add('uploadFileWithRetry', (selector, fileName, fileCheckSelector, maxRetries = 3) => {
//     const attemptUpload = (retryCount) => {
//       if (retryCount >= maxRetries) {
//         cy.log('Max upload retries reached');
//         return;
//       }
  
//       cy.get(selector).attachFile(fileName, { subjectType: 'drag-n-drop' });
  
//       cy.get(fileCheckSelector, { timeout: 5000 })
//         .should('be.visible')
//         .then(() => {
//           cy.log('File uploaded successfully');
//         })
//         .catch(() => {
//           cy.log('File not uploaded, retrying...');
//           attemptUpload(retryCount + 1);
//         });
//     };
  
//     attemptUpload(0);
//   });
  