const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'employee_db'
});

function mainMenu() {
  inquirer.prompt({
    type: 'list',
    message: 'What would you like to do?',
    name: 'action',
    choices: [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'Add a Department',
      'Add a Role',
      'Add an Employee',
      'Update an Employee Role',
      'Close Program'
    ]
  })
    .then(({ action }) => {
      console.log('\n');
      switch (action) {
        case 'View All Departments':
          viewDepartments();
          break;
        case 'View All Roles':
          viewRoles();
          break;
        case 'View All Employees':
          viewEmployees();
          break;
        case 'Add a Department':
          break;
        case 'Add a Role':
          break;
        case 'Add an Employee':
          break;
        case 'Update an Employee Role':
          break;
        case 'Close Program':
          connection.close();
          break;
      }
    });
}

// view departments
function viewDepartments() {
  const sql = `SELECT * FROM department`;
  connection.query(sql, (err, results) => {
    if (err) {
      throw (err);
    }
    console.table(results);

    mainMenu();
  });
}

// view roles
function viewRoles() {
  const sql = `
SELECT role.id, title, name AS department, salary
FROM role
LEFT JOIN department ON department_id = department.id`;
  connection.query(sql, (err, results) => {
    if (err) {
      throw (err);
    }
    console.table(results);

    mainMenu();
  });
}


// view employees
function viewEmployees() {
  const sql = `
SELECT e.id, e.first_name, e.last_name, title,
  department.name AS department, salary,
  CONCAT(m.first_name, " ", m.last_name) AS manager
FROM employee AS e
LEFT JOIN role ON e.role_id = role.id
LEFT JOIN department ON department_id = department.id
LEFT JOIN employee AS m ON e.manager_id = m.id`;

  connection.query(sql, (err, results) => {
    if (err) {
      throw (err);
    }
    console.log('\n');
    console.table(results);
    console.log('\n');
  });

  mainMenu();
}

mainMenu();
