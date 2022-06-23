const express = require('express')
const path = require('path')
const compression = require('compression')
const app = express()
const PORT = process.env.PORT || 9000
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const url = 'https://quiz.api.fdnd.nl/v1/question'
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({extended:false})

app.set('views', path.join(__dirname + '/views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname + '/public')))

// Routes
app.get('/', (request, response) => {
  response.render('index')
})

// POST form
// app.post('/quiz-aanmaken', urlencodedParser, (request,response) =>{
//   const postData = {
//     method: 'post',
//     body: JSON.stringify(request.body),
//     headers: {'Content-Type': 'application/json'}
//   }
//   fetchJson(url, postData).then(function () {
//     response.render('quiz-aanmaken')
//   })
// })

// app.get('/quiz-aanmaken', (request, response) => {
//     response.render('quiz-aanmaken')
// })

app.get('/quiz', (request, response) => {
  fetchJson(url).then(function (
    jsonData
  ) {
    const answers = jsonData.data.map((value) => {
      return value.incorrect_answer
    })
    console.log(answers)
    response.render('quiz', {
      questions: jsonData.data,
      possibleAnswers: answers,
    })
  })
})

// Cache Headers
app.use((req, res, next) => {
  res.set('Cache-control', 'public, max-age=300')
  next()
})

// Compress all response
app.use(compression())

// Server port
const server = app.listen(PORT, () => {
  console.log(`Application started on port: ${PORT}`)
})

// Fetch
async function fetchJson(url, postData = {}) {
  return await fetch(url, postData)
    .then((response) => response.json())
    .catch((error) => error)
}