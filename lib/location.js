const ora = require('ora');
const request = require('request-promise-native');
const _ = require('lodash');

const BING_MAPS_API_URL = 'http://dev.virtualearth.net/REST/v1/Locations';

const {
  BING_MAPS_API_KEY
} = process.env;

async function getEventLocationCoordinates(data) {
  const progressIndicator = ora('Getting event location latitude and longitude').start();
  const { eventLocationAddress } = data;

  try {
    const response = await request.get({
      url: BING_MAPS_API_URL,
      json: true,
      qs: {
        addressLine: eventLocationAddress.replace(/\s/, '+'),
        key: BING_MAPS_API_KEY
      }
    });

    if (response.statusCode != 200) {
      throw response.statusDescription;
    } else {
      const resource = response.resourceSets[0].resources[0];
      const eventLocationCoordinates = {
        lat: resource.point.coordinates[0],
        lng: resource.point.coordinates[1]
      }
      const updatedData = _.assign(data, { eventLocationCoordinates });
      progressIndicator.succeed();
      return updatedData;
    }
  } catch(err) {
    progressIndicator.fail();
    throw err;
  }
}

module.exports= {
  getEventLocationCoordinates
}
