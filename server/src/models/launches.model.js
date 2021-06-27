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

launches.set(launch.flightNumber, launch)

function getAllLaunches() {
  return Array.from(launches.values())
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
