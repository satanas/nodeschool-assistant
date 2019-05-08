const fs = require('fs');
const ora = require('ora');
const path = require('path');
const moment = require('moment');
const mustache = require('mustache');
const request = require('request-promise-native');
const _ = require('lodash');

const {
  MEETUP_API_KEY,
  MEETUP_GROUP_ID,
  MEETUP_URLNAME,
} = process.env;

const meetup_api = require('meetup-node')(MEETUP_API_KEY);

async function createMeetupEvent(config, data) {
  const progressIndicator = ora('Creating event on Meetup.com').start();
  const {
    eventName,
    eventLocationName,
    eventLocationCoordinates,
    eventDate,
    eventTimeStart,
    eventTimeEnd,
    eventTimeIntro,
    eventTimeLearningStart,
    eventTimeLearningEnd,
    eventTimeFood,
    eventLocationAddress,
    mentorArriveTime,
    mentorRegistrationUrl
  } = data;

  const eventDescriptionTemplate = fs.readFileSync(path.resolve(config.TEMPLATES_PATH, config.EVENT_DESCRIPTION_TEMPLATE), 'utf8');
  const meetupEventBody = mustache.render(eventDescriptionTemplate, {
    eventTimeStart,
    eventTimeIntro,
    eventTimeLearningStart,
    eventTimeLearningEnd,
    eventTimeFood,
    eventTimeEnd,
    eventLocationName,
    eventLocationAddress,
    mentorArriveTime,
    mentorRegistrationUrl
  });

  const parameters = {
    description: meetupEventBody,
    group_id: MEETUP_GROUP_ID,
    group_urlname: MEETUP_URLNAME,
    name: eventName,
    lat: eventLocationCoordinates.lat,
    lon: eventLocationCoordinates.lng,
    time: moment(`${eventDate} ${eventTimeStart}`, 'YYYY-MM-DD hh:mmA').valueOf(),
    duration: getDuration(eventDate, eventTimeStart, eventTimeEnd)
  };

  try {
    const response = await meetup_api.events2.createEvent(parameters);

    if (response.hasOwnProperty('code') && response.hasOwnProperty('problem')) {
      progressIndicator.fail();
      throw response.details;
    }

    const updatedData = _.assign(data, {
      eventRegistrationUrl: response.event_url,
      meetupGroupID: response.group.id,
      meetupEventID: response.id
    });
    return updatedData;
  } catch(err) {
    progressIndicator.fail();
    throw err;
  }
}

function getDuration(date, startTime, endTime) {
  let start = moment(`${date} ${startTime}`, 'YYYY-MM-DD hh:mmA').valueOf();
  let end = moment(`${date} ${endTime}`, 'YYYY-MM-DD hh:mmA').valueOf();
  return end - start;
}

module.exports = {
  createMeetupEvent
}
