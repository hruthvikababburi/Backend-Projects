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
            return res.status(500).json({error: err.message})
        }
        return res.status(200).json({id,type,category,amount, date, description})
    })

})

router.get('/',(req,res)=>{
    const sql = `SELECT * FROM transactions`
    
    db.all(sql,[],(err,data)=>{
        if(err){
            return res.status(500).json({error:err.message})
        }
        return res.status(200).json({transactions:data})
    })
})

router.get('/:id',(req,res)=>{
    const {id} = req.params;
    const sql = `SELECT * FROM transactions WHERE id = ?`;

    db.get(sql,[id],(err,data)=>{
        if(err){
            return res.status(500).json({error:err.message})
        }
        if(!data){
            return res.status(404).json({error: 'Transaction not found!'})
        }
        return res.status(200).json(data)
    })
})

router.put('/:id',(req,res)=>{
    const {id} = req.params
    const {type,category,amount, date, description} = req.body
    const sql = `UPDATE transactions SET type=?, category=?, amount=?, date=?, description=? WHERE id=?`

   db.run(sql,[type,category,amount,date,description,id],function (err){
    if (err){
        return res.status(500).json({error: err.message})
    }
    if (this.changes === 0){
        return res.status(404).json({error: 'Transaction not found!'})
    }
    return res.status(200).json({message:"Transaction updated successfuly!"})
   })
})

router.delete('/:id',(req,res)=>{
    const {id}=req.params;
    const sql = `DELETE FROM transactions WHERE id = ?`;

    db.run(sql,[id],function(err){
        if (err){
            return res.status(500).json({error: err.message})
        }
        if (this.changes === 0){
            return res.status(404).json({error: 'Transaction not found!'})
        }
        return res.status(200).json({message: "transaction deleted successfully!"})
    })
})

router.get('/summary',(req,res)=>{
    const sql = `SELECT 
                    SUM(CASE WHEN type= "Income" THEN amount ELSE 0 END) AS totalIncome,
                    SUM(CASE WHEN type= "Expenses" THEN amount ELSE 0 END) AS totalExpenses
                FROM transactions`;
    
    db.get(sql,[],(err,data)=>{
        if(err){
            return res.status(500).json({error: err.message})
        }
        const totalIncome = data.totalIncome || 0; // default to 0 if null
        const totalExpenses = data.totalExpenses || 0; // default to 0 if null
        const balanceAmount = totalIncome - totalExpenses;

       
        res.status(200).json({totalIncome, totalExpenses, balanceAmount})
    })            

})

module.exports = router