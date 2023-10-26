describe('template spec', () => {
  it('Gets, types, asserts, visits links, deletes them, and empties recycle bin', () => {
    const BASE_URL = 'https://tsi--clientreg.sandbox.my.salesforce.com/';

    cy.visit(BASE_URL);

    // Enter Username
    cy.get("input#username").type('alex@townsquaredigital.com.clientreg');

    // Enter Password
    cy.get('input[id="password"]').type('Orange9!');

    // Click the Sales Dashboard Button
    cy.get("input#Login").click();

    // Go to Overall Top Files by Storage Utilization
    cy.visit(BASE_URL + 'ui/setup/storage/OrgLargestFiles?setupid=CompanyResourceDisk');

    // Select the table element
    const linksToDelete = [];

    cy.get("table.list")
      .find("tbody tr")
      .each(($row) => {
        const link = $row.find("a");
        const href = link.attr("href");

        if (href) {
          const absoluteURL = BASE_URL + href;
          cy.visit(absoluteURL);

          // Push the link to delete into the array
          linksToDelete.push(absoluteURL);
        }
      })
      .then(() => {
        // Loop is done, proceed to delete links if needed
        linksToDelete.forEach((link) => {
          // Perform your Cypress steps on the visited page
          cy.visit(link);

          // Wait until the page is fully loaded (adjust the timeout as needed)
          cy.wait(5000); // You can adjust the timeout (e.g., 5000 milliseconds) based on your application's load time

          // Click the "Delete" button (you may need to add waiting strategies here too)
          cy.get("a[title='Delete']").click(); // Assuming 'Delete' link has a title attribute of 'Delete'
        });

        // After deleting all links, proceed to empty the recycle bin
        // After deleting all links, proceed to empty the recycle bin
        cy.visit(BASE_URL + 'search/UndeletePage');

        cy.wait(5000); // You can adjust the timeout (e.g., 5000 milliseconds) based on your application's load time

        // Click the "Empty your organization's recycle bin" button
        cy.get("input[value=\"Empty your recycle bin\"]").click();

        // Handle the confirmation dialog and press Enter
        cy.on('window:confirm', () => true);
        cy.get("input[name='emptyMine']").click();
      });
  });
});
