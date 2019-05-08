const fs = require('fs');
const ora = require('ora');
const path = require('path');
const chalk = require('chalk');
const moment = require('moment');
const _ = require('lodash');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const sharp = require('sharp');
const nightmare = require('nightmare');

let {
  CHAPTER_NAME,
  SOCIAL_IMAGE_WIDTH,
  SOCIAL_IMAGE_HEIGHT
} = process.env;

SOCIAL_IMAGE_WIDTH = SOCIAL_IMAGE_WIDTH || 1200;
SOCIAL_IMAGE_HEIGHT = SOCIAL_IMAGE_HEIGHT || 630;

const WIDTH = parseInt(SOCIAL_IMAGE_WIDTH);
const HEIGHT = parseInt(SOCIAL_IMAGE_HEIGHT);

async function updateData(config, data) {
  const progressIndicator = ora('Generating website').start();
  const {
    eventDate,
    eventTimeStart,
    eventTimeEnd,
    eventLocationName,
    eventLocationAddress,
    eventRegistrationUrl,
    mentorRegistrationUrl
  } = data;

  let dataJson = JSON.parse(fs.readFileSync(config.DATA_JSON_PATH, 'utf8'));

  dataJson = _.assign(dataJson, {
    generatedAt: Date.now(),
    nextEvent: {
      dayOfTheWeek: moment(eventDate).format('dddd'),
      date: moment(eventDate).format('MMMM Do'),
      time: `${eventTimeStart}-${eventTimeEnd}`,
      address: `${eventLocationName} - ${eventLocationAddress}`,
      addressUrlSafe: encodeURIComponent(eventLocationAddress),
      mentorsUrl: mentorRegistrationUrl,
      ticketsUrl: eventRegistrationUrl
    }
  });

  fs.writeFileSync(config.DATA_JSON_PATH, JSON.stringify(dataJson, null, 2), { encoding: 'UTF8' });
  progressIndicator.succeed();
  return data;
}

async function generateSocialImage(config, data) {
  const progressIndicator = ora('Generating social image').start();
  const socialImagePath = config.SOCIAL_IMAGE_PATH;

  try {
    const result = await nightmare({ show: true })
      .viewport(WIDTH, HEIGHT)
      .goto('file://' + config.SOCIAL_HTML_PATH)
      .wait(1000)
      .screenshot(socialImagePath, {
        x: 0, y: 0,
        width: WIDTH, height: HEIGHT
      })
      .end();
    progressIndicator.succeed();
  } catch(err) {
    progressIndicator.fail();
    throw err;
  }

  // FIXME: This is not exporting correctly to PNG after resizing
  //progressIndicator.start('Resizing social image');
  //try {
  //  let data = sharp(socialImagePath)
  //    .resize(WIDTH, HEIGHT)
  //    .toBuffer();
  //  fs.writeFile(socialImagePath, data, { encoding: 'binary' });

  //  progressIndicator.succeed();
  //} catch(err) {
  //  progressIndicator.fail();
  //  throw err;
  //}

  return data;
}

// TODO: Receive a list of commands to execute (since the pipeline could be different)
async function build(config, data) {
  const progressIndicator = ora('Building website').start();
  const commands = [
    `mkdir -p ${config.DOCS_PATH}`,
    // Build HTML
    `mustache ${config.DATA_JSON_PATH} ${config.INDEX_TEMPLATE_PATH} > ${config.INDEX_HTML_PATH}`,
    `mustache ${config.DATA_JSON_PATH} ${config.SOCIAL_TEMPLATE_PATH} > ${config.SOCIAL_HTML_PATH}`,
    // Build styles
    `mkdir -p ${config.STYLES_OUTPUT_PATH} && stylus ${config.STYLES_INDEX_SRC_PATH} --out ${config.STYLES_OUTPUT_PATH} --include node_modules --include-css`,
    // Copy images
    `cp -r ${config.IMAGES_SRC_PATH} ${config.DOCS_PATH}`
  ];

  try {
    for (var i in commands) {
      progressIndicator.text = 'Executing: ' + commands[i];
      let { stdout, stderr } = await exec(commands[i]);
      if (stderr) {
        progressIndicator.fail();
        throw stderr;
      }
    }

    progressIndicator.succeed('Building website');
  } catch(err) {
    progressIndicator.fail();
    throw err;
  }

  return data;
}

async function publish(config, data) {
  const progressIndicator = ora('Publishing website').start();
  const commands = [
    `git add ${path.resolve(config.DOCS_SRC_PATH, '*')} ${path.resolve(config.DOCS_PATH, '*')}`,
    `git commit -m 'Automatic update: ${CHAPTER_NAME} - ${moment(Date.now()).format('YYYY-MM-DD hh:mmA')}'`,
    "git push"
  ];

  try {
    for (var i in commands) {
      progressIndicator.text = 'Executing: ' + commands[i];
      let { stdout, stderr } = await exec(commands[i]);
      if (stderr) {
        progressIndicator.fail();
        throw stderr;
      }
    }

    progressIndicator.succeed('Publishing website');
  } catch(err) {
    progressIndicator.fail();
    throw err;
  }

  return data;
}

module.exports = {
  updateData,
  build,
  publish,
  generateSocialImage
}
