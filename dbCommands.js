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
      case "Update an Employee Role":
        db.query("SELECT * FROM employee", (err, employees) => {
          if (err) {
            console.log(err);
          }
  
          employees.map((e, i) => {
            e["name"] = e.first_name + " " + e.last_name;
            e["value"] = e.emp_id;
          });
          inquirer
            .prompt([
              {
                type: "list",
                message: "What is the Employee's Name?",
                name: "updEmp_Id",
                choices: employees,
              },
            ])
            .then((updateRoleName) => {
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
                      name: "updEmp_Role",
                      choices: roles,
                    },
                  ])
                  .then((updateRole) => {
                    let updateAnEmployeeRoleList = [
                      updateRole.updEmp_Role,
                      updateRoleName.updEmp_Id,
                    ];
                    updateEmployeeRole(updateAnEmployeeRoleList);
                    nextQuestions();
                  });
              });
            });
        });
        break;
      case "Update Employee Managers":
        db.query("SELECT * FROM employee", (err, employees) => {
          if (err) {
            console.log(err);
          }
  
          employees.map((e, i) => {
            e["name"] = e.first_name + " " + e.last_name;
            e["value"] = e.emp_id;
          });
          inquirer
            .prompt([
              {
                type: "list",
                message: "What is the Employee's Name?",
                name: "updEmp_Id",
                choices: employees,
              },
              {
                type: "list",
                message: "What is the Employee's Manager?",
                name: "updEmpMgr_Id",
                choices: employees,
              },
            ])
            .then((updateMgr_values) => {
              updateEmployeeMgr(updateMgr_values);
              nextQuestions();
            });
        });
        break;
  
      case "View Employees by Manager":
        db.query(
          `SELECT e1.*, REPLACE(CONCAT_WS(' ',e2.first_name, e2.last_name),'  ',' ') AS 'manager_name'
        FROM employee e1
        JOIN employee e2 
        ON e1.manager_id = e2.emp_id
        ORDER BY e1.manager_id ASC;`,
          (err, employees) => {
            if (err) {
              console.log(err);
            }
            console.table(employees);
            nextQuestions();
          }
        );
        break;
  
      case "View Employees by Department":
        db.query(
          `SELECT e.*, r.*, d.name as "department_name"
            FROM employee e
            JOIN role r ON r.role_id = e.role_id
            JOIN department d ON d.dept_id = r.department_id
            ORDER BY department_id ASC;`,
          (err, employees) => {
            if (err) {
              console.log(err);
            }
  
            console.table(employees);
            nextQuestions();
          }
        );
        break;
        case "View combined salaries of All Employees in that Department":
          db.query(
            `SELECT d.name, SUM(r.salary) as 'salary'
            FROM employee e
            JOIN role r ON r.role_id = e.role_id
            JOIN department d ON d.dept_id = r.department_id
            GROUP BY d.dept_id
            ORDER BY department_id ASC;`,
            (err, salaries) => {
              if (err) {
                console.log(err);
              }
    
              console.table(salaries);
              nextQuestions();
            }
          );
          break;
  
      case chalk.red("Delete Employee"):
        db.query(`SELECT * FROM employee`, (err, employee) => {
          if (err) {
            console.log(err);
          }
  
          employee.map((e, i) => {
            e["name"] = e.first_name + " " + e.last_name;
            e["value"] = e.emp_id;
          });
          inquirer
            .prompt([
              {
                type: "list",
                message: "Which Employee To Delete?",
                name: "del_Emp",
                choices: employee,
              },
            ])
            .then((delEmp) => {
              db.query(
                `DELETE from employee where emp_id = ?`,
                delEmp.del_Emp,
                (err, res) => {
                  if (err) {
                    console.log(err);
                  }
                  nextQuestions();
                }
              );
            });
        });
        break;
      case chalk.red("Delete Role"):
        db.query(`SELECT * FROM role`, (err, roles) => {
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
                message: "Which Role To Delete?",
                name: "del_Role",
                choices: roles,
              },
            ])
            .then((delRole) => {
              db.query(
                `DELETE from role where role_id = ?`,
                delRole.del_Role,
                (err, res) => {
                  if (err) {
                    console.log(err);
                  }
                  nextQuestions();
                }
              );
            });
        });
        break;
      case chalk.red("Delete Department"):
        db.query(`SELECT * FROM department`, (err, departments) => {
          if (err) {
            console.log(err);
          }
  
          departments.map((e, i) => {
            // e["name"] = e.title
            e["value"] = e.dept_id;
          });
          inquirer
            .prompt([
              {
                type: "list",
                message: "Which Department To Delete?",
                name: "del_Dept",
                choices: departments,
              },
            ])
            .then((delDept) => {
              db.query(
                `DELETE from department where dept_id = ?`,
                delDept.del_Dept,
                (err, res) => {
                  if (err) {
                    console.log(err);
                  }
                  nextQuestions();
                }
              );
            });
        });
        break;
        case "View combined salaries of All Employees in that Department":
          db.query(
            `SELECT d.name, SUM(r.salary) as 'salary'
            FROM employee e
            JOIN role r ON r.role_id = e.role_id
            JOIN department d ON d.dept_id = r.department_id
            GROUP BY d.dept_id
            ORDER BY department_id ASC;`,
            (err, salaries) => {
              if (err) {
                console.log(err);
              }
    
              console.table(salaries);
              nextQuestions();
            }
          );
          break;
  
      case chalk.red("Delete Employee"):
        db.query(`SELECT * FROM employee`, (err, employee) => {
          if (err) {
            console.log(err);
          }
  
          employee.map((e, i) => {
            e["name"] = e.first_name + " " + e.last_name;
            e["value"] = e.emp_id;
          });
          inquirer
            .prompt([
              {
                type: "list",
                message: "Which Employee To Delete?",
                name: "del_Emp",
                choices: employee,
              },
            ])
            .then((delEmp) => {
              db.query(
                `DELETE from employee where emp_id = ?`,
                delEmp.del_Emp,
                (err, res) => {
                  if (err) {
                    console.log(err);
                  }
                  nextQuestions();
                }
              );
            });
        });
        break;
      case chalk.red("Delete Role"):
        db.query(`SELECT * FROM role`, (err, roles) => {
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
                message: "Which Role To Delete?",
                name: "del_Role",
                choices: roles,
              },
            ])
            .then((delRole) => {
              db.query(
                `DELETE from role where role_id = ?`,
                delRole.del_Role,
                (err, res) => {
                  if (err) {
                    console.log(err);
                  }
                  nextQuestions();
                }
              );
            });
        });
        break;
      case chalk.red("Delete Department"):
        db.query(`SELECT * FROM department`, (err, departments) => {
          if (err) {
            console.log(err);
          }
  
          departments.map((e, i) => {
            // e["name"] = e.title
            e["value"] = e.dept_id;
          });
          inquirer
            .prompt([
              {
                type: "list",
                message: "Which Department To Delete?",
                name: "del_Dept",
                choices: departments,
              },
            ])
            .then((delDept) => {
              db.query(
                `DELETE from department where dept_id = ?`,
                delDept.del_Dept,
                (err, res) => {
                  if (err) {
                    console.log(err);
                  }
                  nextQuestions();
                }
              );
            });
        });
        break;
  
      case "Filter Employees by Manager":
        db.query(`SELECT * FROM employee`, (err, employee) => {
          if (err) {
            console.log(err);
          }
  
          employee.map((e, i) => {
            e["name"] = e.first_name + " " + e.last_name;
            e["value"] = e.emp_id;
          });
          inquirer
            .prompt([
              {
                type: "list",
                message: "Which Manager do you want to filter from?",
                name: "viewEmp_Mgr",
                choices: employee,
              },
            ])
            .then((viewEmpByMgr) => {
              db.query(
                `SELECT * from employee where manager_id = ?`,
                viewEmpByMgr.viewEmp_Mgr,
                (err, res) => {
                  if (err) {
                    console.log(err);
                  }
                  console.table(res);
                  nextQuestions();
                }
              );
            });
        });
        break;
  
      case "Filter Employees by Department":
        db.query(`SELECT * FROM department`, (err, departments) => {
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
                message: "Which Department do you want to filter from?",
                name: "viewEmp_Dept",
                choices: departments,
              },
            ])
            .then((viewEmpByDept) => {
              db.query(
                `SELECT * from employee where role_id in (SELECT role_id FROM  role INNER JOIN department ON role.department_id = department.dept_id 
      where department.dept_id=?)`,
                viewEmpByDept.viewEmp_Dept,
                (err, res) => {
                  if (err) {
                    console.log(err);
                  }
                  console.table(res);
                  nextQuestions();
                }
              );
            });
        });
        break;
        
      case chalk.red.bold("Quit"):
        db.end();
        console.log("CONNECT ENDED");
        break;
      default:
        throw new Error("error");
    }
  }
  
  function addDepartment(res) {
    // console.log("Department ADDED!!!")
    // db.query(`INSERT INTO department(name) VALUES('${res.addDept}'); `)
    db.query(`INSERT INTO department(name) VALUES(?);`, res.addDept);
  }
  
  function addRole(addARoleList) {
    db.query(
      `INSERT INTO role(title,salary,department_id) VALUES(?,?,?);`,
      addARoleList,
      (err, res) => {
        // console.log("ROLE ADDED!!!")
        if (err) {
          console.log(err);
        }
      }
    );
  }
  
  function addEmployee(addAEmployeeList) {
    db.query(
      `INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES(?,?,?,?);`,
      addAEmployeeList,
      (err, res) => {
        // console.log("Employee ADDED!!!")
        if (err) {
          console.log(err);
        }
      }
    );
  }
  
  function updateEmployeeRole(updateAnEmployeeRoleList) {
    // console.log(updateRole_role.updEmp_Role)
    db.query(
      `UPDATE employee SET employee.role_id = ? WHERE employee.emp_id = ?`,
      updateAnEmployeeRoleList
    );
  }
  
  function updateEmployeeMgr(updateMgr) {
    db.query(
      `UPDATE employee SET employee.manager_id = ? WHERE employee.emp_id = ?`,
      [updateMgr.updEmpMgr_Id, updateMgr.updEmp_Id]
    );
  }
  
    
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

