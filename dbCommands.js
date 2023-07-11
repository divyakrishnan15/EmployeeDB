const inquirer = require("inquirer");
const { db } = require("./db/config.js");
let questions = require("./questions.js");
const chalk = require("chalk");

function dbQueries(res) {
  const response = res.action;

  switch (response) {
    case "View All Departments":
      db.query("SELECT * FROM department", (err, res) => {
        console.table(res);
        nextQuestions();
        if (err) {
          console.log(err);
        }
      });
      break;
    case "View All Roles":
      db.query("SELECT * FROM role", (err, res) => {
        try {
          console.table(res);
          nextQuestions();
        } catch (err) {
          console.log(err);
        }
      });
      break;
    case "View All Employees":
      db.query(
        `SELECT e1.emp_id, e1.first_name, e1.last_name, r.title,d.name AS department_name,r.salary,
            REPLACE(CONCAT_WS(' ',e2.first_name, e2.last_name),'  ',' ') AS 'manager_name'
             FROM employee e1
             JOIN employee e2 ON e2.emp_ID = e1.manager_id
             JOIN role r ON r.role_id = e1.role_id
             JOIN department d ON d.dept_id = r.department_id;`,
        (err, res) => {
          console.table(res);
          nextQuestions();
          if (err) {
            console.log(err);
          }
        }
      );
      break;
    case chalk.green("Add a Department"):
      addDepartment(res);
      nextQuestions();
      break;
    case chalk.green("Add a Role"):
      let addARoleList = [res.addRole_Name, res.addRole_Salary];
      db.query("SELECT * FROM department", (err, departments) => {
        if (err) {
          console.log(err);
        }
        departments.map((e, i) => {
          e["value"] = e.dept_id;
        });
        inquirer
          .prompt([
            {
              type: "list",
              message: "Which Department does the role belong to?",
              name: "addRole_Dept",
              choices: departments,
            },
          ])
          .then((dept) => {
            addARoleList.push(dept.addRole_Dept);
            addRole(addARoleList);
            nextQuestions();
          });
      });
      break;
    case chalk.green("Add an Employee"):
      let addAEmployeeList = [res.addEmp_FirstName, res.addEmp_LastName];
      db.query("SELECT * FROM role", (err, roles) => {
        if (err) {
          console.log(err);
        }
        roles.map((e, i) => {
          e["name"] = e.title;
          e["value"] = e.role_id;
        });
        inquirer
          .prompt([
            {
              type: "list",
              message: "What is the Employee's Role?",
              name: "addEmp_Role",
              choices: roles,
            },
          ])
          .then((role) => {
            addAEmployeeList.push(role.addEmp_Role);
            db.query("SELECT * FROM employee", (err, mgrs) => {
              if (err) {
                console.log(err);
              }
              mgrs.map((m, i) => {
                m["name"] = m.first_name + " " + m.last_name;
                m["value"] = m.manager_id;
              });

              inquirer
                .prompt([
                  {
                    type: "list",
                    message: "What is the Manager's Name?",
                    name: "addEmp_Mgr",
                    choices: mgrs,
                  },
                ])
                .then((mgr) => {
                  addAEmployeeList.push(mgr.addEmp_Mgr);
                  addEmployee(addAEmployeeList);
                  nextQuestions();
                });
            });
          });
      });
      break;
    
function nextQuestions() {
  // console.log("Next Questions---")
  inquirer
    .prompt(questions)
    .then((res) => {
      dbQueries(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { dbQueries };

