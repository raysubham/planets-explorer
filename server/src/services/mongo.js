const mongoose = require('mongoose')
require('dotenv').config()

const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once('open', () => {
  console.log(`MongoDB connected remotely => Atlas!`)
})
mongoose.connection.on('error', (err) => {
  console.error(err)
})

async function mongoConnect() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
}

async function mongoDisconnect() {
  await mongoose.disconnect()
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
}
