const express = require('express')
const path = require('path')
const cors = require('cors')
// const morgan = require('morgan')

const planetsRouter = require('./routes/planets/planets.router')
const launchesRouter = require('./routes/launches/launches.router')

const app = express()

// disable this for production because cors is not needed as the static files are served via express

// app.use(
//   cors({
//     origin: 'https://localhost:3000',
//   })
// )

//diasbled for production as it consumes more disk space
// app.use(morgan('combined'))

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/planets', planetsRouter)
app.use('/launches', launchesRouter)

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app
