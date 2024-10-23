const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./databases/expensesTracker.db', (err)=>{
    if (err){
        console.error('Error while connecting to database: ',err)
    }
    else{
        console.log('Connected to database')
    }
})

db.serialize(()=>{
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )`,(err)=>{
        if(err){
            console.log('Error creating table',err)
        }
        console.log('Users table is created and ready to use')
    });


    db.run(
        `CREATE TABLE IF NOT EXISTS transactions(
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        amount INTEGER NOT NULL,
        date TEXT NOT NULL,
        description TEXT
        )`,(err)=>{
            if(err){
                console.log('Error creating table',err)
            }
            console.log('Transactions table is created and ready to use')
        }
    )

    db.run(
        `CREATE TABLE IF NOT EXISTS categories(
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL
        )`,(err)=>{
            if(err){
                console.log('Error creating table',err)
            }
            console.log('Categories table is created and ready to use')
        }
    )             
})

module.exports = db