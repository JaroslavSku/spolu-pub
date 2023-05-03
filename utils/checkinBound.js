function checkInBound(bottomLeft, topRight, point) {
  let isLongInRange;
  let isLatiInRange;
  isLongInRange = point.lng >= bottomLeft.lng && point.lng <= topRight.lng;
  isLatiInRange = point.lat >= bottomLeft.lat && point.lat <= topRight.lat;
  return isLongInRange && isLatiInRange;
}

module.exports = checkInBound;
