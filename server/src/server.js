const http = require('http')
const mongoose = require('mongoose')

const app = require('./app')

const { loadAllPlanets } = require('./models/planets.model')

const PORT = process.env.PORT || 5000



const server = http.createServer(app)

async function startServer() {
  await loadAllPlanets()

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
}

startServer()
