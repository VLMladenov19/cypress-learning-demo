describe('authentication testing', function () {
  let userData;
  let employeeData;

  beforeEach(() => {
    cy.fixture('user').then((user) => {
      userData = user
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

  it('add employee', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')

    cy.get('input[placeholder*="Username"]').type(userData.username)
    cy.get('input[placeholder*="Password"]').type(userData.password)

    cy.get('.oxd-button').click()

    cy.get(':nth-child(2) > .oxd-main-menu-item').click()
    cy.get('.oxd-topbar-body-nav > ul > :nth-child(3)').click()
    cy.get('.oxd-switch-input').click()

    cy.get('.--name-grouped-field > :nth-child(1) > :nth-child(2) > .oxd-input').type(employeeData.firstName)
    cy.get(':nth-child(2) > :nth-child(2) > .oxd-input').type(employeeData.middleName)
    cy.get(':nth-child(3) > :nth-child(2) > .oxd-input').type(employeeData.lastName)

    let employeeId;
    cy.get(':nth-child(1) > .oxd-grid-2 > .oxd-grid-item > .oxd-input-group > :nth-child(2) > .oxd-input')
    .invoke('val')
    .then(sometext => employeeId = String(sometext));
    cy.readFile('cypress/fixtures/employee.json').then((data) => {
      data.id = employeeId
      cy.writeFile('cypress/fixtures/employee.json', JSON.stringify(data))
    })

    cy.get(':nth-child(4) > .oxd-grid-2 > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input').type(employeeData.username)
    cy.get('.user-password-cell > .oxd-input-group > :nth-child(2) > .oxd-input').type(employeeData.password)
    cy.get('.oxd-grid-2 > :nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input').type(employeeData.password)

    cy.get('.oxd-button--secondary').click()

    cy.location('pathname', {timeout: 60000})
    .should('include', '/pim/viewPersonalDetails/empNumber');
  })

  it('delete created employee', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')

    cy.get('input[placeholder*="Username"]').type(userData.username)
    cy.get('input[placeholder*="Password"]').type(userData.password)

    cy.get('.oxd-button').click()

    cy.get(':nth-child(2) > .oxd-main-menu-item').click()
    cy.get(':nth-child(2) > .oxd-input').type(employeeData.id)
    cy.get('.oxd-form-actions > .oxd-button--secondary')
    cy.get('.oxd-table-row > :nth-child(1) > .oxd-checkbox-wrapper > label > .oxd-checkbox-input > .oxd-icon').click()
    cy.get('.orangehrm-horizontal-padding > div > .oxd-button').click()
    cy.get('.orangehrm-modal-footer > .oxd-button--label-danger').click()

    cy.get('.oxd-table-body').children().should('have.length', 0)
  })
})