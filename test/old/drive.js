const Car = require('./car')

function drive () {
  var car = new Car()
  return car.drive()
}

module.exports = drive
