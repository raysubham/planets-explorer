const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')

const launches = new Map()

const STARTING_FLIGHT_NUMBER = 1000

// const launch = {
//   mission: 'Kepler Exploration X',
//   rocket: 'Explorer IS1',
//   launchDate: new Date('December 27, 2030'),
//   target: 'Kepler-442 b',
//   customers: ['RAY', 'NASA'],
//   upcoming: true,
//   success: true,
//   flightNumber: 100,
// }

//

async function getAllLaunches() {
  return await launchesDatabase.find({}, { _id: 0, __V: 0 })
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target })

  if (!planet) {
    throw new Error('No matching planets found!!!')
  }

  await launchesDatabase.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  )
}

async function existsLaunchWithId(launchId) {
  return await launchesDatabase.findOne({
    flightNumber: launchId,
  })
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber')

  if (!latestLaunch) {
    return STARTING_FLIGHT_NUMBER
  }
  return latestLaunch.flightNumber
}

// function addNewlaunch(launch) {
//   latestFlightNumber++
//   launches.set(
//     latestFlightNumber,
//     Object.assign(
// {
//   upcoming: true,
//   success: true,
//   customers: ['RAY', 'NASA'],
//   flightNumber: latestFlightNumber,
// },
// launch
//     )
//   )
// }

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1

  const newLaunch = Object.assign(
    {
      customers: ['RAY', 'NASA'],
      upcoming: true,
      success: true,
      flightNumber: newFlightNumber,
    },
    launch
  )

  await saveLaunch(newLaunch)
}

async function abortLaunchById(launchId) {
  // old code with map object in state
  //   const abortedLaunch = launches.get(launchId)
  //   abortedLaunch.upcoming = false
  //   abortedLaunch.success = false
  //   return abortedLaunch

  const aborted = await launchesDatabase.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  )

  return aborted.ok === 1 && aborted.nModified === 1
}

module.exports = {
  abortLaunchById,
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
}
