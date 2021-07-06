const request = require('supertest')
const app = require('../../app')
const { mongoConnect, mongoDisconnect } = require('./../../services/mongo')

//remember that these tests will add invalid data to production db, so the better solution to this is using a separte testing db for running these tests. so just use another mongo URL env.

describe('Testing Launches API', () => {
  beforeAll(async () => {
    await mongoConnect()
  })
  afterAll(async () => {
    await mongoDisconnect()
  })

  describe('Test GET /launches', () => {
    test('should respond with 200 success', async () => {
      const response = await request(app)
        .get('/launches')
        .expect(200)
        .expect('Content-Type', /json/)
    })
  })

  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: 'Kepler Exploration X',
      rocket: 'Explorer IS1',
      target: 'Kepler-442 b',
      launchDate: 'December 25, 2025',
    }

    const launchDataWithoutDate = {
      mission: 'Kepler Exploration X',
      rocket: 'Explorer IS1',
      target: 'Kepler-442 b',
    }

    const launchDataWithInvalidDate = {
      mission: 'Kepler Exploration X',
      rocket: 'Explorer IS1',
      target: 'Kepler-442 b',
      launchDate: 'Bizarre',
    }

    test('should respond with 201 created', async () => {
      const response = await request(app)
        .post('/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201)

      const requestDate = new Date(completeLaunchData.launchDate).valueOf()
      const responseDate = new Date(response.body.launchDate).valueOf()

      expect(responseDate).toBe(requestDate)

      expect(response.body).toMatchObject(launchDataWithoutDate)
    })

    test('should catch missing required properties', async () => {
      const response = await request(app)
        .post('/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400)

      expect(response.body).toStrictEqual({
        error: 'Missing required launch properties',
      })
    })

    test('should catch invalid dates', async () => {
      const response = await request(app)
        .post('/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400)

      expect(response.body).toStrictEqual({ error: 'Invalid Launch Date' })
    })
  })
})
