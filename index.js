const questions = require('./lib/questions');
const loc = require('./lib/location');
const github = require('./lib/github');
const meetup = require('./lib/meetup');

module.exports = {
  getEventData: questions.getEventData,
  previewData: questions.previewData,
  getEventLocationCoordinates: loc.getEventLocationCoordinates,
  createMeetupEvent: meetup.createMeetupEvent,
  createMentorIssue: github.createMentorIssue
}
