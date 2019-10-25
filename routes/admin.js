const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/addusuario',(req,res)=>{
    res.render('admin/addusuario')
})

module.exports = router