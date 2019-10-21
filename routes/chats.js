const express = require('express')
const router = express.Router()
const fs = require('fs')



router.get('/index/:nome/:sala', (req, res) => {
    var texto = req.params.nome
    var sal = req.params.sala
    res.render('chat/index', { texto, sal })
})

router.get('/privado/:nome', (req, res) => {
    var texto = req.params.nome
    //var sal = req.params.sala
    res.render('chat/privado', { texto})
})

router.get('/conversas', (req, res) => {
    res.render('chat/conversas')
})

module.exports = router