const ProdutoModels = require('../models/Produto')
const express = require('express')
const api = express.Router()

api.get('/', (req, res) => {
    ProdutoModels.find({}, (err, result) => {
        if (result.length === 0) {
            res.json('Não Existem Produtos Cadastrados')
        } else {
            res.json({TotalDeProdutos: result.length, Produtos: result})
        }
    })
})
module.exports = api