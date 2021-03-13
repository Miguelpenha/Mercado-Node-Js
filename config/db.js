require('dotenv').config()
if (process.env.NODE_ENV == 'production') {
    module.exports = {urlMongo: process.env.URL_MONGO_PRODUCAO}
} else {
    module.exports = {urlMongo: process.env.URL_MONGO_TESTE}
}