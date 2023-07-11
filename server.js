const express = require("express");
const app = express();
const inquirer = require("inquirer");
const chalk = require('chalk')
const dbCommands = require("./dbCommands.js");
const questions = require("./questions.js")
const figlet = require("figlet")

require('dotenv').config();
const PORT = process.env.PORT || 2000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


figlet.text(`Employee`, function (err, data) {
  console.log(chalk.green.bold(data));

  figlet.text("Manager", {
    // font: "Ghost",
    horizontalLayout: "fitted",
    verticalLayout: "default",
    width: 100,
    whitespaceBreak: true,
  }, function (err, data) {
    console.log(chalk.blue.bold(data));
    inquirer.prompt(questions)
    .then((res) => {
      dbCommands.dbQueries(res);
    })
    .catch((err) => {
      console.log(err);
    });
  })
})


app.use((req, res) => {
  res.status(404).end();
});

// app.listen(PORT, () => {
//   console.log(chalk.blue.bold(`SQL challenge = http://localhost:${PORT}`));
// });

