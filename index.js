const questions = require('./lib/questions');
const loc = require('./lib/location');
const github = require('./lib/github');

module.exports = {
  getEventData: questions.getEventData,
  previewData: questions.previewData,
  getEventLocationCoordinates: loc.getEventLocationCoordinates,
  createMentorIssue: github.createMentorIssue
}
