const questions = require('./lib/questions');
const loc = require('./lib/location');

module.exports = {
  getEventData: questions.getEventData,
  previewData: questions.previewData,
  getEventLocationCoordinates: loc.getEventLocationCoordinates
}
