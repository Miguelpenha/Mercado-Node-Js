require('dotenv').config()
const ProdutoModels = require('../models/Produto')
const express = require('express')
const admin = express.Router()
const fs = require('fs')
const path = require('path')

// Rotas
    admin.get('/', (req, res) => {
        if (req.cookies.admin) {
            res.redirect('/admin/painel-admin')
        } else {
            res.status(404).render('404')
        }
    })
    admin.get('/envi', (req, res) => {
        if (req.cookies.admin) {
            if (req.query.edit) {
                ProdutoModels.findById(req.query.id, (err, result) => {
                    res.render('admin/envi', {senha: process.env.SENHA_ADMIN, edit: true, nome: result.nome_Produto, categoria: result.categoria, fileName_Img: result.fileName_Img, nomeOrigin: result.nomeOrigin, peso: result.peso, marca: result.marca, preco: result.preco, desc: result.desc, id: result.id, login: process.env.LOGIN_ADMIN})
                })
            } else {
                res.render('admin/envi', {senha: process.env.SENHA_ADMIN, login: process.env.LOGIN_ADMIN})
            }
        } else {
            res.status(404).render('404')
        }
    })
    admin.get('/login', (req, res) => {
        if (req.cookies.admin) {
            res.redirect('/admin/painel-admin')
        } else {
            res.render('admin/login')
        }
    })
    admin.post('/veri-login', (req, res) => {
        if (req.body.senha === process.env.SENHA_ADMIN && req.body.login === process.env.LOGIN_ADMIN) {
            res.cookie('admin', {admin: true})
            res.redirect('/admin/painel-admin')
        } else {
            req.flash('erro_msg', 'Crendenciais Incorretas')
            res.redirect('/admin/login')
        }
    })
    admin.get('/painel-admin', (req, res) => {
        if (req.cookies.admin) {
            var produtos = []
            var pular = 0
            var mul2 = 1
            var m = 0
            var mul = 1
            var cont = 0
            var l = true
            ProdutoModels.find({}, (err, result) => {
                result.forEach((i) => {
                    if (cont%2 === 0 && cont !== 0) {
                        pular =+ 10 * mul2
                        mul2++
                        m = 0
                        mul = 1
                    }
                    if (cont%2 === 0) {
                        l = false
                    } else {
                        l = true
                    }
                    produtos.push({produto: {
                        nome: i.nome_Produto,
                        desc: i.desc,
                        preco: i.preco,
                        id: i.id,
                        vendas: i.vendas,
                        pular: pular,
                        l: l
                    }})
                    cont++
                })
                res.render('admin/painel-admin', {produtos: produtos})
            })
        } else {
            res.status(404).render('404')
        }
    })
    admin.post('/exclu-produto', (req, res) => {
        ProdutoModels.findById(req.body.id, (err, result) => {
            try {
                if (result.fileName_Img === 'Padrão.png') {
                    fs.unlink(path.resolve(__dirname, '..' ,'public', 'uploads', result.fileName_Img), (err) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                } else {
                    fs.unlink(path.resolve(__dirname, '..' ,'public', 'uploads', 'baixados', result.fileName_Img), (err) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                }
            } catch {
                
            }
        })
        ProdutoModels.deleteOne({_id: req.body.id}, (err, result) => {
            req.flash('sucesso_msg', 'Produto Deletado Com Sucesso')
            res.redirect('painel-admin')
        })
    })
    admin.get('/cls-login', (req, res) => {
        if (req.cookies.admin) {
            ProdutoModels.find({}, (err, result) => {
                if (result.length === 0) {
                    req.flash('alert_msg', 'Não Há Produtos Cadastrados Para Deletar')
                    res.redirect('/admin/painel-admin')
                } else {
                    res.render('admin/cls-login', {login: process.env.LOGIN_ADMIN})
                }
            })
        } else {
            res.status(404).render('404')
        }
    })
    admin.post('/cls', (req, res) => {
        if (req.body.senha === process.env.SENHA_ADMIN && req.body.login === process.env.LOGIN_ADMIN) {
            ProdutoModels.find({}, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    result.forEach((i) => {
                        if (i.fileName_Img === 'Padrão.png') {
                            
                        } else {
                            fs.unlink(path.resolve(__dirname, '..', 'public', 'uploads', 'baixados', i.fileName_Img), (err) => {
                                if (err) {
                                    console.log(err)
                                }
                            })
                        }
                    })
                }
            })
            ProdutoModels.deleteMany({}, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    if (req.body.api === 'true') {
                        if (result.deletedCount === 0) {
                            res.json('Não Há Produtos Cadastrados Para Deletar')
                        } else {
                            res.json({produtosExcluidos: result.deletedCount})
                        }
                    } else {
                        if (result.deletedCount === 0) {
                            req.flash('alert_msg', 'Não Há Produtos Cadastrados Para Deletar')
                            res.redirect('/admin/painel-admin')
                        } else {
                            req.flash('sucesso_msg', `${result.deletedCount} Produtos Foram Deletados com Sucesso`)
                            res.redirect('/admin/painel-admin')
                        }
                    }
                }
            })
        } else {
            if (req.body.api === 'true') {
                res.json('Senha Ou Login Inválidos')
            } else {
                req.flash('erro_msg', 'Senha Inválida')
                res.redirect('/admin/cls-login')
            }
        }
    })
// Exportando
    module.exports = admin