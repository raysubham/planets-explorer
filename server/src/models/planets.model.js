const fs = require('fs')
const path = require('path')
const parse = require('csv-parse')

const planets = require('./planets.mongo')

const isHabitablePlanet = (planet) => {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  )
}

function loadAllPlanets() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
    )
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanets(data)
        }
      })
      .on('error', (err) => {
        console.log(err)
        reject(err)
      })
      .on('end', async () => {
        const planetsFound = (await getAllPlanets()).length
        console.log(`${planetsFound} planets found so far!!! `)
        // console.log(await getAllPlanets())
        resolve()
      })
  })
}

async function getAllPlanets() {
  return await planets.find({}, { _id: 0, __v: 0 })
}

async function savePlanets(planet) {
  try {
    await planets.updateOne(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true }
    )
  } catch (error) {
    console.error(`could not save the planets list ${error}`)
  }
}

module.exports = { loadAllPlanets, getAllPlanets }
