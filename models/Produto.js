const mongoose = require('mongoose')

const ProdutoSchema = new mongoose.Schema({
    nome_Produto: String,
    createAt: {
        type: Date,
        default: Date.now()
    },
    categoria: String,
    fileName_Img: {
        type: String,
        default: 'Padrão.png'
    },
    peso: String,
    marca: String,
    desc: String,
    nomeOrigin: {
        type: String,
        default: 'Padrão.png'
    },
    preco: String,
    vendas: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('produtos', ProdutoSchema)
