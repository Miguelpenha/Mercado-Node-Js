const env = require('../config/env').env
require('dotenv').config({
    path: env
})
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
                                if (i.fileName_Img === 'Padrão.png') {
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
                                        ultimo: true,
                                        peso: i.peso
                                    })
                                }
                            } else {
                                if (i.fileName_Img === 'Padrão.png') {
                                    produtos.push({
                                        nome: i.nome_Produto,
                                        desc: i.desc,
                                        img: `/uploads/${i.fileName_Img}`,
                                        preco: i.preco,
                                        id: i.id,
                                        m: m,
                                        pular: pular,
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
                            var quant_preco_vezes = req.cookies.lista[cont].quant
                            var preco_vezes = 'R$'+String(Number(String(req.cookies.lista[cont].preco).replace('R$', '').replace(',', '.'))*quant_preco_vezes).replace('.', ',')
                            lista.push({
                                item: req.cookies.lista[cont],
                                m: m,
                                nome: nome_1,
                                preco_vezes: preco_vezes
                            })
                        }
                    } else {
                        lista = false
                    }
                    var preco_tot = Number()
                    if (lista) {
                        lista.forEach((i) => {
                            preco_tot += Number(String(i.preco_vezes).replace('R$', '').replace(',', '.'))
                        })
                        preco_tot = 'R$'+String(preco_tot).replace('.', ',')
                        if (produtos.length > 11) {
                            res.render('produtos_home', {produtos: produtos, lista: lista, preco_tot: preco_tot, ultimo: true})   
                        } else {
                            res.render('produtos_home', {produtos: produtos, lista: lista, preco_tot: preco_tot, ultimo: false})
                        }
                        
                    } else {
                        if (produtos.length > 11) {
                            res.render('produtos_home', {produtos: produtos, lista: lista, preco_tot: preco_tot, ultimo: true})   
                        } else {
                            res.render('produtos_home', {produtos: produtos, lista: lista, preco_tot: preco_tot, ultimo: false})
                        }
                    }
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
                        if (cont > 5) {
                            var col1 = true
                            if (i.fileName_Img === 'Padrão.png') {
                                produtos.push({
                                    nome: i.nome_Produto,
                                    desc: i.desc,
                                    img: `/uploads/${i.fileName_Img}`,
                                    preco: i.preco,
                                    id: i.id,
                                    m: m,
                                    pular: pular,
                                    peso: i.peso,
                                    col1: col1
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
                                    peso: i.peso,
                                    col1: col1
                                })
                            }
                        } else {
                            var col1 = false
                            if (i.fileName_Img === 'Padrão.png') {
                                produtos.push({
                                    nome: i.nome_Produto,
                                    desc: i.desc,
                                    img: `/uploads/${i.fileName_Img}`,
                                    preco: i.preco,
                                    id: i.id,
                                    m: m,
                                    pular: pular,
                                    peso: i.peso,
                                    col1: col1
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
                                    peso: i.peso,
                                    col1: col1
                                })
                            }
                        }
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
                            var quant_preco_vezes = req.cookies.lista[cont].quant
                            var preco_vezes = 'R$'+String(Number(String(req.cookies.lista[cont].preco).replace('R$', '').replace(',', '.'))*quant_preco_vezes).replace('.', ',')
                            lista.push({
                                item: req.cookies.lista[cont],
                                m: m,
                                nome: nome_1,
                                preco_vezes: preco_vezes
                            })
                        }
                    } else {
                        lista = false
                    }
                    var preco_tot = Number()
                    try {
                        lista.forEach((i) => {
                            preco_tot += Number(String(i.preco_vezes).replace('R$', '').replace(',', '.'))
                        })
                        preco_tot = 'R$'+String(preco_tot).replace('.', ',')
                    } catch {

                    }
                    if (produtos.length > 11) {
                        res.render('produtos_home', {produtos: produtos, lista: lista, preco_tot: preco_tot, ultimo: true})   
                    } else {
                        res.render('produtos_home', {produtos: produtos, lista: lista, preco_tot: preco_tot, ultimo: false})
                    }
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
        var produtos_lista = []
        for (var cont = 0;cont < req.cookies.lista.length;cont++) {
            var quant_preco_vezes = req.cookies.lista[cont].quant
            var preco_vezes = 'R$'+String(Number(String(req.cookies.lista[cont].preco).replace('R$', '').replace(',', '.'))*quant_preco_vezes).replace('.', ',')
            produtos_lista.push({
                nome: req.cookies.lista[cont].nome,
                preco: preco_vezes,
                quant: req.cookies.lista[cont].quant,
                comem: req.cookies.lista[cont].comem
            })
        }
        var msg = ''
        produtos_lista.forEach((i) => {
            msg += `*Nome%20Do%20Produto:*%20${i.nome}\n*Preço:*%20${i.preco}\n*Quantidade:*%20${i.quant}\n*Comentário:*%20${i.comem}\n\n`
        })
        var preco_tot = Number()
        produtos_lista.forEach((i) => {
            preco_tot += Number(String(i.preco).replace('R$', '').replace(',', '.'))
        })
        preco_tot = 'R$'+String(preco_tot).replace('.', ',')
        msg += '*Total:* '+preco_tot
        res.cookie('lista', '', {maxAge: 0})
        res.redirect(`https://api.whatsapp.com/send?phone=${process.env.NUMERO}&text=${msg}`)
    })
    produtos.post('/cls-lista', (req, res) => {
        res.cookie('lista', '', {maxAge: 0})
        res.redirect('/produtos')
    })
// Exportando
    module.exports = produtos