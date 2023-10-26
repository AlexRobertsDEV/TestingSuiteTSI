import 'cypress-wait-until';

//THIS CONTROLS WHICH STAGING YOU'LL BE TESTING IN!!!!
const baseURL = 'https://ap-release.tsitest.app';


describe('Create Site Tool', () => {
  beforeEach(() => {
    // Set the desired viewport size before each test
    cy.viewport(1280, 720); // Adjust the values according to your needs

    //Feature Flag Pin For The Online Mode
    cy.visit(baseURL);

    //The Feature Flag To Bypass Microsoft Verification
    cy.visit(baseURL + '?ff=authHandler:laravel');

    //Verify You're On The Correct Login
    cy.get('.text-center').contains('Log into Campfire');

    //Enter Username
    cy.get('input[placeholder="Username or Email"]').type('alex.roberts@townsquareinteractive.com');

    //Enter Password
    cy.get('input[placeholder="Password"]').type('Orange9!');

    //Click The Sign-In Button
    cy.get('body > div > tsi-admin-portal > div > div.container-fluid.tsi-ap-container > div.ng-scope > ui-view > div > div > div > div > div > div > div.panel-body > tsi-authentication > div.login-form > form > div:nth-child(5) > div > button').click();

    // Asserting the presence of a unique element and checking its placeholder attribute
    cy.get('input[placeholder="Search by GPID, Company Name, Email Address, or Phone Number"]', { timeout: 10000 })
      .should('be.visible') // Ensure the element is visible
      .and('have.attr', 'placeholder', 'Search by GPID, Company Name, Email Address, or Phone Number');


  });

  const companies = [
    // { gpid: 'TI PHARMA001Z', name: 'Pharmaceutical Services FAKE' },
    // { gpid: 'TI PARTNE001Z', name: 'Partners Pacific FAKE' },
    // { gpid: 'TI CONSTR001Z', name: 'Construction Health FAKE' },
    // { gpid: 'TI LIGUE1002Z', name: 'Ligue 1 Associates FAKE' },
    { gpid: 'TI ENERGI003Z', name: 'Energies Atlantic FAKE' },
    // { gpid: 'TI FUNDIN003Z', name: 'Funding Transportation FAKE' },
    // { gpid: 'TI PARTNE002Z', name: 'Partners Funding FAKE' },
    // { gpid: 'TI BUNDES003Z', name: 'Bundesliga Media FAKE' },
    // { gpid: 'TI LIGUE1003Z', name: 'Ligue 1 Innovations FAKE' }
  ];


  companies.forEach(company => {
    it(`Search and verify ${company.gpid}`, () => {
      // Set up network request interception
      // cy.intercept('GET', '/laravel/api/v1/public/admin-portal/settings').as('getSettings');
      // cy.intercept('GET', `/laravel/api/v1/admin-portal/finance/clients?cacheStrategy=fallback&contract=all&gpid=${company.gpid}&includeIgniteClients=false`).as('getFinanceClients');
      // cy.intercept('GET', '/laravel/api/v2/resources/site-templates?type=duda').as('getSiteTemplates');
      // cy.intercept('GET', '/laravel/api/v2/resources/clients?searchString=TI%20ENERGI003Z').as('searchClients');
      // cy.intercept('GET', '/laravel/api/v1/admin-portal/service-turn-time').as('getServiceTurnTime');
      // cy.intercept('POST', '/laravel/api/v2/resources/create-site').as('postCreateSite');


      cy.visit(baseURL + '/client-search-v2?ff=authHandler:laravel');

      // Ensure the input is visible and interactable before typing
      cy.get('input[placeholder="Search by GPID, Company Name, Email Address, or Phone Number"]')
        .should('be.visible')
        .clear()
        .type(company.gpid);

      // Click the search button
      cy.get('.tsi-ap--client-search-2 button[title="Search"]')
        .should('be.visible')
        .click();

      // Ensure the result is present and contains the expected company name
      cy.get('.tw-grid .tw-flex h5[title="Company Name"]', { timeout: 10000 })
        .should('exist')
        .and('contain', company.name);

      // Find the element you want to hover over
      cy.get('.tw-bg-base-50')
        .first() // Ensure we're working with the first matching element if there are multiple
        .invoke('show') // This is a workaround as Cypress doesn't support hover state
        .trigger('mouseover'); // This is another workaround for hovering

      // Wait for the transition to complete (adjust the time as per your transition duration)
      cy.wait(1000);


      // Now click the 'Create Site' button
      cy.get('.tw-bg-base-50 button[title="Create Site"]')
        .should('be.visible')
        .click();


      // Wait for the XHR requests to complete

      // //1 
      // // https://staging005.townsquareinteractive.com/laravel/api/v1/public/admin-portal/settings
      // cy.wait('@getSettings');

      // //2
      // // https://staging005.townsquareinteractive.com/laravel/api/v1/admin-portal/finance/clients?cacheStrategy=fallback&contract=all&gpid=TI+ENERGI003Z&includeIgniteClients=false
      // cy.wait('@getClientsFinance');

      // //3
      // // https://staging005.townsquareinteractive.com/laravel/api/v2/resources/site-templates?type=duda
      // cy.wait('@getSiteTemplates');

      // //4
      // // https://staging005.townsquareinteractive.com/laravel/api/v2/resources/clients?searchString=TI%20ENERGI003Z
      // cy.wait('@getClientsResources');

      // //5
      // // https://staging005.townsquareinteractive.com/laravel/api/v1/admin-portal/service-turn-time
      // cy.wait('@getServiceTurnTime');

      // //6
      // // https://staging005.townsquareinteractive.com/laravel/api/v2/resources/site-templates?type=duda
      // cy.wait('@getSiteTemplates');


      // Verify the input exists once the page loads
      cy.get('.tsi-ap--client-search-2 input[placeholder="Search by template name"]', { timeout: 10000 }).should('exist');

      const templateSearchTermsArray = [
        'LifeStyle',
        'LOCKSMITH',
        'Carpenter',
        'Architect',
        'Gardener',
        'Musician',
        'Academic',
        'Accountant',
        'Painter',
        'Life Coach',
        'Nutrion Advisor',
        'Real Estate',
        'Car Dealer',
        'Real Estate Agency',
        'Lead Generation Landing Page'
      ];

      // Pick a random term from the array
      const randomSearchTerm = templateSearchTermsArray[Math.floor(Math.random() * templateSearchTermsArray.length)];

      // Ensure the input is visible and interactable before typing
      cy.get('input[placeholder="Search by GPID, Company Name, Email Address, or Phone Number"]')
        .should('be.visible')
        .clear()
        .type(randomSearchTerm);

      cy.pause();

      cy.get('.tw-grid .tw-flex h6')
        .contains(randomSearchTerm)
        .should('exist')
        .parent('.tw-bg-base-50')
        .trigger('mouseover')
        .within(() => {
          cy.get('button[title="Create"]')
            .click();
        });

      /*!!!!!!!!!!TEST CONDITIONS THAT NEED TO BE MET!!!!!!!!!!!*/

      /*Template Matches The Template Selected*/
      cy.get('.tsi-ap-ui-bs4 .tw-bg-base-50 .tw-p-9 h5', { timeout: 10000 })
        .should('exist')
        .and('contain', randomSearchTerm);

      /*Company Name Matches*/
      cy.get('.tsi-ap-ui-bs4 .tw-bg-base-50 .tw-p-9 h4', { timeout: 10000 })
        .should('exist')
        .and('contain', company.name);

      /*Subdomain Name Field Exist*/
      // Normalizing and concatenating strings
      const normalizedCompanyName = company.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const normalizedSearchTerm = randomSearchTerm.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const subdomain = `${normalizedCompanyName}${normalizedSearchTerm}`;

      // Logging the generated subdomain for verification
      cy.log('Generated Subdomain:', subdomain);

      // Subdomain Name Field
      cy.get('input[placeholder="Subdomain Name"]', { timeout: 10000 })
        .should('be.visible')
        .clear()
        .type(subdomain)
        .then(() => {
          // You can add additional checks here if necessary
          cy.log('Subdomain entered:', subdomain);
        });

      /*Create Site Button Should Exist*/
      cy.get('.tw-bg-base-50 .tw-border-t button:last-of-type', { timeout: 10000 })
        .should('be.visible')
        .and('contain', 'Create Site')
        .click();

      //POST REQUEST TO CREATE SITE  
      cy.wait('@postCreateSite').then((interception) => {
        const payload = interception.request.body;

        // Store entire payload as an alias
        cy.wrap(payload).as('payload');

        // Store each key-value pair in the payload as an alias
        Object.entries(payload).forEach(([key, value]) => {
          cy.wrap(value).as(key);
        });
      });

      // Later in your test, you can access the stored values using cy.get()
      cy.get('@payload').then((payload) => {
        cy.log('Entire Payload:', payload);
      });

      /*!!!!!!!!!!TEST CONDITIONS THAT NEED TO BE MET!!!!!!!!!!!*/


      cy.pause();


    });
  });



});