const {
  getAllLaunches,
  addNewlaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require('../../models/launches.model')

async function HttpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches())
}

function httpAddNewLaunch(req, res) {
  const launch = req.body

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.target ||
    !launch.launchDate
  ) {
    res.status(400).json({
      error: 'Missing required launch properties',
    })
  }

  launch.launchDate = new Date(launch.launchDate)
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid Launch Date',
    })
  }

  addNewlaunch(launch)

  return res.status(201).json(launch)
}

function httpAbortLaunch(req, res) {
  const launchId = +req.params.id

  if (!existsLaunchWithId(launchId)) {
    return res.status(404).json({
      error: 'Launch Not Found!',
    })
  }
  const aborted = abortLaunchById(launchId)
  return res.status(200).json(aborted)
}

module.exports = { HttpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch }
