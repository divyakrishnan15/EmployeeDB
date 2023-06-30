const express = require('express')
const app = express()
const inquirer = require('inquirer')
const dbCommands = require('./dbCommands.js')

const PORT = process.env.PORT || 2000

app.use(express.json())
app.use(express.urlencoded({extended:true}))



const questions = inquirer.prompt([
    {
        type:'checkbox',
        message: 'What would you like to do?',
        name: 'action',
        choices:['View All Departments','View All Roles','View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
    },
    {
        type:'input',
        message: "What is the department's name?",
        name: 'aDN',
        when: (res) => res.action == 'Add a Department'
    },
    {
        type:'input',
        message: "What is the department's ID?",
        name: 'aDId',
        when: (res) => res.action == 'Add a Department'
    }
]).then((res)=>{
    // console.log("RES", res.choice)
    dbCommands.dbViewQueries(res)
})


app.listen(PORT,()=>{
    console.log(`SQL challenge http://localhost:${PORT}`)
})