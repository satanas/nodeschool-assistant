const fs = require('fs');
const ora = require('ora');
const path = require('path');
const moment = require('moment');
const mustache = require('mustache');
const request = require('request-promise-native');
const _ = require('lodash');

const {
  GITHUB_ORG,
  GITHUB_REPO,
  GITHUB_API_TOKEN,
  GITHUB_API_USER,
  MENTOR_ISSUE_TEMPLATE_PATH
} = process.env;

const GITHUB_URL = 'https://api.github.com'
const GITHUB_HEADERS = {
  Authorization: `token ${GITHUB_API_TOKEN}`,
  'User-Agent': GITHUB_API_USER
}
const mentorIssueTemplate = fs.readFileSync(path.resolve(MENTOR_ISSUE_TEMPLATE_PATH), 'utf8');

async function createMentorIssue(data) {
  const progressIndicator = ora('Creating Mentor Registration GitHub Issue').start();
  const {
    eventName,
    eventLocationName,
    eventDate,
    eventTimeStart,
    eventTimeEnd,
    meetupEventURL
  } = data;

  const startDateTime = moment(`${eventDate} ${eventTimeStart}`, 'YYYY-MM-DD hh:mma');

  const mentorArriveTime = startDateTime
    .subtract(30, 'minutes')
    .format('hh:mmA');

  const mentorIssueBody = mustache.render(mentorIssueTemplate, {
    locationName: eventLocationName,
    date: startDateTime.format('MMMM Do'),
    time: `${eventTimeStart}-${eventTimeEnd}`,
    meetupURL: meetupEventURL,
    mentorArriveTime
  });

  try {
    const response = await request.post({
      url: `${GITHUB_URL}/repos/${GITHUB_ORG}/${GITHUB_REPO}/issues`,
      headers: GITHUB_HEADERS,
      json: true,
      body: {
        title: `Mentor Registration for ${startDateTime.format('MMMM Do, YYYY')}`,
        body: mentorIssueBody
      }
    });

    const updatedData = _.assign(data, {
      mentorRegistrationUrl: response.html_url,
      mentorArriveTime
    });

    progressIndicator.succeed();
    return updatedData;
  } catch(err) {
    progressIndicator.fail();
    throw err;
  }
}

module.exports = {
  createMentorIssue
}
