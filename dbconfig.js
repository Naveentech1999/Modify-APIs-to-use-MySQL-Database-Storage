
const mysql = require("mysql");

let connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"bnaveenkumar",
    database:"mytask"
})


connection.connect((err)=>{
    if(err){
        console.log(err,"error in connecting in database...")
    }else{
        console.log("Database connected sucessfully...")
    }
})


module.exports = connection