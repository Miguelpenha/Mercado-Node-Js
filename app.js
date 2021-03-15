// Importações
    require('dotenv').config()
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const mongoose = require('mongoose')
    const app = express()
    const apiRouter = require('./routes/api')
    const produtosRouter = require('./routes/produtos')
    const adminRouter = require('./routes/admin')
    const morgan = require('morgan')
    const multer = require('multer')
    const multerConfig = require('./config/multer.js')
    const ProdutoModels = require('./models/Produto')
    const session = require('express-session')
    const flash = require('connect-flash')
    const cepPromise = require('cep-promise')
    const cookieParser = require('cookie-parser')
    const crypto = require('crypto')
    const path = require('path')
    const fs = require('fs')
    const urlMongo = require('./config/db').urlMongo
    const { assert } = require('console')
// Config geral
    // Sessão
        app.use(session({
            secret: process.env.SECRET_KEY,
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    // Middleware
        app.use((req, res, next) => {
            res.locals.erro_msg = req.flash('erro_msg')
            res.locals.sucesso_msg = req.flash('sucesso_msg')
            res.locals.alert_msg = req.flash('alert_msg')
            res.locals.primario_msg = req.flash('primario_msg')
            next()
        })
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Express HandleBars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // Mongoose
        mongoose.connect(urlMongo, {useNewUrlParser: true, useUnifiedTopology: true})
    // Public
        app.use(express.static(path.join(__dirname, 'public')))
    // Morgan
        app.use(morgan('dev'))
    // Cookie
        app.use(cookieParser())
    // Grupo de rotas
        app.use('/api', apiRouter)
        app.use('/produtos', produtosRouter)
        app.use('/admin', adminRouter)
    // Rotas solo
        app.get('/', (req, res) => {
            if (req.cookies.Localização) {
                res.redirect('/produtos')
            } else {
                if (req.query.erro) {
                    res.render('index', {erro: req.query.erro})
                } else {
                    res.render('index')
                }
            }
        })
        app.post('/veri', async(req, res) => {
            if (req.query.cep === 'true') {
                try {
                    const cep = await cepPromise(req.body.cep)
                    const envi = {
                        estado: cep.state,
                        cidade: cep.city,
                        bairro: cep.neighborhood,
                        rua: cep.street,
                        servico: cep.service
                    }
                    res.redirect(`/edit?estado=${envi.estado}?cidade=${envi.cidade}?bairro=${envi.bairro}?rua=${envi.rua}`)
                } catch {
                    res.redirect(`/?erro=CEP Inválido`)
                }
            }
        })
        app.post('/veri-edit-exclu', async(req, res) => {
            const envi = req.cookies.Localização
            
            res.redirect(`/edit?estado=${envi.Estado}?cidade=${envi.Cidade}?bairro=${envi.Bairro}?rua=${envi.Rua}?num=${envi.NumeroDaCasa}?comple=${envi.ComplementoOuReferencia}?exclu=true`)
        })
        app.get('/edit', (req, res) => {
            if (String(String(req.query.estado).split('?')[6]).split('=')[1] && req.cookies.Localização) {
                res.render('edit', {
                    estado: String(req.query.estado).split('?')[0],
                    cidade: String(String(req.query.estado).split('?')[1]).split('=')[1],
                    bairro: String(String(req.query.estado).split('?')[2]).split('=')[1],
                    rua: String(String(req.query.estado).split('?')[3]).split('=')[1],
                    num:String(String(req.query.estado).split('?')[4]).split('=')[1],
                    comple: String(String(req.query.estado).split('?')[5]).split('=')[1],
                    exclu: true
                })
            } else {
                res.render('edit', {
                    estado: String(req.query.estado).split('?')[0],
                    cidade: String(String(req.query.estado).split('?')[1]).split('=')[1],
                    bairro: String(String(req.query.estado).split('?')[2]).split('=')[1],
                    rua: String(String(req.query.estado).split('?')[3]).split('=')[1]
                })
            }
        })
        app.post('/veri-produto', multer(multerConfig).single('file'), async(req, res) => {
            if (req.body.senha === process.env.SENHA_ADMIN && req.body.login === process.env.LOGIN_ADMIN) {
                if (req.query.edit) {
                    try {
                        const produtoEnvi = await ProdutoModels.findByIdAndUpdate({_id: req.body.id},
                            {
                            nome_Produto: req.body.nome,
                            categoria: req.body.categoria,
                            peso: String(req.body.peso),
                            marca: req.body.marca,
                            desc: req.body.desc,
                            fileName_Img: String(req.file.filename).replace(' ', '-').replace(' ', '-'),
                            nomeOrigin: req.file.originalname,
                            preco: req.body.preco
                        })
                        if (req.body.api === 'true') {
                            res.json(produtoEnvi)
                        } else {
                            req.flash('primario_msg', 'Produto Editado Com Sucesso')
                            res.redirect('/admin/painel-admin')
                        }
                    }
                    catch {
                        const produtoEnvi = await ProdutoModels.findByIdAndUpdate({_id: req.body.id},
                            {
                            nome_Produto: req.body.nome,
                            categoria: req.body.categoria,
                            peso: String(req.body.peso),
                            marca: req.body.marca,
                            desc: req.body.desc,
                            fileName_Img: req.body.fileName_Img,
                            nomeOrigin: req.body.originalname,
                            preco: req.body.preco
                        })
                        if (req.body.api === 'true') {
                            res.json(produtoEnvi)
                        } else {
                            req.flash('primario_msg', 'Produto Editado Com Sucesso')
                            res.redirect('/admin/painel-admin')
                        }
                    }
                } else {
                    try {
                        const produtoEnvi = await ProdutoModels.create({
                            nome_Produto: req.body.nome,
                            categoria: req.body.categoria,
                            peso: String(req.body.peso),
                            marca: req.body.marca,
                            desc: req.body.desc,
                            fileName_Img: String(req.file.filename).replace(' ', '-').replace(' ', '-'),
                            nomeOrigin: req.file.originalname,
                            preco: req.body.preco
                        })
                        if (req.body.api === 'true') {
                            res.json(produtoEnvi)
                        } else {
                            req.flash('sucesso_msg', 'Produto Cadastrado Com Sucesso')
                            res.redirect('/admin/painel-admin')
                        }
                    }
                    catch {
                        const produtoEnvi = await ProdutoModels.create({
                            nome_Produto: req.body.nome,
                            categoria: req.body.categoria,
                            peso: String(req.body.peso),
                            marca: req.body.marca,
                            desc: req.body.desc,
                            preco: req.body.preco
                        })
                        if (req.body.api === 'true') {
                            res.json(produtoEnvi)
                        } else {
                            req.flash('sucesso_msg', 'Produto Cadastrado Com Sucesso')
                            res.redirect('/admin/painel-admin')
                        }
                    }
                }
            } else {
                if (req.body.api === 'true') {
                    res.json('Houve Um Erro Ao Cadastrar o Produto')
                } else {
                    req.flash('erro_msg', 'Houve Um Erro Ao Cadastrar o Produto')
                    res.redirect('/admin/painel-admin')
                }
            }
        })
        app.post('/edit-veri', (req, res) => {
            const Localizacao = {
                Estado: req.body.estado,
                Cidade: req.body.cidade,
                Bairro: req.body.bairro,
                Rua: req.body.rua,
                NumeroDaCasa: req.body.num,
                ComplementoOuReferencia: req.body.comple
            }
            res.cookie('Localização', Localizacao)
            res.redirect('/produtos')
        })
        app.post('/loca-delete', (req, res) => {
            res.cookie('Localização', '', {maxAge: 0})
            res.redirect('/')
        })
        app.post('/veri-cadas-lis', (req, res) => {
            ProdutoModels.findById(req.body.id, (err, result) =>  {
                function id_2(id) {
                    var id3 = crypto.randomBytes(16, (err, hash) => {
                        if (err) {
                            console.log(err)
                        }
                        const id2 = `${hash.toString('hex')}${id}`
                        return id2
                    })
                    return id3
                }
                crypto.randomBytes(16, (err, hash) => {
                    if (err) {
                        console.log(err)
                    }
                    const id2 = `${hash.toString('hex')}${req.body.id}`
                    const envi = [
                        req.body.id={
                            id: req.body.id,
                            preco: req.query.preco,
                            comem: req.body.comem,
                            nome: result.nome_Produto,
                            quant: req.body.quant_preco,
                            marca: result.marca,
                            desc: result.desc,
                            id2: id2
                        }
                    ]
                    if (req.cookies.lista) {
                        const envi2 = req.cookies.lista
                        envi2.forEach((i) => {
                            envi.push(i)
                        })
                    }
                    res.cookie('lista', envi)
                    res.redirect('/produtos')
                })
                
            })
        })
        app.post('/veri-exclu-lis', (req, res) => {
            var id2 = req.body.id2
            var lista = []
            req.cookies.lista.forEach((i) => {
                if (i.id2 === id2) {
                    
                } else {
                    lista.push(i)
                }
            })
            res.cookie('lista', lista)
            res.redirect('/produtos')
        })
        app.get('/lista', (req, res) => {
            res.render('lista', {lista: req.cookies.lista})
        })
        // Erro 404
            app.use(function(req, res, next) {
                res.status(404).render('404')
            })
// Config de porta
    app.listen(process.env.PORT || process.env.PORTA, () => {
        console.log('Servidor Rodando')
    })