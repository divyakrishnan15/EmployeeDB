const sql=require('mysql2')

require('dotenv').config()

const db=sql.createConnection({
    host:'localhost',
    user:'root',
    password:process.env.password,
    database:'employee_db'
},
)


module.exports={db}