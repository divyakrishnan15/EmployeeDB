const sql = require('mysql2')

const db = sql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'Div51Root',
        database:'employee_db'
    },
    console.log(`Connected to DB`)
)

function dbViewQueries(res){

    const response= res.action[0]

    switch (response){
        case 'View All Departments':
            console.log('innn')
            db.query('SELECT * FROM department',(err,res) => {
                console.table(res)
                if(err){
                    console.log(err)
                }
            })
            break;
        case 'View All Roles':
            db.query('SELECT * FROM role',(err,res) => {
                console.table(res)
                if(err){
                    console.log(err)
                }
            })
        break;
        case 'View All Employees':
            db.query('SELECT * FROM employee',(err,res) => {
                console.table(res)
                if(err){
                    console.log(err)
                }
            })
        break;
        default:
            (err)=>{
                if(err){
                    console.log(err)
                }
            }
            
            // throw new Error('db failed')
            
    }
}

//     if(res.action == 'View All Departments'){
//         db.query('SELECT * FROM department',(err,res) => {
//             console.log(res)
//             if(err){
//                 console.log(err)
//             }
//         })
//     }
//     if(res.action == 'View All Roles'){
//         db.query('SELECT * FROM roles',(err,res) => {
//             console.log(res)
//             if(err){
//                 console.log(err)
//             }
//         })
//     }
//     if(res.action == 'View All Employees'){
//         db.query('SELECT * FROM employees',(err,res) => {
//             console.log(res)
//             if(err){
//                 console.log(err)
//             }
//         })
//     }
//     else if(res.aDN && res.aDId){
//         db.query(`INSERT INTO department(id,name) VALUES( ${res.aDId}, '${res.aDN}');`,(err,res) => {
//             console.log(res)
//             if(err){
//                 console.log(err)
//             }
//         })
//     }
// }

module.exports = {dbViewQueries}