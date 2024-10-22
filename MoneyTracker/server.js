const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('./databases/expensesTracker.db')

db.serialize(()=>{
    db.run(
        `CREATE TABLE IF NOT EXISTS transactions`
    )
})