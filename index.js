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
          addDepartment();
          break;
        case 'Add a Role':
          addRole();
          break;
        case 'Add an Employee':
          addEmployee();
          break;
        case 'Update an Employee Role':
          updateEmployeeRole();
          break;
        case 'Close Program':
          connection.close();
          break;
      }
    });
}

// view departments
function viewDepartments() {
  connection.promise().query(`SELECT * FROM department`)
    .then(([departments]) => {
      console.table(departments);
      mainMenu();
    });
}

// view roles
function viewRoles() {
  const sql = `
SELECT role.id, title, name AS department, salary
FROM role
LEFT JOIN department ON department_id = department.id`;
  connection.promise().query(sql)
    .then(([roles]) => {
      console.table(roles);
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

  connection.promise().query(sql)
    .then(([employees]) => {
      console.log('\n');
      console.table(employees);
      console.log('\n');
      mainMenu();
    });
}

// add department
function addDepartment() {
  inquirer.prompt({
    type: 'input',
    message: 'Enter the name of the new department:',
    name: 'departmentName'
  })
    .then(({ departmentName }) => {
      const sql = `INSERT INTO department SET ?`;
      return connection.promise().query(sql, { name: departmentName });
    })
    .then(({ results }) => {
      console.log('Department added');
      mainMenu();
    });
}

// add role
async function addRole() {
  const [departments] = await connection.promise().query(`SELECT * FROM department`);
  inquirer.prompt([
    {
      type: 'input',
      message: 'Enter the title of the new role:',
      name: 'title'
    },
    {
      type: 'input',
      message: 'Enter the salary of the new role:',
      name: 'salary'
    },
    {
      type: 'list',
      message: 'Select the department the role belongs to:',
      name: 'department',
      choices: departments
    }
  ])
    .then(({ title, salary, department }) => {
      department_id = departments.find(dept => dept.name === department).id;
      const sql = `INSERT INTO role SET ?`;
      const params = { title, salary, department_id };
      connection.query(sql, params, (err, results) => {
        if (err) {
          throw (err);
        }
        console.log('Role added');
        mainMenu();
      });
    });
}

mainMenu();
