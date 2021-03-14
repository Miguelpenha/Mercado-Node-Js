const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

module.exports = {
    dest: path.resolve(__dirname, '..', 'public', 'uploads', 'baixados'),
    storage: multer.diskStorage({
        destination:(req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', 'public', 'uploads', 'baixados'))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err)
                const fileName = `${hash.toString('hex')}-${String(file.originalname).replace(' ', '-').replace(' ', '-').replace(' ', '-')}`
                cb(null, fileName)
            })
        }
    }),
    limits: {
        fileSize: 20 * 1024 * 1024,
    }
}