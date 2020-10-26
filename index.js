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
connection.query(`SELECT * FROM department`, (err, results) => {
  if (err) {
    throw (err);
  }
  console.table(results);
  connection.close();
});
