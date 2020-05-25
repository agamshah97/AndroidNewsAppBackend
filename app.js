const express = require('express')
var cors = require('cors')

const app = express()
const PORT = process.env.PORT || 8080;

app.use(cors())

const homeroute = require("./routes/home")
const worldroute = require("./routes/world")
const politicsroute = require("./routes/politics")
const businessroute = require("./routes/business")
const technologyroute = require("./routes/technology")
const sportsroute = require("./routes/sports")
const articleroute = require("./routes/article")
const searchroute = require("./routes/search")
const scienceroute = require("./routes/science")
const googletrends = require("./routes/trends")

app.use('/home', homeroute);
app.use('/world', worldroute);
app.use('/politics', politicsroute);
app.use('/business', businessroute);
app.use('/technology', technologyroute);
app.use('/sports', sportsroute);
app.use('/science', scienceroute);
app.use('/article', articleroute);
app.use('/search', searchroute);
app.use("/trends", googletrends);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

//404 Responses
app.use(function (req, res, next) {
  res.status(404).json({"message" : "Sorry can't find that resource!"})
})

//Error Handling
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({"message" : 'Some Error at the Server Side!'})
})

module.exports = app;