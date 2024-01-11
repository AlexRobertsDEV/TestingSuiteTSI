import 'cypress-wait-until';

// Set the base URL for the staging environment you want to test
const baseURL = 'https://tagassistant.google.com/';

describe('Shutterstock Tool Test', () => {
    beforeEach(() => {
        // Set the desired viewport size before each test
        cy.viewport(1280, 720); // You can adjust the width and height values as needed

        // Visit the baseURL before each test
        cy.visit(baseURL);

        cy.pause();

        //Verify You're On The Login Page
        cy.get('img.img-responsive') // This gets all images with the class 'img-responsive'
            .invoke('attr', 'src') // This retrieves the 'src' attribute of the selected element
            .should('include', 'tsi_black-teal-logo.png'); // This checks if the 'src' attribute includes 'tsi_black-teal-logo.png'


        //Enter Username
        cy.get('input[placeholder="Username or Email"]').type('alex.roberts@townsquareinteractive.com');

        //Enter Password
        cy.get('input[placeholder="Password"]').type('Orange9!');

        //Click The Sign-In Button
        cy.get('button:contains("Log In")').click();

        //Click The Website Editor Button
        cy.contains('website').contains('editor').click();

        cy.get('.navbar-header img') // This gets all images with the class 'img-responsive'
            .invoke('attr', 'src') // This retrieves the 'src' attribute of the selected element
            .should('include', './img/tsi_white-teal-logo-sm.png'); // This checks if the 'src' attribute includes 'tsi_black-teal-logo.png'

    });

    const commonImageSearchArray = [
        'background',
        'abstract',
        'Christmas',
        'pattern',
        'business',
        'technology',
        'aerial',
        'coffee',
        'texture',
        'office',
        'food',
        'car',
        'Ramadan',
        'kitchen',
        'money',
        'laptop',
        'table',
        'travel',
        'house',
        'road',
        'home',
        'phone',
        'yoga',
        'Easter',
        'football',
        'pizza',
        'confetti',
        'gold',
        'shopping',
        'marketing',
        'Halloween',
        'school',
        'architecture',
        'calendar',
        'gym',
        'education',
        'covid',
        'community',
        'chocolate',
        'city',
        'adult',
        'building',
        'wedding',
        'clock',
        'icons',
        'Dubai',
        'data',
        'podium'
    ];

    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    // Shuffle array and take the first 10 search terms
    const fiveRandomSearchTerms = shuffleArray(commonImageSearchArray).slice(0, 3);


    // Start writing your test cases here.
    fiveRandomSearchTerms.forEach((searchTerm) => {
        it(`ShutterStock Page Publisher Test For: ${searchTerm}`, () => {

            cy.intercept('GET', 'https://staging7.townsquareinteractive.com/laravel/api/v1/cms/searchshutterstockimg/**').as('getShutterStockImages');
            cy.intercept('GET', 'https://staging7.townsquareinteractive.com/laravel/api/v1/cms/shutterstockpurchase/**').as('getShutterStockPurchase');
            cy.intercept('GET', 'https://staging7.townsquareinteractive.com/laravel/api/v1/cms/shutterstockimgdetail/**').as('getShutterstockImageDetail');

            // Assertions to ensure the main page has loaded
            cy.url().should('include', baseURL + 'cms/#!/ui/design/'); // Check if the URL is correct

            //Click page media tool
            cy.get('a[aria-controls="media-tool"]').click();

            //Click ShutterStock button
            cy.get('div[role="tabpanel"] .nav-pills li a:contains("Shutterstock")').click();

            //Type in searchTerm
            cy.get('#media-tool-v2-root input[placeholder="Search Stock Images"]').type(searchTerm);

            //Click page publisher
            cy.get('#media-tool-v2-root button[aria-label="Search"]').click();

            cy.wait('@getShutterStockImages', { timeout: 10000 }).then((interception) => {
                // Assert the status code or perform actions based on the successful request
                expect(interception.response.statusCode).to.eq(200);
            });

            // Count how many images' src attributes contain the searchTerm
            cy.get('.images-grid-container .image-holder img')
                .then(($images) => {
                    // Initialize a counter
                    let count = 0;

                    // Convert the collection of images to an array and iterate over it
                    $images.each((index, img) => {
                        // Extract the src attribute from the image
                        const src = Cypress.$(img).attr('src').toLowerCase();
                        if (src.includes(searchTerm.toLowerCase())) {
                            count++;
                        }
                    });

                    // Log the count to the Cypress command log
                    cy.log(`Number of images containing '${searchTerm}':`, count);

                    // Assert that there is at least one image with the term
                    expect(count).to.be.at.least(1);
                });

            // Now, to click a random image, you'll get the .thumbnail elements and click a random one
            cy.get('.images-grid-container .image-holder .thumbnail')
                .then($thumbnails => {
                    // Ensure there are thumbnails to click on
                    if ($thumbnails.length > 0) {
                        const randomIndex = Math.floor(Math.random() * $thumbnails.length);
                        // Click on the randomly selected thumbnail
                        cy.wrap($thumbnails[randomIndex]).click();
                    } else {
                        // If no thumbnails were found, you might want to fail the test or handle as needed
                        throw new Error('No thumbnails found');
                    }
                });

            // Click the "Med 1000 x 667" button
            cy.get('button:contains("Med")').click();

            // Click the "Buy & Download Small" button
            cy.get('button:contains("Buy")').click();


            // Then, use a conditional logic to wait for the relevant request
            cy.get('body').then(($body) => {
                // Check if the body contains text that indicates an image download
                if ($body.text().includes('Image already downloaded')) {
                    // Handle the case where the image is already downloaded
                    // and you therefore don't expect the network request to occur
                    cy.log('Image is already downloaded, no need to wait for the purchase request.');
                } else {
                    // If the image is not already downloaded, then wait for the network request for purchase
                    cy.wait('@getShutterStockPurchase', { timeout: 10000 }).then((interception) => {
                        // Assert the status code or perform actions based on the successful request
                        expect(interception.response.statusCode).to.eq(200);
                    });
                    // Additionally, if you expect the image detail request to occur as well, wait for it
                    cy.wait('@getShutterstockImageDetail', { timeout: 10000 }).then((interception) => {
                        // Perform actions based on the successful image detail request
                        // This could be additional assertions or logic depending on your test requirements
                    });
                }
            });

            //Click Purchased button
            cy.get('div[role="tabpanel"] .nav-pills li a:contains("Purchased")').click();


            cy.get('body').then(($body) => {
                // Use jQuery's find to check for the existence of the element
                const mediaElement = $body.find('#tsi15-media .tsi15-media-card');
                // Check if the element does not exist
                if (mediaElement.length === 0) {
                  // If the element does not exist, throw an error to fail the test
                  throw new Error('Purchase page has no purchased images.');
                }
                // If the element does exist, no action is needed, the test will continue
            });
              

        });


    });
});