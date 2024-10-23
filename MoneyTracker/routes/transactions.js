const express = require('express')
const router = express.Router()
const {v4:uuidv4} = require('uuid')
const db = require('../server')



router.post('/',(req,res)=>{
    const {type,category,amount, date, description} = req.body
    const id = uuidv4()
    const sql = `INSERT INTO transactions(id,type,category,amount, date, description) VALUES (?,?,?,?,?,?)`;
    
    db.run(sql,[id,type,category,amount, date, description],(err)=>{
        if (err){
            res.status(500).json({error: err.message})
        }
        res.status(200).json({id,type,category,amount, date, description})
    })

})

module.exports = router