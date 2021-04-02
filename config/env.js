const path = require('path')
const fs = require('fs')

if (fs.existsSync(path.resolve(__dirname, '../', '.env'))) {
    module.exports = {env: '.env'}
    console.log('Usando o arquivo .env')
} else {
    module.exports = {env: '.exemplo.env'}
    console.log('Usando o arquivo .exemplo.env')
}
