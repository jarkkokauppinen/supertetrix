const express = require('express')
const app = express()

require('dotenv').config()

app.use('/static', express.static('./static/'))

const PORT = process.env.PORT

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.listen(PORT, () => {
  console.log(`app running on localhost:${PORT}`)
})