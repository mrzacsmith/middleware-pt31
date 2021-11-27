require('dotenv').config()
require('colors')
const express = require('express')

const app = express()

const oneMid = (req, res, next) => {
  console.log('oneMid')
  next()
}
const twoMid = (req, res, next) => {
  let num = Math.random()
  console.log('twoMid')
  if (num < 0.6) next({ status: 700, message: `${num} is too little` })
  next()
}
const threeMid = (req, res, next) => {
  console.log('threeMid')
  console.log('yes yes yes')
  next()
}
const numGood = (req, res, next) => {
  console.log('numGood')
  console.log('yes yes yes')
  next()
}
const numBad = (req, res, next) => {
  console.log('numBad')
  console.log('no no non')
  next()
}

app.get('/', twoMid, (req, res) => {
  res.json({
    message: 'running the world is bad vodoo',
    status: 'ok',
    time: new Date().toLocaleTimeString(),
  })
})
let testNum = Math.random()

app.get(
  '/mid',
  twoMid,
  threeMid,
  oneMid,
  twoMid,
  testNum > 0.25 ? numGood : numBad,
  (req, res) => {
    res.json({
      message: '/mid',
      time: new Date().toLocaleTimeString(),
    })
  }
)

// middleware needs to: 1. pass code along, or 2. reject
const restricted = (req, res, next) => {
  if (req.session.user) {
    next()
  }
  next({ status: 401, message: 'Bad Credentials' })
}

app.use('*', (req, res, next) => {
  console.log('this route does not exist')
  next({
    status: 404,
    message: 'not the route you are looking for',
  })
})

app.use((err, req, res, next) => {
  // eslint-disable-line
  console.log(err.status, 'ERROR STATUS')
  res.status(err.status || 500).json({
    error: 'This is the error catch all',
    message: err.message,
    stack: err.stack,
  })
})

const PORT = process.env.PORT || 3030

app.listen(PORT, () =>
  console.log(`\n** server is listening on port ${PORT}`.cyan)
)
