const http = require('http')

const app = require('./app')

const { loadAllPlanets } = require('./models/planets.model')
const { mongoConnect } = require('./services/mongo')
const { loadLaunchesData } = require('./models/launches.model')

const PORT = process.env.PORT || 5000

const server = http.createServer(app)

async function startServer() {
  await mongoConnect()
  await loadAllPlanets()
  await loadLaunchesData()

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}

startServer()
