require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIEDEX = require('./moviedex.json')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting));
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware  
    next()
  })

app.use(morgan('dev'))

app.get('/movie', function handleGetPokemon(req, res) {
    let response = MOVIEDEX;
  
    // filter our movie by genre if genre query param is present
    if (req.query.genre) {
      response = response.filter(movie =>
        // case insensitive searching
        movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
      )
    }

    // filter our movie by country if country query param is present
    if (req.query.country) {
      response = response.filter(movie =>
        // case insensitive searching
        movie.country.toLowerCase().includes(req.query.country.toLowerCase())
      )
    }

    // filter our movie by avg_vote if avg_vote query param is present
    if (req.query.avg_vote) {
      response = response.filter(movie =>
        // case insensitive searching
        movie.avg_vote >= Number(req.query.avg_vote)
      )
    }
  
    res.json(response)
  })
  const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})