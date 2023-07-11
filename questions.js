const chalk = require('chalk')

const questions = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "action",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      chalk.green("Add a Department"),
      chalk.green("Add a Role"),
      chalk.green("Add an Employee"),
      "Update an Employee Role",
      "Update Employee Managers",
      "View Employees by Manager",
      "View Employees by Department",
      "View combined salaries of All Employees in that Department",
      chalk.red("Delete Employee"),
      chalk.red("Delete Role"),
      chalk.red("Delete Department"),
      "Filter Employees by Manager",
      "Filter Employees by Department",
      chalk.red.bold("Quit"),
    ],
  },
  {
    type: "input",
    message: "What is the name of the Department?",
    name: "addDept",
    when: (res) => res.action == chalk.green("Add a Department"),
  },
  {
    type: "input",
    message: "What is the name of the Role?",
    name: "addRole_Name",
    when: (res) => res.action == chalk.green("Add a Role"),
  },
  {
    type: "input",
    message: "What is the Salary of the Role?",
    name: "addRole_Salary",
    when: (res) => res.addRole_Name,
  },
  {
    type: "input",
    message: "What is the Employee's First Name?",
    name: "addEmp_FirstName",
    when: (res) => res.action == chalk.green("Add an Employee"),
  },
  {
    type: "input",
    message: "What is the Employee's Last Name?",
    name: "addEmp_LastName",
    when: (res) => res.action == chalk.green("Add an Employee"),
  },
  {
    type: "input",
    message: "To update an Employee Role, Enter Employee's First Name?",
    name: "updEmp_Role",
    when: (res) => res.action == "View All Employees By Department",
  },
];

module.exports = questions;
