const http = require('http')
const mongoose = require('mongoose')
require('dotenv').config()

const app = require('./app')

const { loadAllPlanets } = require('./models/planets.model')

const PORT = process.env.PORT || 5000

const MONGO_URL = process.env.MONGO_URL

const server = http.createServer(app)

mongoose.connection.once('open', () => {
  console.log(`MongoDB connected remotely => Atlas!`)
})
mongoose.connection.on('error', (err) => {
  console.error(err)
})

async function startServer() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  await loadAllPlanets()

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
}

startServer()
