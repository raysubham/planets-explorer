const http = require('http')
const mongoose = require('mongoose')

const app = require('./app')

const { loadAllPlanets } = require('./models/planets.model')

const PORT = process.env.PORT || 5000

const MONGO_URL =
  'mongodb+srv://planets-api:bppQGlNsKdfh5Gi3@planets-database.buupv.mongodb.net/planets?retryWrites=true&w=majority'

const server = http.createServer(app)

mongoose.connection.once('open', () => {
  console.log(`MongoDB started!`)
})
mongoose.connection.on('error', (err) => {
  console.log(err)
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
