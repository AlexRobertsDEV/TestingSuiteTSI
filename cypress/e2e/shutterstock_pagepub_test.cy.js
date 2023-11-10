import 'cypress-wait-until';

// Set the base URL for the staging environment you want to test
const baseURL = 'https://bmdshutterstocktest.staging7.townsquareinteractive.com/';

describe('Shutterstock Tool Test', () => {
    beforeEach(() => {
        // Set the desired viewport size before each test
        cy.viewport(1280, 720); // You can adjust the width and height values as needed

        // Visit the baseURL before each test
        cy.visit(baseURL + 'cms/#!/login');

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
        'abstract background',
        'business',
        'technology',
        'aerial',
        'coffee',
        'social media',
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
        'blue background',
        'living room',
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
        'Eid Mubarak',
        'Eid al-Fitr',
        'Halloween',
        'paper texture',
        'school',
        'architecture',
        'calendar',
        'gym',
        'education',
        'Mother\'s Day',
        'white background',
        'ice cream',
        'covid',
        'community',
        'world map',
        'chocolate',
        'city',
        'adult',
        'building',
        'wedding',
        'real estate',
        'clock',
        'icons',
        'Dubai',
        'background texture',
        'geometric pattern',
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
    const fiveRandomSearchTerms = shuffleArray(commonImageSearchArray).slice(0, 5);


    // Start writing your test cases here.
    fiveRandomSearchTerms.forEach((searchTerm) => {
        it(`ShutterStock Page Publisher Test For: ${searchTerm}`, () => {

            cy.intercept('GET', 'https://staging7.townsquareinteractive.com/laravel/api/v1/cms/shutterstockpurchase/**').as('getShutterStockPurchase');
            cy.intercept('GET', 'https://staging7.townsquareinteractive.com/laravel/api/v1/cms/shutterstockimgdetail/**').as('getShutterstockImageDetail');

            // Assertions to ensure the main page has loaded
            cy.url().should('include', baseURL + 'cms/#!/ui/design/'); // Check if the URL is correct

            //Click page publisher
            cy.get('a[aria-controls="publisher"]').click();


            // Click page select image button
            cy.get('a[data-target="#selectItemImage"]:first-of-type').click();

            //Click shutterstock button in Image Modal
            cy.get('a[data-target="#shutterstock-images"]:contains("ShutterStock")').click();



            //const randomSearchTerm = commonImageSearchArray[Math.floor(Math.random() * commonImageSearchArray.length)];

            //Type in searchTerm
            cy.get('#shutterStockImages input[placeholder="Search Stock Images"]').type(searchTerm);

            //Click page publisher
            cy.get('#shutterStockImages button[aria-label="Search"]').click();

            // Count how many titles contain the searchTerm
            cy.get('div[ng-repeat="image in data.images.shutterstock.images"]')
                .then(($divs) => {
                    // Initialize a counter
                    let count = 0;

                    // Convert the collection of divs to an array and iterate over it
                    $divs.each((index, div) => {
                        if (div.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                            count++;
                        }
                    });

                    // Return the count to be used in the next step of the chain
                    return count;
                })
                .then((count) => {
                    // Log the count to the Cypress command log
                    cy.log(`Number of titles containing '${searchTerm}':`, count);

                    // You can use the count here for further assertions if needed
                    expect(count).to.be.at.least(1); // Assert that there is at least one title with the term
                });

            // Handle the alert by setting a flag
            let shouldWaitForPurchase = true;
            cy.on('window:alert', (text) => {
                if (text.includes('Image already downloaded')) {
                    shouldWaitForPurchase = false;
                    return false; // return false to prevent the default behavior of the alert
                }
            });

            // Retrieve all image thumbnails and click a random one
            cy.get('#shutterStockImages .row div[ng-repeat="image in data.images.shutterstock.images"] .thumbnail')
                .then($thumbnails => {
                    const randomIndex = Math.floor(Math.random() * $thumbnails.length);
                    cy.wrap($thumbnails[randomIndex]).click();
                });

            // Click size button
            cy.get('#shutterstock-images .tsi-shutterstock-img button[ng-if="data.vars.shutterStockSelectedImage.assets.medium_jpg"]').click();

            // Click Buy Download Button
            cy.get('#shutterstock-images button[ng-click="buyShutterStockImg(\'publisher\')"]').click();

            // Conditionally wait for the API call to complete if the alert has not been triggered
            cy.get('body').then(($body) => {
                // Check if the body contains text that indicates an image download
                if ($body.text().includes('Image already downloaded')) {
                    // Handle the case where the image is already downloaded
                    // and you therefore don't expect the network request to occur
                    cy.log('Image is already downloaded, no need to wait for the purchase request.');
                } else {
                    // If the image is not already downloaded, wait for the network request for image details
                    cy.wait('@getShutterstockImageDetail', { timeout: 10000 }).then((interception) => {
                        const url = interception.request.url;
                        // This regex looks for any characters after 'shutterstockimgdetail/5768/'
                        const regex = /shutterstockimgdetail\/5768\/(.*)/;
                        const match = url.match(regex);

                        if (match && match[1]) {
                            const imageId = match[1];
                            // You can now use the imageId variable in your test
                            cy.wrap(imageId).as('imageId'); // Aliasing the imageId for later use
                        } else {
                            throw new Error('Detail part could not be extracted from the URL.');
                        }
                    });
                    cy.wait('@getShutterStockPurchase', { timeout: 10000 }).then((interception) => {
                        // Assert the status code or perform actions based on the successful request
                        expect(interception.response.statusCode).to.eq(200);
                    });
                }
            });

            // Later in the test, use the aliased imageId
            cy.get('@imageId').then((imageId) => {
                // Correct usage of cy.log to output the imageId
                cy.log(`Image ID: ${imageId}`);

                // Trigger the mouseover on the first '.tsi15-image.ng-scope'
                cy.get('.tsi15-image.ng-scope').first().trigger('mouseover');

                // Click the second link in '.tsi15-image-edit'
                cy.get('.tsi15-image-edit a').eq(1).click({ force: true });

                // Click the "Purchased" button in the Image Modal
                cy.get('a[data-target="#purchased-images"]').contains('Purchased').click();


                //Check to see if the image has been purchased successfully
                const selector = `.tsi15-img-thumbs[style*='shutterstock_${imageId}']`;
                cy.get(selector).should('exist');
                cy.log(`Image ${imageId} has been purchased successfully`);

                // Click the close button in the Image Modal
                cy.get('#selectItemImage .modal-header button[aria-label="Close"]').click();
            });


            // Now the div should be visible, so we can proceed to trigger the mouseover
            cy.get('.tsi15-image.ng-scope').first().trigger('mouseover');

            // And then click the first link
            cy.get('.tsi15-image-edit a').first().click({ force: true });



        });


    });
});


