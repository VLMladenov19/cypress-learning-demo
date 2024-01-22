describe('authentication testing', function () {
  let userData;
  let employeeData;

  beforeEach(() => {
    cy.readFile('cypress/fixtures/user.json').then((data) => {
      userData = data
    })
    cy.readFile('cypress/fixtures/employee.json').then((data) => {
      employeeData = data
    })
  })

  it('get error on empty form submit', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')

    cy.get('.oxd-button').click()

    cy.get('.oxd-input-field-error-message').should('have.length', 2)
  })

  it('login successfully', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')

    cy.get('input[placeholder*="Username"]').type(userData.username)
    cy.get('input[placeholder*="Password"]').type(userData.password)

    cy.get('.oxd-button').click()

    cy.url().should('include', 'dashboard/index')
  })
})