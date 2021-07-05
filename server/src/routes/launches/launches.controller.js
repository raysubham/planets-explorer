const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require('../../models/launches.model')

async function HttpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches())
}

async function httpAddNewLaunch(req, res) {
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

  await scheduleNewLaunch(launch)

  return res.status(201).json(launch)
}

async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id

  const existslaunch = await existsLaunchWithId(launchId)

  if (!existslaunch) {
    return res.status(404).json({
      error: 'Launch Not Found!',
    })
  }
  const aborted = await abortLaunchById(launchId)
  if (!aborted) {
    return res.status(400).json({
      error: 'Launch Not aborted!',
    })
  }
  return res.status(200).json({ ok: true })
}

module.exports = { HttpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch }
