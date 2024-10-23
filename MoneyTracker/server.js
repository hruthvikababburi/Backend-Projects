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
    db.run(
        `CREATE TABLE IF NOT EXISTS transactions(
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        description TEXT NOT NULL
        )`
    )

    db.run(
        `CREATE TABLE IF NOT EXISTS categories(
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL
        )`
    )             
})

module.exports = db