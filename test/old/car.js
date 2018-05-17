function Car () {
  this.wheels = 4
}

Car.prototype.drive = function () {
  return true
}

module.exports = Car
