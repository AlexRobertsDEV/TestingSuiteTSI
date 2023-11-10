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
    cy.get('h3.text-center').should('contain.text', 'Log into')
      .and('contain.text', 'Client Admin Portal');


    //Enter Username
    cy.get('input[placeholder="Username or Email"]').type('alex.roberts@townsquareinteractive.com');

    //Enter Password
    cy.get('input[placeholder="Password"]').type('Orange9!');

    //Click The Sign-In Button
    cy.get('.login-form button').should('contain.text', 'Log In').click();

    // Asserting the presence of a unique element and checking its placeholder attribute
    cy.get('input[placeholder="Search by GPID, Company Name, Email Address, or Phone Number"]', { timeout: 10000 })
      .should('be.visible') // Ensure the element is visible
      .and('have.attr', 'placeholder', 'Search by GPID, Company Name, Email Address, or Phone Number');


  });

  const companies = [
    { gpid: 'TI PHARMA001Z', name: 'Pharmaceutical Services FAKE' },
    { gpid: 'TI PARTNE001Z', name: 'Partners Pacific FAKE' },
    { gpid: 'TI CONSTR001Z', name: 'Construction Health FAKE' },
    { gpid: 'TI LIGUE1002Z', name: 'Ligue 1 Associates FAKE' },
    { gpid: 'TI ENERGI003Z', name: 'Energies Atlantic FAKE' },
    { gpid: 'TI FUNDIN003Z', name: 'Funding Transportation FAKE' },
    { gpid: 'TI PARTNE002Z', name: 'Partners Funding FAKE' },
    { gpid: 'TI BUNDES003Z', name: 'Bundesliga Media FAKE' },
    { gpid: 'TI LIGUE1003Z', name: 'Ligue 1 Innovations FAKE' }
  ];


  companies.forEach(company => {
    it(`Search and verify ${company.gpid}`, () => {
      // Set up network request interception
      cy.intercept('GET', '/laravel/api/v2/resources/site-templates?type=duda').as('getSiteTemplates');
      cy.intercept('GET', '/laravel/api/v1/admin-portal/service-turn-time').as('getServiceTurnTime');
      cy.intercept('POST', '/laravel/api/v2/resources/create-site').as('postCreateSite');


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

      // cy.visit('https://ap-release.tsitest.app/client/TI%20FUNDIN003Z/create-site?ff=authHandler:laravel', { timeout: 10000 });


      // cy.pause();
      
      // Now click the 'Create Site' button
      cy.get('.tw-bg-base-50 button[title="Create Site"]')
        .should('be.visible')
        // .click();

      cy.visit(`${baseURL}/client/${encodeURIComponent(company.gpid)}/create-site?ff=authHandler:laravel`, { timeout: 10000 });


      // Wait for the XHR requests to complete
      // cy.wait('@getFinanceClients');
      // cy.wait('@searchClients');
      cy.wait('@getSiteTemplates');
      cy.wait('@getServiceTurnTime');


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
        'Nutrition Advisor',
        'Real Estate',
        'Car Dealer',
        'Real Estate Agency',
        'Lead Generation Landing Page'
      ];

      // Pick a random term from the array
      const randomSearchTerm = templateSearchTermsArray[Math.floor(Math.random() * templateSearchTermsArray.length)];

      // Ensure the input is visible and interactable before typing
      cy.get('input[placeholder="Search by template name"]')
        .should('be.visible')
        .clear()
        .type(randomSearchTerm);



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

      cy.get('@payload').then((payload) => {
        cy.log('Entire Payload:', payload);
      });

      cy.visit(`${baseURL}/client/${encodeURIComponent(company.gpid)}/website-domain-mapping?ff=authHandler:laravel`, { timeout: 10000 }); 
      
      const domainMappingPrimaryCheckUrl = `${subdomain}.townsquareinteractive.com`;

      
      cy.checkStringInElement('tsi-website-domain-mapping-websites md-input-container .ng-binding', domainMappingPrimaryCheckUrl);

      /*!!!!!!!!!!TEST CONDITIONS THAT NEED TO BE MET!!!!!!!!!!!*/

    });
  });



});
