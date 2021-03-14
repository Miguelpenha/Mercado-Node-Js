const ProdutoModels = require('../models/Produto')
const express = require('express')
const api = express.Router()

api.get('/', (req, res) => {
    if (req.body.login === process.env.LOGIN_ADMIN && req.body.senha === process.env.SENHA_ADMIN) {
        ProdutoModels.find({}, (err, result) => {
            if (result.length === 0) {
                res.json('Não Existem Produtos Cadastrados')
            } else {
                res.json({TotalDeProdutos: result.length, Produtos: result})
            }
        })
    } else {
        res.json('Senha Ou Login Inválidos')
    }
})
module.exports = api