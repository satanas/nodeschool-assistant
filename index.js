const path = require('path');
const questions = require('./lib/questions');
const loc = require('./lib/location');
const github = require('./lib/github');
const meetup = require('./lib/meetup');
const website = require('./lib/website');

// FIXME: Improve this configuration. Everything feels too tied up
let config = {
  DOCS_PATH: './docs',
  DOCS_SRC_PATH: './docs-src'
}
config.IMAGES_SRC_PATH = path.resolve(config.DOCS_SRC_PATH, 'images');
config.IMAGES_OUTPUT_PATH = path.resolve(config.DOCS_PATH, 'images');
config.STYLES_SRC_PATH = path.resolve(config.DOCS_SRC_PATH, 'styles');
config.STYLES_OUTPUT_PATH = path.resolve(config.DOCS_PATH, 'styles');
config.STYLES_INDEX_SRC_PATH = path.resolve(config.STYLES_SRC_PATH, 'index.styl');
config.DATA_JSON_PATH = path.resolve(config.DOCS_SRC_PATH, 'data.json');
config.TEMPLATES_PATH = path.resolve(config.DOCS_SRC_PATH, 'templates');
config.MENTOR_ISSUE_TEMPLATE = 'mentor-registration-issue.mustache';
config.EVENT_DESCRIPTION_TEMPLATE = 'event-description.mustache';
config.INDEX_TEMPLATE_PATH = path.resolve(config.TEMPLATES_PATH, 'index.mustache');
config.SOCIAL_TEMPLATE_PATH = path.resolve(config.TEMPLATES_PATH, 'social.mustache');
config.INDEX_HTML_PATH = path.resolve(config.DOCS_PATH, 'index.html');
config.SOCIAL_HTML_PATH = path.resolve(config.DOCS_PATH, 'social.html');
config.SOCIAL_IMAGE_PATH = path.resolve(config.IMAGES_OUTPUT_PATH, 'social.png');


module.exports = {
  getEventData: questions.getEventData,
  previewData: questions.previewData,
  getEventLocationCoordinates: loc.getCoordinates,
  createMeetupEvent: meetup.createMeetupEvent.bind(this, config),
  createMentorIssue: github.createMentorIssue.bind(this, config),
  updateWebsiteData: website.updateData.bind(this, config),
  buildWebsite: website.build.bind(this, config),
  publishWebsite: website.publish.bind(this, config),
  generateSocialImage: website.generateSocialImage.bind(this, config)
}
