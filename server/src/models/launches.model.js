const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')

const launches = new Map()

let latestFlightNumber = 100

const launch = {
  flightNumber: 100,
  upcoming: true,
  success: true,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['RAY', 'NASA'],
}

saveLaunch(launch)

async function getAllLaunches() {
  return await launchesDatabase.find({}, { _id: 0, __V: 0 })
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target })

  if (!planet) {
    throw new Error('No matching planets found!!!')
  }

  await launchesDatabase.updateOne(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  )
}

function existsLaunchWithId(launchId) {
  return launches.has(launchId)
}

function addNewlaunch(launch) {
  latestFlightNumber++
  launches.set(
    latestFlightNumber,
    Object.assign(
      {
        upcoming: true,
        success: true,
        customers: ['RAY', 'NASA'],
        flightNumber: latestFlightNumber,
      },
      launch
    )
  )
}

function abortLaunchById(launchId) {
  const abortedLaunch = launches.get(launchId)

  abortedLaunch.upcoming = false
  abortedLaunch.success = false

  return abortedLaunch
}

module.exports = {
  abortLaunchById,
  getAllLaunches,
  addNewlaunch,
  existsLaunchWithId,
}
