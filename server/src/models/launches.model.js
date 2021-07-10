const axios = require('axios')

const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')

const STARTING_FLIGHT_NUMBER = 1000

//Hard-Coded Launch Data
// const launches = new Map()

// const launch = {
//   mission: 'Kepler Exploration X',
//   rocket: 'Explorer IS1',
//   launchDate: new Date('December 27, 2030'),
//   target: 'Kepler-442 b',
//   customers: ['RAY', 'NASA'],
//   upcoming: true,
//   success: true,
//   flightNumber: 1000,
// }

// saveLaunch(launch)

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches() {
  console.log('Downloading launches data !!!!!!')

  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        { path: 'payloads', select: { customers: 1 } },
      ],
    },
  })

  if (response.status !== 200) {
    console.log('Problem Downloading launches Data!')
    throw new Error('API not serving requests!')
  }

  const launchDocs = response.data.docs
  for (const launchDoc of launchDocs) {
    //getting customers using flatmap method which turns arrays of arrays into a single array
    const payloads = launchDoc['payloads']
    const customers = payloads.flatMap((payload) => {
      return payload['customers']
    })

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    }
    // console.log(`${launch.flightNumber} ${launch.mission}`)

    await saveLaunch(launch)
  }
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter)
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  })
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    mission: 'FalconSat',
    rocket: 'Falcon 1',
  })

  if (firstLaunch) {
    console.log('Launches Data already exists!!!!!')
  } else {
    await populateLaunches()
  }
}

async function getAllLaunches(skip, limit) {
  return await launchesDatabase
    .find({}, { _id: 0, __V: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit)
}

async function saveLaunch(launch) {
  await launchesDatabase.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  )
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
  const planet = await planets.findOne({ keplerName: launch.target })

  if (!planet) {
    throw new Error('No matching planets found!!!')
  }

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
  loadLaunchesData,
  abortLaunchById,
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
}
