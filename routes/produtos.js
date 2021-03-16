require('dotenv').config()
const ProdutoModels = require('../models/Produto')
const express = require('express')
const produtos = express.Router()
const crypto = require('crypto')

// Rotas
    produtos.get('/', (req, res) => {
        if (!req.cookies.Localização) {
            res.status(404).render('404')
        } else {
            const produtos = []
            ProdutoModels.find({}, (err, result) => {
                var l = true
                var m = 0
                var cont = 0
                var mul = 1
                var pular = 0
                var mul2 = 1
                if (result.length > 12) {
                    result.forEach((i) => {
                        if (cont < 12) {
                            if (l === false) {
                                l = true
                            } else {
                                l = false
                                
                            }
                            if (cont > 0) {
                                m =+ 10.8 * mul
                                mul++
                            }
                            if (cont%6 === 0 && cont !== 0) {
                                pular =+ 16.5 * mul2
                                mul2++
                                m = 0
                                mul =1
                            }
                            if (cont === 11) {
                                produtos.push({
                                    nome: i.nome_Produto,
                                    desc: i.desc,
                                    img: `/uploads/${i.fileName_Img}`,
                                    preco: i.preco,
                                    id: i.id,
                                    m: m,
                                    pular: pular,
                                    ultimo: true,
                                    peso: i.peso
                                })
                            } else {
                                produtos.push({
                                    nome: i.nome_Produto,
                                    desc: i.desc,
                                    img: `/uploads/baixados/${i.fileName_Img}`,
                                    preco: i.preco,
                                    id: i.id,
                                    m: m,
                                    pular: pular,
                                    peso: i.peso
                                })
                            }
                            cont++
                        }
                    })
                    var lista = []
                    if (req.cookies.lista !== undefined) {
                        var m = 0
                        var cont = 0
                        var mul = 1
                        for (var cont = 0;cont < req.cookies.lista.length;cont++) {
                            l = true
                            l = false
                            if (cont >= 0) {
                                m =+ 30 * mul
                                mul++
                            }
                            var nome = req.cookies.lista[cont].nome
                            var nome_1 = ''
                            if (nome.length > 30) {
                                for (var cont2 = 0;cont2 < 27;cont2++) {
                                    nome_1 += nome[cont2]
                                }
                                nome_1 = nome_1+'...'
                            } else {
                                nome_1 = false
                            }
                            lista.push({
                                item: req.cookies.lista[cont],
                                m: m,
                                nome: nome_1
                            })
                        }
                    } else {
                        lista = false
                    }
                    res.render('produtos_home', {produtos: produtos, lista: lista})
                } else {
                    result.forEach((i) => {
                        if (l === false) {
                            l = true
                        } else {
                            l = false
                            
                        }
                        if (cont > 0) {
                            m =+ 10.8 * mul
                            mul++
                        }
                        if (cont%6 === 0 && cont !== 0) {
                            pular =+ 16.5 * mul2
                            mul2++
                            m = 0
                            mul =1
                        }
                        produtos.push({
                            nome: i.nome_Produto,
                            desc: i.desc,
                            img: `/uploads/baixados/${i.fileName_Img}`,
                            preco: i.preco,
                            id: i.id,
                            m: m,
                            pular: pular,
                            peso: i.peso
                        })
                        cont++
                    })
                    var lista = []
                    if (req.cookies.lista !== undefined) {
                        var m = 0
                        var cont = 0
                        var mul = 1
                        for (var cont = 0;cont < req.cookies.lista.length;cont++) {
                            l = true
                            l = false
                            if (cont >= 0) {
                                m =+ 20 * mul
                                mul++
                            }
                            var nome = req.cookies.lista[cont].nome
                            var nome_1 = ''
                            if (nome.length > 30) {
                                for (var cont2 = 0;cont2 < 27;cont2++) {
                                    nome_1 += nome[cont2]
                                }
                                nome_1 = nome_1+'...'
                            } else {
                                nome_1 = false
                            }
                            lista.push({
                                item: req.cookies.lista[cont],
                                m: m,
                                nome: nome_1
                            })
                        }
                    } else {
                        lista = false
                    }
                    res.render('produtos_home', {produtos: produtos, lista: lista})
                }
            })
        }
    })
    produtos.get('/:id', (req, res) => {
        if (req.cookies.Localização) {
            ProdutoModels.findOne({_id: req.params.id}, (err, result) => {
                if (err) {
                    console.log(err)
                }
                if (!result) {
                    res.status(404).render('404')
                } else {
                    function kg(peso1) {
                        const peso = String(peso1)
                        var existe = true
                        for (var cont = 0;cont <= peso.length;cont++) {
                            if (peso[cont] === '.') {
                                return false
                            }
                        }
                        return existe
                    }
                    if (kg(result.peso) === true) {
                        var peso = `${result.peso}`
                        res.render('produtos', {
                            img: `/uploads/baixados/${result.fileName_Img}`,
                            categoria: result.categoria,
                            nome: result.nome_Produto,
                            marca: result.marca,
                            peso: peso,
                            desc: result.desc
                        })
                    } else {
                        var peso = `${result.peso}`
                        res.render('produtos', {
                            img: `/uploads/baixados/${result.fileName_Img}`,
                            categoria: result.categoria,
                            nome: result.nome_Produto,
                            marca: result.marca,
                            peso: peso,
                            desc: result.desc
                        })
                    }
                }
            })
        } else {
            res.status(404).render('404')
        }
        
    })
    produtos.post('/pedir', (req, res) => {
        req.cookies.lista.forEach((i) => {
            console.log({
                nome: i.nome,
                preco: i.preco,
                comem: i.comem
            })
            res.redirect(`https://api.whatsapp.com/send?phone=${process.env.NUMERO}&amp;text=Nome%20Do%20Produto:%20${i.nome}\nPreço:%20%${i.preco}\nComentário:%20${i.comem}`)
        })
    })
// Exportando
    module.exports = produtos