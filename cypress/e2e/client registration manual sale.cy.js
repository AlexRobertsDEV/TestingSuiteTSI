//THIS CONTROLS WHICH STAGING YOU'LL BE TESTING IN!!!!
const BASE_URL = 'https://staging7.townsquareinteractive.com/tsi/admin/portal/';

/*---------------------------------------------------------------------------------------------------------------------------------------------------------*/
describe('Client Registration Manual Sale', () => {
  beforeEach(() => {
    // Set the desired viewport size before each test
    cy.viewport(1280, 720); // Adjust the values according to your needs
  });

  it('Gets, types and asserts', () => {

/*----------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
    /*!!!!!!!LOGGING INTO AP!!!!!!!!!!*/

    //Feature Flag Pin For The Offline Mode
    cy.visit(BASE_URL + '?ff=pin:offlineGpMode:0');

    //The Feature Flag To Bypass Microsoft Verification
    cy.visit(BASE_URL + '?ff=authHandler:laravel');

    //Verify You're On The Correct Lo
    cy.get('.text-center').contains('Log into Campfire');

    //Enter Username
    cy.get('input[placeholder="Username or Email"]').type('amanda.johnson@townsquareinteractive.com');

    //Enter Password
    cy.get('input[placeholder="Password"]').type('password123');

    //Click The Sign-In Button
    cy.get('body > div > tsi-admin-portal > div > div.container-fluid.tsi-ap-container > div.ng-scope > ui-view > div > div > div > div > div > div > div.panel-body > tsi-authentication > div.login-form > form > div:nth-child(5) > div > button').click();

     /*!!!!!!!LOGGING INTO AP!!!!!!!!!!*/

/*---------------------------------------------------------------------------------------------------------------------------------------------------------*/      
    /*!!!!!!!NAVIGATING TO THE SALESDASHBOARD!!!!!!!!!!*/

    //Pass| Fail to prove you're on the right page
    cy.get('input[placeholder="Search by GPID, Company Name, Email Address, or Phone Number"]');

    //Click the Sales Dashboard Button
    cy.get("a[ui-sref='tsi.ap.sales.dashboard']").click();

    //cy.pause();

    //Click the Manual Sales Entry Button
    cy.get('button.btn.btn-gray-200.btn-block.rounded-pill.py-2').contains('Manual Sales Entry').click();
    
    //Just a heads up...things tend to break here due to AP getting stuck in a loading loop.
    //Demo of the issue: https://gyazo.com/ce78a0df93362562a50ce8508be445c1

     //cy.pause();
    
     /*!!!!!!!NAVIGATING TO THE SALESDASHBOARD!!!!!!!!!!*/

/*----------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
    /*!!!!!!!SALES SETTINGS!!!!!!!!!!*/

    // Select Client Type
    cy.get('md-select[aria-label="Client Type"]').click();
    cy.get('md-option#select_option_11').click();

    // Select Appointment Type
    cy.get('md-select[aria-label="Appointment Type"]').click();
    cy.get('md-option#select_option_17').click();

    // Salesperson Name
    cy.get("button.ng-scope[aria-label='Clear Input']").click();
    cy.get('input[aria-label="Salesperson"]').type('Alex Roberts');
    cy.get('#md-option-1-0').click();

    /*!!!!!!!SALES SETTINGS!!!!!!!!!!*/

/*----------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
    /*!!!!!!!FAKE CLIENT INFO GENERATION!!!!!!!!!!*/
    // Generate A Random Company Name
    const companyName = generateRandomCompanyName();

    //Type Random Company Name
    cy.get('input[name="order.checkout.client.company.name"]').type(companyName);

    // Random Company Name 
    function generateRandomCompanyName() {
      const words = ['Unlimited', 'Alpha', 'A1', 'Digital', 'Interactive', 'Tech', 'Solutions', 'Services', 'Innovations', 'Global', 'Systems', 'Enterprise', 'Atlantic', 'Pacific', 'American', 'Corporation', 'United', 'Universal', 'LLP', 'Funding', 'National', 'Associates', 'International', 'Financial','Property Trust', 'Partners','Health Resources', 'Consulting', 'Technologies','State','Health','Union', 'Bank', 'Mutual', 'Express', 'Group', 'USA','Agricultural','Mobil','Motor','Electronics','Energies','Platforms','Holdings', 'Major','La Liga','Serie A', 'Primeira','Eredivisie','Ligue 1','Bundesliga','Premier','Agriculture','Basic Metal','Chemical','Commerce','Construction','Education','Financial','Advertising','Marketing','Aerospace','Energy','Entertainment','Fashion','Hospitality','Manufacturing','Media','News','Mining','Pharmaceutical','Telecommunication','Transportation','Food Service','Janitorial','Trucking','Landscaping','Automotive','Repair','Maintenance','Insurance'];
      const randomIndex1 = Math.floor(Math.random() * words.length);
      const randomIndex2 = Math.floor(Math.random() * words.length);
      const companyName = words[randomIndex1] + ' ' + words[randomIndex2] + ' FAKE';
      return companyName;
    }

    // Random Client Names + Email 
    const randomClientNames = ['Ramsay Bolton','Hodor Wylis','Samwell Tarly','Bronn Blackwater','Petyr Littlefinger Baelish','Lyanna Mormont','Melisandre Asshai ','Sansa Stark','Varys Targaryen','Oberyn Martell','Daenerys Targaryen','Podrick Payne','Olenna Tyrell','Ned Stark','Brienne Tarth','Tyrion Lannister','Joffrey Baratheon','Jaime Lannister','Arya Stark','Cersei Lannister','Theon Greyjoy','Yara Greyjoy','Robert Baratheon','Robb Stark','Margaery Tyrell','Catelyn Stark','Jorah Mormont','Bran Stark','Lord Varys','Tywin Lannister','Sandor Clegane','Tormund Giantsbane','Jon Snow','Lyonel Strong','Rhaenys Targaryen','Aegon Targaryen','Ser Criston Cole','Larys Strong','Viserys Targaryen','Daemon Targaryen','Otto Hightower','Rhaenyra Targaryen','Alicent Hightower','Aemond Targaryen','Corlys Velaryon','Harrold Westerling','Erryk Cargyll','Laena Velaryon','Helaena Targaryen','Aemma Arryn','Jaehaerys Targaryen','Tyland Lannister','Vaemond Velaryon','Jason Lannister'];
    const [firstName, lastName] = getRandomCharacterNames(randomClientNames);

   
    // Type In Random First Name & Last Name
    cy.get("input[name='order.checkout.client.first_name']").type(firstName);
    cy.get("input[name='order.checkout.client.last_name']").type(lastName);

    // Random email generation using first name and last name
    const randomEmail = generateRandomEmail(firstName, lastName);

    //Type in random email and confirm it
    cy.get("input[name='order.checkout.client.email_address']").type(randomEmail);
    cy.get("input[name='order.checkout.client.email_address_confirmation']").type(randomEmail);

    // Function to get random character names from the array
    function getRandomCharacterNames(characterNames) {
      const randomIndex1 = Math.floor(Math.random() * characterNames.length);
      let randomIndex2;
      do {
        randomIndex2 = Math.floor(Math.random() * characterNames.length);
      } while (randomIndex2 === randomIndex1);
      const name1 = characterNames[randomIndex1];
      const name2 = characterNames[randomIndex2];
      return [name1.split(' ')[0], name2.split(' ')[1]];
    }

    // Random email generation using first name and last name
    function generateRandomEmail(firstName, lastName) {
      const emailProvider = ['zmail.com', 'kazoo.com', 'coldmail.com', 'introvertlook.com', 'citycircle.com'];
      const randomIndex = Math.floor(Math.random() * emailProvider.length);
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailProvider[randomIndex]}`;
      return email;
    }
    /*!!!!!!!FAKE CLIENT INFO GENERATION!!!!!!!!!!*/

/*----------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
    /*!!!!!!!SERVICE AGREEMENT!!!!!!!!!!*/

    // Select Deal Type
    cy.get("md-select[name='order.checkout.products']").click();
    cy.get('md-option#select_option_34').click();

    // Select Sales Channel Type
    cy.get("md-select[name='order.checkout.sale.channel']").click();
    cy.get('md-option#select_option_46').click();

    // Select Sale Relation Type
    cy.get("md-select[name='order.checkout.sale.relation']").click();
    cy.get('md-option#select_option_50').click();

     // TSI Package
     cy.get('md-select[name="order.tsi.cost.input.marketing_package"]').click();
     cy.get('md-option#select_option_58').click();


    // Extra Directory Listings
    cy.get('input[name="order.tsi.cost.input.num_extra_directory_listings"]').clear().type('0');
 
    /*!!!!!!!SERVICE AGREEMENT!!!!!!!!!!*/

 /*----------------------------------------------------------------------------------------------------------------------------------------------------------*/    
    /*Feature Additions...just a heads up this might be VERY brittle...but this is the only way to select things for this part.*/
    
    //Click Yes
    cy.get('#sales-registration-v2-portal > form > md-content > div.form-body.layout-align-center-stretch.layout-row > div > tsi-client-registration-v2-service-agreement-step > div > tsi-client-registration-v2-tsi-checkout > div > tsi-client-registration-v2-tsi-marketing-package-controls > div > tsi-client-registration-v2-tsi-marketing-package-settings-controls > div > div.ng-scope.flex.md-block > tsi-client-registration-v2-tsi-townsquare-app-step > div > div.card.mb-5 > div.card-footer.bg-gray-100.p-5 > div.card.shadow-sm.mb-4 > div > div > div.col.p-5 > div > div.col-12.col-md-3.col-lg-2.text-lg-right > div > button.btn.btn-light.w-100').click();
     
    //Click Next Once
    cy.get('#sales-registration-v2-portal > form > md-content > div.form-body.layout-align-center-stretch.layout-row > div > tsi-client-registration-v2-service-agreement-step > div > tsi-client-registration-v2-tsi-checkout > div > tsi-client-registration-v2-tsi-marketing-package-controls > div > tsi-client-registration-v2-tsi-marketing-package-settings-controls > div > div.ng-scope.flex.md-block > tsi-client-registration-v2-tsi-townsquare-app-step > div > div.card.mb-5 > div.card-footer.bg-gray-100.p-5 > div.row.justify-content-between > div.col-12.col-md-4.col-lg-3.mb-4.mb-md-0 > div > button.rounded.btn.btn-gray-700.w-100.mx-1').click();
     
    //Click Next Twice
    cy.get('#sales-registration-v2-portal > form > md-content > div.form-body.layout-align-center-stretch.layout-row > div > tsi-client-registration-v2-service-agreement-step > div > tsi-client-registration-v2-tsi-checkout > div > tsi-client-registration-v2-tsi-marketing-package-controls > div > tsi-client-registration-v2-tsi-marketing-package-settings-controls > div > div.ng-scope.flex.md-block > tsi-client-registration-v2-tsi-townsquare-app-step > div > div.card.mb-5 > div.card-footer.bg-gray-100.p-5 > div.row.justify-content-between > div.col-12.col-md-4.col-lg-3.mb-4.mb-md-0 > div > button.rounded.btn.btn-gray-700.w-100.mx-1').click();
    
    //Click Next Thrice
    cy.get('#sales-registration-v2-portal > form > md-content > div.form-body.layout-align-center-stretch.layout-row > div > tsi-client-registration-v2-service-agreement-step > div > tsi-client-registration-v2-tsi-checkout > div > tsi-client-registration-v2-tsi-marketing-package-controls > div > tsi-client-registration-v2-tsi-marketing-package-settings-controls > div > div.ng-scope.flex.md-block > tsi-client-registration-v2-tsi-townsquare-app-step > div > div.card.mb-5 > div.card-footer.bg-gray-100.p-5 > div.row.justify-content-between > div.col-12.col-md-4.col-lg-3.mb-4.mb-md-0 > div > button.rounded.btn.btn-gray-700.w-100.mx-1').click();
    
    //Click Done
    cy.get('#sales-registration-v2-portal > form > md-content > div.form-body.layout-align-center-stretch.layout-row > div > tsi-client-registration-v2-service-agreement-step > div > tsi-client-registration-v2-tsi-checkout > div > tsi-client-registration-v2-tsi-marketing-package-controls > div > tsi-client-registration-v2-tsi-marketing-package-settings-controls > div > div.ng-scope.flex.md-block > tsi-client-registration-v2-tsi-townsquare-app-step > div > div.card.mb-5 > div.card-footer.bg-gray-100.p-5 > div.row.justify-content-between > div.col-12.col-md-4.col-lg-3.mb-4.mb-md-0 > div > button.rounded.btn.btn-gray-700.w-100.mx-1').click();
    
    //Click $100/mo
    cy.get('#sales-registration-v2-portal > form > md-content > div.form-body.layout-align-center-stretch.layout-row > div > tsi-client-registration-v2-service-agreement-step > div > tsi-client-registration-v2-tsi-checkout > div > tsi-client-registration-v2-tsi-marketing-package-controls > div > tsi-client-registration-v2-tsi-marketing-package-settings-controls > div > div.ng-scope.flex.md-block > tsi-client-registration-v2-tsi-townsquare-app-step > div > div.card.mb-5 > div.card-footer.bg-gray-100.p-5 > div.row.justify-content-between > div > div > button:nth-child(2) > span').click(); 
      
    /*Feature Additions...just a heads up this might be VERY brittle...but this is the only way to select things for this part.*/ 

/*----------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
    /*!!!!!!!!!!!PAYMENT TYPE!!!!!!!!!!!*/

    //Click TSI Payment Type
    cy.get('md-select[name="service_agreement.tsi.payment.auth_type"]').click();
    
    //Click Credit Card
    cy.get('md-option#select_option_72').click();
    
    //Click Include credit card authorization page in service agreement
    cy.get('#sales-registration-v2-portal > form > md-content > div.form-body.layout-align-center-stretch.layout-row > div > tsi-client-registration-v2-service-agreement-step > div > tsi-client-registration-v2-service-agreement-details > div > div:nth-child(2) > div.ng-scope.layout-row > div > md-checkbox > div.md-container.md-ink-ripple').click();

    /*!!!!!!!!!!!PAYMENT TYPE!!!!!!!!!!!*/

/*----------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
    /*!!!!!!!!!!!CONFIRM & SUBMIT!!!!!!!!!!!*/

    //Click Confirm
    cy.get('#sales-registration-v2-portal > form > md-content > tsi-client-registration-v2-form-controls > div > tsi-client-registration-v2-summary-footer > div > div > div > div.layout-wrap.layout-align-end-center.layout-row.flex-100 > div > md-checkbox > div.md-container.md-ink-ripple').click();
    
    //Click Submit Service Agreement
    cy.get('button[ng-click="$ctrl.onSubmit()"]').click();

    //Click OK on the Modal
    cy.get('button#ajax-response-button-ok').click();    
     /*!!!!!!!!!!!CONFIRM & SUBMIT!!!!!!!!!!!*/

/*----------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
    /*!!!!!!!!!!!!!CREDIT CARD INFO!!!!!!!!!!!!*/

    //Client First Name
    cy.get('input[name="order.tsi.billing.first_name"]').type(firstName);   

    //Client Last Name
    cy.get('input[name="order.tsi.billing.last_name"]').type(lastName);   

    //Fake Credit Card Number
    //https://sandbox.basysiqpro.com/docs/test_data/#test-cards
    cy.get('input[name="order.checkout.payment.card.number"]').type('4111111111111111');   

    //Fake Expriation Date
    cy.get('#input_110').type('2/2026');   

    //Fake CVV
    cy.get('input[name="order.checkout.payment.card.cvv"]').type('679'); 
    
    //Fake Phone Number
    cy.get('input[name="order.tsi.billing.phone_number"]').type('7042932542'); 

    /*!!!!!!!!!!!!!CREDIT CARD INFO!!!!!!!!!!!!*/
    
/*----------------------------------------------------------------------------------------------------------------------------------------------------------*/     
    /*!!!!!!!!!!!!!BILLING ADDRESS!!!!!!!!!!!!*/
    //Billing Address
    cy.get('a[ng-click="onShowValidateBillingAddressModal()"]').click(); 

    cy.get('label.text-uppercase.mt-3').contains('Valid billing Address Selection');

    //Type in Street Name
    cy.get('input[name="address1"]').type('12 Valley View Rd'); 
    
    //Type in City 
    cy.get('input[name="city"]').type('Big Indian'); 

    //Select State
    cy.get('select#state').select('NY');

    //Type in Zipcode 
    cy.get('input[name="zipcode"]').type('12410'); 

    //Click Validate
    cy.get('#validate-address-modal > div > div.modal-body.p-0 > div > div.col-md-8.border-right.py-3.px-4.pb-5 > small > button').click();  

    //Select Validated Address
    cy.get('input[name="selectedAddress"]').click();  

    //Submit Button
    cy.get('#validate-address-modal > div > div.modal-footer.bg-light > div > div:nth-child(2) > button').click();  
    /*!!!!!!!!!!!!!BILLING ADDRESS!!!!!!!!!!!!*/
/*----------------------------------------------------------------------------------------------------------------------------------------------------------*/ 

    /*!!!!!!!!!!!!!BUSINESS ADDRESS!!!!!!!!!!!!*/

    //Click Add Business Button
    cy.get('a[ng-click="onShowValidateBusinessAddressModal()"]').click();  

    //Type in Street Name
    cy.get('input[name="address1"]').type('12 Valley View Rd'); 
    
    //Type in City 
    cy.get('input[name="city"]').type('Big Indian'); 

    //Select State
    cy.get('select#state').select('NY');

    //Type in Zipcode 
    cy.get('input[name="zipcode"]').type('12410'); 

    //Click Validate
    cy.get('#validate-address-modal > div > div.modal-body.p-0 > div > div.col-md-8.border-right.py-3.px-4.pb-5 > small > button').click();  

    //Select Validated Address
    cy.get('input[name="selectedAddress"]').click();  

    //Submit Button
    cy.get('#validate-address-modal > div > div.modal-footer.bg-light > div > div:nth-child(2) > button').click(); 

    //Add the phone number to the phone number field that only appers after a series of steps
    cy.get('input[name="order.tsi.business.phone_number"]').type('7042932542');

    /*!!!!!!!!!!!!!BUSINESS ADDRESS!!!!!!!!!!!!*/

/*----------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
    /*!!!!!!!!!!!CONFIRM & SUBMIT!!!!!!!!!!!*/

    //Click "I confirm that the information in this form is correct."
    cy.get('md-checkbox[ng-model="$ctrl.tsiClientRegistrationV2.state.confirmedFormData" ]').click();  

    //Click "Confirm Order"
    cy.get('button[ng-disabled="!$ctrl.tsiClientRegistrationV2.state.confirmedFormData"]').click();  

    //Click "Modal Ok"
    cy.get('div.modal-footer').find('a.btn-secondary').click();

    /*!!!!!!!!!!!CONFIRM & SUBMIT!!!!!!!!!!!*/

  });
});