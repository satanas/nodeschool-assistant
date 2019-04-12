const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const moment = require('moment');

const TIME_REGEX = new RegExp('^\\d{1,2}\\:\\d{2}(AM|PM)$', 'i');
const OPERATION_CANCELED_ERR = 'Operation canceled';

const eventNameQuestion = {
  type: 'input',
  name: 'eventName',
  message: 'What is the name of the event?',
  validate: function (input) {
    if (input.length <= 0) {
      return 'You must input a name for the event!';
    }
    return true;
  }
};

const eventLocationNameQuestion = {
  type: 'input',
  name: 'eventLocationName',
  message: 'What is the name of the location of the event?',
  validate: function (input) {
    if (!input) {
      return 'You must input a location name for the event! Try again';
    }
    return true;
  }
};

const eventLocationAddressQuestion = {
  type: 'input',
  name: 'eventLocationAddress',
  message: 'Where will the event be located (address)?',
  validate: function (input) {
    if (!input) {
      return 'You must input a location for the event! Try again';
    }
    return true;
  }
};

const eventDateQuestion = {
  type: 'input',
  name: 'eventDate',
  message: 'What date will the event be on? (YYYY-MM-DD)',
  validate: function (input) {
    if (!input) {
      return 'You must input a date for the event! Try again';
    }
    const eventDateMoment = moment(input);
    if (!eventDateMoment.isValid() || eventDateMoment <= moment()) {
      return 'You must input a valid date for the event!';
    }
    return true;
  }
};

const eventTimeStartQuestion = {
  type: 'input',
  name: 'eventTimeStart',
  message: 'What time will the event start?',
  default: '1:00PM',
  validate: function (input) {
    if (!input) {
      return 'You must input a time for the event to start!';
    }
    if (!TIME_REGEX.test(input)) {
      return 'You must input a time in the proper format! (ex. 12:00PM)';
    }
    return true;
  }
};

const eventTimeIntroQuestion = {
  type: 'input',
  name: 'eventTimeIntro',
  message: 'What time will the introductions be?',
  default: '1:15PM',
  validate: function (input) {
    if (!input) {
      return 'You must input a time for the introductions and announcements! Try again';
    }
    if (!TIME_REGEX.test(input)) {
      return 'You must input a time in the proper format! (ex. 12:00PM)';
    }
    return true;
  }
};

const eventTimeFoodQuestion = {
  type: 'input',
  name: 'eventTimeFood',
  message: 'What time will the food be available?',
  default: '3:00PM',
  validate: function (input) {
    if (!input) {
      return 'You must input a time for food!';
    }
    if (!TIME_REGEX.test(input)) {
      return 'You must input a time in the proper format! (ex. 12:00PM)';
    }
    return true;
  }
};

const eventTimeLearningStartQuestion = {
  type: 'input',
  name: 'eventTimeLearningStart',
  message: 'What time will learning/mentoring start?',
  default: '1:40PM',
  validate: function (input) {
    if (!input) {
      return 'You must input a time for learning/mentoring to start!';
    }
    if (!TIME_REGEX.test(input)) {
      return 'You must input a time in the proper format! (ex. 12:00PM)';
    }
    return true;
  }
};

const eventTimeLearningEndQuestion = {
  type: 'input',
  name: 'eventTimeLearningEnd',
  message: 'What time will learning/mentoring end?',
  default: '5:00PM',
  validate: function (input) {
    if (!input) {
      return 'You must input a time for learning/mentoring to end!';
    }
    if (!TIME_REGEX.test(input)) {
      return 'You must input a time in the proper format! (ex. 12:00PM)';
    }
    return true;
  }
};

const eventTimeEndQuestion = {
  type: 'input',
  name: 'eventTimeEnd',
  message: 'What time will the event end?',
  default: '5:00PM',
  validate: function (input) {
    if (!input) {
      return 'You must input a time for the event to end!';
    }
    if (!TIME_REGEX.test(input)) {
      return 'You must input a time in the proper format! (ex. 12:00PM)';
    }
    return true;
  }
};

const previewAnswersQuestion = {
  type: 'confirm',
  name: 'previewAnswers',
  message: 'Is all the information above correct?',
  default: false
};

async function getEventData(defaultEventName) {
  eventNameQuestion.default = defaultEventName;

  return inquirer.prompt([
    eventNameQuestion,
    eventLocationNameQuestion,
    eventLocationAddressQuestion,
    eventDateQuestion,
    eventTimeStartQuestion,
    eventTimeIntroQuestion,
    eventTimeFoodQuestion,
    eventTimeLearningStartQuestion,
    eventTimeLearningEndQuestion,
    eventTimeEndQuestion
  ]);
}

async function previewData(data) {
  return new Promise((resolve, reject) => {
    console.log(chalk.yellow('Preview:'));
    for (var field in data) {
      console.log (chalk.bold('  * ' + field + ': ') + data[field]);
    }

    inquirer.prompt(previewAnswersQuestion)
    .then((result) => {
      if (result.previewAnswers) {
        resolve(data);
      } else {
        console.log(chalk.red(OPERATION_CANCELED_ERR));
        reject(OPERATION_CANCELED_ERR);
      }
    })
  });
}

module.exports = {
  getEventData,
  previewData
}
