const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const mysql = require("mysql");
const mysqlConnection = require("./dbconfig.js")
const bcrypt = require("bcrypt")

const PORT = process.env.PORT || 5000


app.use(bodyParser.json())


app.post("/dbcreation",(req,res)=>{
    try{

        mysqlConnection.query("CREATE DATABASE MYTASK",(err,data)=>{
            if(!err){
                return res.status(200).json({message:"db created sucessfully!..."})
            }
        })

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
})


app.post("/tablecreation",(req,res)=>{
    try{

        const tableQuery = "CREATE TABLE IF NOT EXISTS users (name VARCHAR(30), email VARCHAR(30), password VARCHAR(300))"
        mysqlConnection.query(tableQuery,(err,data)=>{
            if(!err){
                return res.status(200).json({message:"table created sucessfully!..."})
            }
        })

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
})


app.post("/register",(req,res)=>{

    try{


        const {name,email,password} = req.body;
        const tableValues = "INSERT INTO users SET ?"
        const userExist = "SELECT * FROM  users WHERE email = ?"

        mysqlConnection.query(userExist, email, (err,data)=>{
            if(err){
                console.log(err)
                return res.status(404).send("server error...")
            }if (data.length > 0){
                return res.status(404).send("user already exist..")
            }

            bcrypt.hash(password,10,(err,hashedPassword)=>{
                if(err){
                    console.log(err)
                    return res.status(500).send("server error...")
                }

            mysqlConnection.query(tableValues,{name,email,password: hashedPassword},(err,data)=>{
                if(err){
                    return res.status(500).send("Server error...")
                }else{
                    return res.status(200).send("users sucessfully registered...")
                }
            })
            })
        })


    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
})


app.post("/login", async (req,res)=>{

    try{

        const {email , password } = req.body;
        const usersQuery = "SELECT * FROM users WHERE email = ?"

        mysqlConnection.query(usersQuery,email, async (err,data)=>{
            if(err){
                console.log(err)
                return res.status(404).send("server error...")
            }if (data.length === 0){
                return res.status(404).send("no user found...")
            }
            const user = data[0];
            const passwordMatch = await bcrypt.compare(password,user.password)
            if(!passwordMatch){
                return res.status(401).send("Invalid password!...")
            }
            return res.status(200).json({message:"logged in sucessfully",user})
        })

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
})


app.get("/users",(req,res)=>{
    try{

        let UsersQuery = "SELECT * FROM users"
        mysqlConnection.query(UsersQuery,(err,data)=>{
            if(!err){
                return res.status(200).json(data)
            }else if(data.length ===0){
                return res.status(200).send("no users are found in db")
            }
        })

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
})

app.delete("/delete",(req,res)=>{
    try{

        let deleteQuery = "DELETE FROM users"
        mysqlConnection.query(deleteQuery,(err,data)=>{
            if(!err){
                return res.status(200).json({message:"Deleted users sucessfully..."})
            }
        })

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
})


app.listen(PORT,()=>{
    console.log(`server running on a ${PORT} Port...`)
})