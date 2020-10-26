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

// view departments
// connection.query(`SELECT * FROM department`, (err, results) => {
//   if (err) {
//     throw (err);
//   }
//   console.table(results);
//   connection.close();
// });

// view roles
// connection.query(`SELECT role.id, title, name AS department, salary
//                     FROM role
//                     LEFT JOIN department ON department_id = department.id`, (err, results) => {
//   if (err) {
//     throw (err);
//   }
//   console.table(results);
//   connection.close();
// });

// view employees
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
  console.table(results);
  connection.close();
});
