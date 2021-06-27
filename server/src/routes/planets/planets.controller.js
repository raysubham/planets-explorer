const { getAllPlanets } = require('../../models/planets.model')
function HttpGetAllPlanets(req, res) {
  return res.status(200).json(getAllPlanets())
}

module.exports = { HttpGetAllPlanets }
